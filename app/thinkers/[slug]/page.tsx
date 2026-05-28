import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { THINKER_QUERY, THINKER_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { accessTier } from "@/lib/sanity-helpers"
import type { ThinkerProfile } from "@/components/thinker/types"
import ThinkerView from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: THINKER_SLUGS_QUERY,
    tags: ["thinker"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ name: string; thinkerTitle?: string } | null>({
    query: THINKER_QUERY,
    params: { slug },
    tags: ["thinker"],
  })
  if (!raw) return {}
  return {
    title: `${raw.name} — Indart`,
    description: raw.thinkerTitle ?? undefined,
  }
}

export default async function ThinkerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityThinker | null>({
    query: THINKER_QUERY,
    params: { slug },
    tags: ["thinker"],
  })

  if (!raw) notFound()

  const thinker: ThinkerProfile = {
    name: raw.name,
    thinkerTitle: raw.thinkerTitle,
    portrait: raw.portrait ? imageUrl.portrait(raw.portrait) : "",
    nationality: raw.nationality ?? "",
    region: raw.region,
    born: raw.born,
    era: raw.era ?? "Contemporary",
    disciplines: (raw.disciplines ?? []).map((d) => d.name),
    themes: (raw.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
    philosophyStatement: raw.philosophyStatement ?? "",
    philosophyBody: raw.philosophyBody ?? [],
    quote: raw.quote ?? "",
    quoteContext: raw.quoteContext,
    readingList: (raw.readingList ?? []).map((b) => ({
      title: b.title,
      author: b.author,
      year: b.year ?? "",
      note: b.note ?? "",
    })),
    journeys: (raw.journeys ?? []).map((j) => ({
      slug: j.slug,
      title: j.title,
      tagline: j.tagline ?? "",
      lessonCount: j.lessonCount ?? 0,
      duration: j.duration ?? "",
      level: j.level ?? "Introductory",
      access: accessTier(j.access),
      coverImage: j.coverImage ? imageUrl.cover(j.coverImage) : "",
      disciplines: (j.disciplines ?? []).map((d) => d.name),
    })),
    conversations: (raw.conversations ?? []).map((c) => {
      const partner = c.participants?.find((p) => p.thinker?.slug !== slug) ?? c.participants?.[0]
      return {
        slug: c.slug,
        title: c.title,
        partner: {
          name: partner?.thinker?.name ?? "",
          slug: partner?.thinker?.slug ?? "",
          portrait: partner?.thinker?.portrait ? imageUrl.thumbnail(partner.thinker.portrait) : "",
          thinkerTitle: partner?.thinker?.thinkerTitle ?? "",
        },
        type: c.type ?? "dialogue",
        duration: c.duration ?? "",
        year: c.publishedAt ? new Date(c.publishedAt).getFullYear().toString() : "",
      }
    }),
    archiveItems: (raw.archiveItems ?? []).map((a) => ({
      slug: a.slug,
      title: a.title,
      type: a.type ?? "text",
      date: a.date ?? "",
      origin: a.origin ?? "",
      description: "",
      coverImage: a.coverImage ? imageUrl.card(a.coverImage) : "",
    })),
    featuredLessons: [],
    relatedThinkers: [],
  }

  return <ThinkerView thinker={thinker} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityThinker = {
  _id: string
  name: string
  thinkerTitle?: string
  portrait?: unknown
  nationality?: string
  region?: string
  born?: string
  era?: string
  philosophyStatement?: string
  philosophyBody?: string[]
  quote?: string
  quoteContext?: string
  disciplines?: { name: string }[]
  themes?: { name: string; slug: string; color?: string }[]
  readingList?: { title: string; author: string; year?: string; note?: string }[]
  journeys?: {
    slug: string; title: string; tagline?: string; coverImage?: unknown
    level?: string; duration?: string
    access?: { tier: string | null }
    lessonCount?: number
    disciplines?: { name: string }[]
  }[]
  conversations?: {
    slug: string; title: string; type?: string; duration?: string; publishedAt?: string
    participants?: { thinker?: { slug?: string; name?: string; portrait?: unknown; thinkerTitle?: string } }[]
  }[]
  archiveItems?: {
    slug: string; title: string; type?: string; date?: string; origin?: string; coverImage?: unknown
  }[]
}
