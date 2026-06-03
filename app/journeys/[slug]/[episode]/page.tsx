import { notFound } from "next/navigation"
import { groq } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/fetch"
import { imageUrl } from "@/sanity/lib/image"
import { ptToBodyBlocks, ptToStrings, accessTier, contentTier } from "@/lib/sanity-helpers"
import { getIndartUser } from "@/lib/auth/server"
import { hasAccess } from "@/lib/auth/tier"
import AccessGate from "@/components/membership/access-gate"
import LessonPlayerView, { type LessonDetail, type SidebarLesson } from "./view"

// ─── Query ────────────────────────────────────────────────────────────────────
// Fetches a lesson by journey slug + episode number — matches the URL pattern
// /journeys/[slug]/[episode] where episode is the integer lesson number.

const EPISODE_QUERY = groq`
  *[_type == "lesson"
    && journey->slug.current == $journeySlug
    && number == $number
  ][0] {
    _id,
    title,
    "slug": slug.current,
    kind,
    number,
    duration,
    description,
    content,
    transcript,
    videoUrl,
    learningObjectives,
    discussionPrompts,
    "thumbnail": thumbnail{ asset, hotspot, crop },
    "access": access{ tier, previewable },
    "journey": journey->{
      title,
      "slug": slug.current,
      level,
      "coverImage": coverImage{ asset, hotspot, crop },
      "thinker": thinker->{
        name,
        "slug": slug.current,
        thinkerTitle,
        philosophyStatement,
        "portrait": portrait{ asset, hotspot, crop }
      },
      "lessons": lessons[]->{
        title,
        "slug": slug.current,
        kind,
        number,
        duration,
        "access": access{ tier, previewable }
      }
    }
  }
`

// ─── Sanity response type ─────────────────────────────────────────────────────

type SanityImage = { asset?: unknown; hotspot?: unknown; crop?: unknown } | null

type SanityLesson = {
  _id: string
  title: string
  slug: string
  kind: string | null
  number: number | null
  duration: string | null
  description: string | null
  content: unknown[] | null
  transcript: unknown[] | null
  videoUrl: string | null
  learningObjectives: string[] | null
  discussionPrompts: string[] | null
  thumbnail: SanityImage
  access: { tier: string | null; previewable?: boolean } | null
  journey: {
    title: string
    slug: string
    level: string | null
    coverImage: SanityImage
    thinker: {
      name: string
      slug: string
      thinkerTitle: string | null
      philosophyStatement: string | null
      portrait: SanityImage
    } | null
    lessons: Array<{
      title: string
      slug: string
      kind: string | null
      number: number | null
      duration: string | null
      access: { tier: string | null } | null
    }> | null
  } | null
} | null

// ─── Data mapper ──────────────────────────────────────────────────────────────

function mapLesson(raw: SanityLesson, epNum: number, journeySlug: string): LessonDetail | null {
  if (!raw || !raw.journey) return null

  const thinker = raw.journey.thinker

  const sidebarLessons: SidebarLesson[] = (raw.journey.lessons ?? []).map((l) => ({
    slug: l.slug,
    title: l.title,
    number: l.number,
    kind: l.kind ?? "lesson",
    duration: l.duration ?? "–",
    access: accessTier(l.access),
  }))

  // Sort lessons by number so sidebar order is stable
  sidebarLessons.sort((a, b) => (a.number ?? 0) - (b.number ?? 0))

  const coverImageSrc =
    raw.thumbnail
      ? imageUrl.cover(raw.thumbnail as Parameters<typeof imageUrl.cover>[0])
      : raw.journey.coverImage
      ? imageUrl.cover(raw.journey.coverImage as Parameters<typeof imageUrl.cover>[0])
      : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&h=900&fit=crop&auto=format"

  const thinkerPortraitSrc =
    thinker?.portrait
      ? imageUrl.portrait(thinker.portrait as Parameters<typeof imageUrl.portrait>[0])
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"

  return {
    slug: raw.slug ?? `${journeySlug}-${epNum}`,
    title: raw.title,
    kind: (raw.kind as LessonDetail["kind"]) ?? "lesson",
    number: raw.number,
    duration: raw.duration ?? "–",
    description: raw.description ?? "",
    bodyBlocks: ptToBodyBlocks((raw.content as Parameters<typeof ptToBodyBlocks>[0]) ?? []),
    transcript: ptToStrings((raw.transcript as Parameters<typeof ptToStrings>[0]) ?? []),
    objectives: raw.learningObjectives ?? [],
    prompts: raw.discussionPrompts ?? [],
    videoUrl: raw.videoUrl ?? "",
    coverImage: coverImageSrc,
    access: accessTier(raw.access),
    journey: {
      slug: raw.journey.slug,
      title: raw.journey.title,
      level: raw.journey.level ?? "Foundational",
      coverImage:
        raw.journey.coverImage
          ? imageUrl.cover(raw.journey.coverImage as Parameters<typeof imageUrl.cover>[0])
          : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&h=900&fit=crop&auto=format",
      thinkerName: thinker?.name ?? "Scholar",
      thinkerSlug: thinker?.slug ?? "",
      thinkerTitle: thinker?.thinkerTitle ?? "",
      thinkerPortrait: thinkerPortraitSrc,
      thinkerQuote: thinker?.philosophyStatement ?? "",
      lessons: sidebarLessons,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episode: string }>
}) {
  const { slug, episode } = await params
  const epNum = parseInt(episode, 10)

  if (isNaN(epNum) || epNum < 1) notFound()

  const raw = await sanityFetch<SanityLesson>({
    query: EPISODE_QUERY,
    params: { journeySlug: slug, number: epNum },
    tags: ["lesson"],
  }).catch(() => null)

  if (!raw) notFound()

  // ── Server-side access check ────────────────────────────────────────────────
  // getIndartUser() hits Clerk API for fresh tier data — not from JWT cache.
  // This ensures a canceled subscriber cannot access premium content for the
  // full JWT TTL window after downgrade.
  const indartUser = await getIndartUser()
  const userTier = indartUser?.tier ?? "free"
  const required = contentTier(raw.access)

  if (!hasAccess(userTier, required, indartUser?.accessUntil)) {
    return (
      <AccessGate
        tier={required === "founding-patron" ? "founding-patron" : "scholar"}
        context={`${raw.title} — ${raw.journey?.title ?? "this Journey"}`}
        previewHeight={0}
      >
        {/* No preview content for episode gate — show only the invitation */}
        <div />
      </AccessGate>
    )
  }

  const lesson = mapLesson(raw, epNum, slug)
  if (!lesson) notFound()

  return <LessonPlayerView lesson={lesson} />
}
