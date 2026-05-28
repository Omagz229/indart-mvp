import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { DISCIPLINE_QUERY, DISCIPLINE_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { ptToStrings } from "@/lib/sanity-helpers"
import DisciplineDetailView, { type DisciplineDetail } from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: DISCIPLINE_SLUGS_QUERY,
    tags: ["discipline"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ name: string; statement?: string } | null>({
    query: DISCIPLINE_QUERY,
    params: { slug },
    tags: ["discipline"],
  })
  if (!raw) return {}
  return {
    title: `${raw.name} — Indart`,
    description: raw.statement ?? undefined,
  }
}

export default async function DisciplinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityDiscipline | null>({
    query: DISCIPLINE_QUERY,
    params: { slug },
    tags: ["discipline"],
  })

  if (!raw) notFound()

  const discipline: DisciplineDetail = {
    slug: raw.slug,
    name: raw.name,
    region: raw.region ?? "",
    statement: raw.statement ?? "",
    description: ptToStrings((raw.description ?? []) as Parameters<typeof ptToStrings>[0]),
    coverImage: raw.coverImage ? imageUrl.cover(raw.coverImage) : "",
    themes: (raw.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
    relatedDisciplines: (raw.relatedDisciplines ?? []).map((d) => ({ slug: d.slug ?? "", name: d.name ?? "" })),
    featuredThinkers: (raw.featuredThinkers ?? []).map((t) => ({
      slug: t.slug ?? "",
      name: t.name ?? "",
      portrait: t.portrait ? imageUrl.thumbnail(t.portrait) : "",
    })),
    featuredJourneys: (raw.featuredJourneys ?? []).map((j) => ({
      slug: j.slug ?? "",
      title: j.title ?? "",
      thinkerName: j.thinker?.name ?? "",
      episodeCount: j.lessonCount ?? 0,
    })),
  }

  return <DisciplineDetailView discipline={discipline} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityDiscipline = {
  _id: string
  slug: string
  name: string
  region?: string
  era?: string
  statement?: string
  description?: unknown[]
  coverImage?: unknown
  themes?: { name: string; slug: string; color?: string }[]
  relatedDisciplines?: { slug?: string; name?: string }[]
  featuredThinkers?: { slug?: string; name?: string; portrait?: unknown; thinkerTitle?: string }[]
  featuredJourneys?: {
    slug?: string
    title?: string
    lessonCount?: number
    thinker?: { name?: string; slug?: string }
  }[]
}
