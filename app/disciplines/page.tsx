import { sanityFetch } from "@/sanity/lib/fetch"
import { DISCIPLINES_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import DisciplinesView, { type DisciplineItem } from "./view"

export default async function DisciplinesPage() {
  const raw = await sanityFetch<SanityDiscipline[]>({
    query: DISCIPLINES_QUERY,
    tags: ["discipline"],
  })

  const disciplines: DisciplineItem[] = raw.map((d) => ({
    slug: d.slug,
    name: d.name,
    region: d.region ?? "",
    statement: d.statement ?? "",
    coverImage: d.coverImage ? imageUrl.card(d.coverImage) : "",
    thinkerCount: d.thinkerCount ?? 0,
    journeyCount: d.journeyCount ?? 0,
    themes: (d.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
  }))

  return <DisciplinesView disciplines={disciplines} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityDiscipline = {
  _id: string
  slug: string
  name: string
  region?: string
  statement?: string
  coverImage?: unknown
  thinkerCount?: number
  journeyCount?: number
  themes?: { name: string; slug: string; color?: string }[]
}
