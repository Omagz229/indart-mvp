// Shared helpers for mapping Sanity data to the flat shapes used by page components

import type { ContentTier } from "@/lib/auth/tier"

export type AccessTier = "free" | "premium"

export function accessTier(
  access: { tier: string | null; previewable?: boolean } | null | undefined,
): AccessTier {
  return access?.tier ? "premium" : "free"
}

/**
 * Maps a Sanity accessControl object to a precise ContentTier.
 *
 * Use this (not accessTier) for server-side security decisions.
 * accessTier() is kept for display-only purposes (showing "Free" badges etc.)
 *
 * Handles legacy schema values ("member", "founding-member") for backwards
 * compatibility during the Sanity document migration period.
 */
export function contentTier(
  access: { tier: string | null } | null | undefined,
): ContentTier {
  const t = access?.tier

  if (!t || t === "free") return null

  // Current canonical values
  if (t === "scholar") return "scholar"
  if (t === "founding-patron") return "founding-patron"

  // Legacy schema values — safe to map during migration window
  if (t === "member") return "scholar"
  if (t === "founding-member") return "founding-patron"

  // Unknown future value — default to free (safe over exclusive)
  return null
}

// ─── PortableText extraction ──────────────────────────────────────────────────

type PTBlock = { _type: string; style?: string; children?: { text: string }[]; text?: string }

export type BodyBlock = { type: "paragraph" | "heading" | "pull-quote"; text: string }

export function ptToBodyBlocks(blocks: PTBlock[]): BodyBlock[] {
  const result: BodyBlock[] = []
  for (const b of blocks) {
    if (b._type === "block") {
      const text = (b.children ?? []).map((c) => c.text).join("")
      if (!text.trim()) continue
      if (b.style === "h2" || b.style === "h3") result.push({ type: "heading", text })
      else if (b.style === "blockquote") result.push({ type: "pull-quote", text })
      else result.push({ type: "paragraph", text })
    } else if (b._type === "pullquote" && b.text) {
      result.push({ type: "pull-quote", text: b.text })
    }
  }
  return result
}

export function ptToStrings(blocks: PTBlock[]): string[] {
  return blocks.flatMap((b) => {
    if (b._type === "block") {
      const text = (b.children ?? []).map((c) => c.text).join("")
      return text.trim() ? [text] : []
    }
    if (b._type === "pullquote" && b.text) return [b.text]
    return []
  })
}
