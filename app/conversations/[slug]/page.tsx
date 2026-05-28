import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/fetch"
import { CONVERSATION_QUERY, CONVERSATION_SLUGS_QUERY } from "@/sanity/lib/queries"
import { imageUrl } from "@/sanity/lib/image"
import { accessTier, ptToStrings } from "@/lib/sanity-helpers"
import ConversationDetailView, { type ConversationDetail } from "./view"

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: CONVERSATION_SLUGS_QUERY,
    tags: ["conversation"],
  })
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await sanityFetch<{ title: string; description?: string } | null>({
    query: CONVERSATION_QUERY,
    params: { slug },
    tags: ["conversation"],
  })
  if (!raw) return {}
  return {
    title: `${raw.title} — Indart`,
    description: raw.description ?? undefined,
  }
}

export default async function ConversationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const raw = await sanityFetch<SanityConversation | null>({
    query: CONVERSATION_QUERY,
    params: { slug },
    tags: ["conversation"],
  })

  if (!raw) notFound()

  const conversation: ConversationDetail = {
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? "",
    participants: (raw.participants ?? []).map((p) => ({
      name: p.thinker?.name ?? "",
      slug: p.thinker?.slug ?? "",
      portrait: p.thinker?.portrait ? imageUrl.thumbnail(p.thinker.portrait) : "",
      thinkerTitle: p.thinker?.thinkerTitle ?? "",
    })),
    type: raw.type ?? "dialogue",
    format: raw.format ?? "video",
    duration: raw.duration ?? "",
    disciplines: (raw.disciplines ?? []).map((d) => d.name),
    themes: (raw.themes ?? []).map((t) => ({ name: t.name, slug: t.slug, color: t.color })),
    access: accessTier(raw.access),
    transcriptExcerpt: ptToStrings((raw.transcript ?? []) as Parameters<typeof ptToStrings>[0]),
  }

  return <ConversationDetailView conversation={conversation} />
}

// ─── Sanity response shape ─────────────────────────────────────────────────────

type SanityConversation = {
  _id: string
  slug: string
  title: string
  type?: string
  format?: string
  duration?: string
  description?: string
  transcript?: unknown[]
  publishedAt?: string
  access?: { tier: string | null }
  disciplines?: { name: string }[]
  themes?: { name: string; slug: string; color?: string }[]
  participants?: {
    role?: string
    thinker?: { name?: string; slug?: string; portrait?: unknown; thinkerTitle?: string }
  }[]
}
