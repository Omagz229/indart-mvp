import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { JOURNAL_ENTRY_QUERY, JOURNAL_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { ptToBodyBlocks } from "@/lib/sanity-helpers"
import JournalEntryView, { type JournalEntryDetail } from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: JOURNAL_SLUGS_QUERY,
    tags: ["journalEntry"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ title: string; subtitle?: string } | null>({
    query: JOURNAL_ENTRY_QUERY,
    params: { slug },
    tags: ["journalEntry"],
  })
  if (!raw) return {}
  return {
    title: `${raw.title} — Indart Journal`,
    description: raw.subtitle ?? undefined,
  }
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityJournalEntry | null>({
    query: JOURNAL_ENTRY_QUERY,
    params: { slug },
    tags: ["journalEntry"],
  })

  if (!raw) notFound()

  const entry: JournalEntryDetail = {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle ?? "",
    authorName: raw.author?.name ?? raw.authorName ?? "",
    authorSlug: raw.author?.slug ?? "",
    authorTitle: raw.author?.thinkerTitle ?? "",
    publishedAt: raw.publishedAt ?? "",
    readingTime: raw.readingTime ?? "",
    disciplines: (raw.disciplines ?? []).map((d) => d.name),
    themes: (raw.themes ?? []).map((t) => ({ name: t.name, slug: t.slug })),
    type: raw.type ?? "essay",
    coverImage: raw.coverImage ? imageUrl.cover(raw.coverImage) : "",
    body: ptToBodyBlocks((raw.content ?? []) as Parameters<typeof ptToBodyBlocks>[0]),
  }

  return <JournalEntryView entry={entry} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityJournalEntry = {
  _id: string
  slug: string
  title: string
  subtitle?: string
  type?: string
  publishedAt?: string
  readingTime?: string
  content?: unknown[]
  coverImage?: unknown
  access?: { tier: string | null }
  disciplines?: { name: string }[]
  themes?: { name: string; slug: string }[]
  author?: { name?: string; slug?: string; thinkerTitle?: string }
  authorName?: string
}
