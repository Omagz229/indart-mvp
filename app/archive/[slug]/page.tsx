import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { ARCHIVE_ITEM_QUERY, ARCHIVE_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { accessTier, ptToStrings } from "@/lib/sanity-helpers"
import ArchiveItemView, { type ArchiveItemDetail } from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: ARCHIVE_SLUGS_QUERY,
    tags: ["archiveItem"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ title: string; creator?: string } | null>({
    query: ARCHIVE_ITEM_QUERY,
    params: { slug },
    tags: ["archiveItem"],
  })
  if (!raw) return {}
  return {
    title: `${raw.title} — Indart Archive`,
    description: raw.creator ? `By ${raw.creator}` : undefined,
  }
}

export default async function ArchiveItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityArchiveItem | null>({
    query: ARCHIVE_ITEM_QUERY,
    params: { slug },
    tags: ["archiveItem"],
  })

  if (!raw) notFound()

  const item: ArchiveItemDetail = {
    slug: raw.slug,
    title: raw.title,
    type: raw.type ?? "text",
    creator: raw.creator ?? "",
    date: raw.date ?? "",
    origin: raw.origin ?? "",
    era: raw.era ?? "",
    medium: raw.medium ?? "",
    description: ptToStrings((raw.description ?? []) as Parameters<typeof ptToStrings>[0]).join(" "),
    annotation: ptToStrings((raw.annotation ?? []) as Parameters<typeof ptToStrings>[0]),
    imageUrl: raw.coverImage ? imageUrl.cover(raw.coverImage) : "",
    themes: (raw.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
    relatedThinkers: (raw.relatedThinkers ?? []).map((t) => ({
      slug: t.slug ?? "",
      name: t.name ?? "",
      portrait: t.portrait ? imageUrl.thumbnail(t.portrait) : "",
    })),
    access: accessTier(raw.access),
  }

  return <ArchiveItemView item={item} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityArchiveItem = {
  _id: string
  slug: string
  title: string
  type?: string
  creator?: string
  date?: string
  origin?: string
  era?: string
  medium?: string
  description?: unknown[]
  annotation?: unknown[]
  coverImage?: unknown
  access?: { tier: string | null }
  themes?: { name: string; slug: string; color?: string }[]
  relatedThinkers?: { slug?: string; name?: string; portrait?: unknown; thinkerTitle?: string }[]
}
