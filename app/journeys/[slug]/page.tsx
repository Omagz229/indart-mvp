import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { JOURNEY_QUERY, JOURNEY_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { accessTier } from "@/lib/sanity-helpers"
import JourneyDetailView, { type JourneyDetail } from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: JOURNEY_SLUGS_QUERY,
    tags: ["journey"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ title: string; tagline?: string } | null>({
    query: JOURNEY_QUERY,
    params: { slug },
    tags: ["journey"],
  })
  if (!raw) return {}
  return {
    title: `${raw.title} — Indart`,
    description: raw.tagline ?? undefined,
  }
}

export default async function JourneyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityJourney | null>({
    query: JOURNEY_QUERY,
    params: { slug },
    tags: ["journey"],
  })

  if (!raw) notFound()

  const journey: JourneyDetail = {
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline ?? "",
    description: raw.description ?? "",
    thinkerName: raw.thinker?.name ?? "",
    thinkerTitle: raw.thinker?.thinkerTitle ?? "",
    thinkerPortrait: raw.thinker?.portrait ? imageUrl.thumbnail(raw.thinker.portrait) : "",
    thinkerBio: raw.thinker?.philosophyStatement ?? "",
    episodeCount: raw.lessons?.length ?? 0,
    duration: raw.duration ?? "",
    level: raw.level ?? "",
    access: accessTier(raw.access),
    disciplines: (raw.disciplines ?? []).map((d) => d.name),
    themes: (raw.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
    prerequisites: (raw.prerequisites ?? []).map((p) => ({
      slug: p.slug,
      title: p.title,
      thinkerName: p.thinker?.name ?? "",
      level: p.level ?? "",
    })),
    coverImage: raw.coverImage ? imageUrl.cover(raw.coverImage) : "",
    episodes: (raw.lessons ?? []).map((l) => ({
      number: l.number,
      title: l.title,
      duration: l.duration ?? "",
      description: l.description ?? "",
      access: accessTier(l.access),
    })),
  }

  return <JourneyDetailView journey={journey} slug={slug} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityJourney = {
  _id: string
  slug: string
  title: string
  tagline?: string
  description?: string
  coverImage?: unknown
  level?: string
  duration?: string
  access?: { tier: string | null }
  thinker?: {
    name?: string
    portrait?: unknown
    thinkerTitle?: string
    philosophyStatement?: string
  }
  disciplines?: { name: string }[]
  themes?: { name: string; slug: string; color?: string }[]
  prerequisites?: {
    slug: string
    title: string
    level?: string
    thinker?: { name?: string }
  }[]
  lessons?: {
    _id: string
    title: string
    number: number
    duration?: string
    description?: string
    access?: { tier: string | null }
  }[]
}
