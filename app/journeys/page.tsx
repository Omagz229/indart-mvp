import { sanityFetch } from "@/sanity/lib/fetch"
import { JOURNEYS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { accessTier } from "@/lib/sanity-helpers"
import JourneysView, { type JourneyItem } from "./view"

export default async function JourneysPage() {
  const raw = await sanityFetch<SanityJourney[]>({
    query: JOURNEYS_QUERY,
    tags: ["journey"],
  })

  const journeys: JourneyItem[] = raw.map((j) => ({
    slug: j.slug,
    title: j.title,
    tagline: j.tagline ?? "",
    thinkerName: j.thinker?.name ?? "",
    thinkerTitle: j.thinker?.thinkerTitle ?? "",
    disciplines: (j.disciplines ?? []).map((d) => d.name),
    coverImage: j.coverImage ? imageUrl.cover(j.coverImage) : "",
    episodeCount: j.lessonCount ?? 0,
    duration: j.duration ?? "",
    level: j.level ?? "Introductory",
    access: accessTier(j.access),
    themes: (j.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
  }))

  return <JourneysView journeys={journeys} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityJourney = {
  _id: string
  slug: string
  title: string
  tagline?: string
  coverImage?: unknown
  level?: string
  duration?: string
  access?: { tier: string | null; previewable?: boolean }
  lessonCount?: number
  thinker?: { name?: string; thinkerTitle?: string }
  disciplines?: { name: string }[]
  themes?: { name: string; slug: string; color?: string }[]
}
