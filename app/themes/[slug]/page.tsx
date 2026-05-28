import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { THEME_QUERY, THEME_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import ThemeDetailView, { type ThemeDetailProps } from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: THEME_SLUGS_QUERY,
    tags: ["theme"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ name: string; tagline?: string } | null>({
    query: THEME_QUERY,
    params: { slug },
    tags: ["theme"],
  })
  if (!raw) return {}
  return {
    title: `${raw.name} — Indart`,
    description: raw.tagline ?? undefined,
  }
}

export default async function ThemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityThemeDetail | null>({
    query: THEME_QUERY,
    params: { slug },
    tags: ["theme"],
  })

  if (!raw) notFound()

  const theme: ThemeDetailProps = {
    name: raw.name,
    slug: raw.slug,
    tagline: raw.tagline,
    description: raw.description,
    color: raw.color,
    coverImageUrl: raw.coverImage ? imageUrl.cover(raw.coverImage) : undefined,
    relatedThemes: (raw.relatedThemes ?? []).map((t) => ({
      name: t.name,
      slug: t.slug,
      color: t.color,
    })),
    thinkers: (raw.thinkers ?? []).map((t) => ({
      slug: t.slug,
      name: t.name,
      portrait: t.portrait ? imageUrl.thumbnail(t.portrait) : undefined,
      thinkerTitle: t.thinkerTitle,
      nationality: t.nationality,
      era: t.era,
    })),
    journeys: (raw.journeys ?? []).map((j) => ({
      slug: j.slug,
      title: j.title,
      tagline: j.tagline,
      coverImageUrl: j.coverImage ? imageUrl.card(j.coverImage) : undefined,
      thinkerName: j.thinker?.name,
      level: j.level,
      lessonCount: j.lessonCount,
    })),
    conversations: (raw.conversations ?? []).map((c) => ({
      slug: c.slug,
      title: c.title,
      excerpt: c.excerpt,
      coverImageUrl: c.coverImage ? imageUrl.thumbnail(c.coverImage) : undefined,
      type: c.type,
    })),
    archiveItems: (raw.archiveItems ?? []).map((a) => ({
      slug: a.slug,
      title: a.title,
      type: a.type,
      date: a.date,
      creator: a.creator,
      coverImageUrl: a.coverImage ? imageUrl.card(a.coverImage) : undefined,
    })),
    journalEntries: (raw.journalEntries ?? []).map((j) => ({
      slug: j.slug,
      title: j.title,
      excerpt: j.excerpt,
      coverImageUrl: j.coverImage ? imageUrl.thumbnail(j.coverImage) : undefined,
      authorName: j.author?.name ?? j.authorName,
      publishedAt: j.publishedAt,
    })),
  }

  return <ThemeDetailView {...theme} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityThemeDetail = {
  _id: string
  name: string
  slug: string
  color?: string
  tagline?: string
  description?: string
  coverImage?: unknown
  relatedThemes?: { name: string; slug: string; color?: string }[]
  thinkers?: {
    _id: string; slug: string; name: string; portrait?: unknown
    thinkerTitle?: string; nationality?: string; era?: string
  }[]
  journeys?: {
    _id: string; slug: string; title: string; tagline?: string
    coverImage?: unknown; level?: string; lessonCount?: number
    thinker?: { name?: string }
  }[]
  conversations?: {
    _id: string; slug: string; title: string; excerpt?: string
    coverImage?: unknown; type?: string
  }[]
  archiveItems?: {
    _id: string; slug: string; title: string; type?: string
    date?: string; creator?: string; coverImage?: unknown
  }[]
  journalEntries?: {
    _id: string; slug: string; title: string; excerpt?: string
    coverImage?: unknown; publishedAt?: string
    author?: { name?: string }
    authorName?: string
  }[]
}
