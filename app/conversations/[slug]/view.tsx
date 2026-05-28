"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import { ThemeTag } from "@/components/discovery/theme-tag"
import { GOLD, CREAM, CREAM_D, MUTED, EASE, FADE_UP, REVEAL } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, TS, FW, LS, LH, FEATURES_DISPLAY } from "@/lib/typography"

export type ConversationDetail = {
  slug: string
  title: string
  description: string
  participants: { name: string; slug: string; portrait: string; thinkerTitle: string }[]
  type: string
  format: string
  duration: string
  disciplines: string[]
  themes: { name: string; slug: string; color?: string }[]
  access: "free" | "premium"
  transcriptExcerpt: string[]
}

export default function ConversationDetailView({ conversation }: { conversation: ConversationDetail }) {
  return (
    <PageShell>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "clamp(80px, 12vw, 128px)", paddingBottom: "clamp(64px, 10vw, 96px)", paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", borderBottom: "1px solid rgba(181,131,44,0.07)", position: "relative" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(181,131,44,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
          <Link href="/conversations" style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(181,131,44,0.55)", textDecoration: "none", textTransform: "uppercase" as const }}>Conversations</Link>
          <span style={{ color: "rgba(181,131,44,0.3)" }}>→</span>
          <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" as const }}>{conversation.type}</span>
        </motion.div>

        <motion.h1 {...REVEAL} transition={{ duration: 2.4, delay: 0.1, ease: EASE }} style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dxl, lineHeight: LH.subhead, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 24px", maxWidth: "800px" }}>
          {conversation.title}
        </motion.h1>

        {conversation.description && (
          <motion.p {...FADE_UP} transition={{ duration: 1.8, delay: 0.3, ease: EASE }} style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: "1.9", color: MUTED, margin: "0 0 40px", maxWidth: "640px" }}>
            {conversation.description}
          </motion.p>
        )}

        {conversation.themes.length > 0 && (
          <motion.div {...FADE_UP} transition={{ duration: 1.4, delay: 0.38, ease: EASE }} style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, marginBottom: "32px" }}>
            {conversation.themes.map((t) => (
              <ThemeTag key={t.slug} name={t.name} slug={t.slug} color={t.color} size="sm" />
            ))}
          </motion.div>
        )}

        <motion.div {...FADE_UP} transition={{ duration: 1.6, delay: 0.45, ease: EASE }} style={{ display: "flex", gap: "32px", flexWrap: "wrap" as const }}>
          {conversation.participants.map((p) => (
            <Link key={p.slug} href={`/thinkers/${p.slug}`} style={{ textDecoration: "none", display: "flex", gap: "12px", alignItems: "center" }}>
              {p.portrait && <img src={p.portrait} alt={p.name} style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", filter: "grayscale(40%)", border: "1px solid rgba(181,131,44,0.25)" }} />}
              <div>
                <p style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", color: CREAM, margin: 0, fontFeatureSettings: FEATURES_DISPLAY }}>{p.name}</p>
                {p.thinkerTitle && <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, margin: "3px 0 0" }}>{p.thinkerTitle}</p>}
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ── Video / Player placeholder ───────────────────────────────────────── */}
      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(56px, 8vw, 88px)", paddingBottom: "clamp(56px, 8vw, 88px)", borderBottom: "1px solid rgba(181,131,44,0.07)" }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#0D0B08", border: "1px solid rgba(181,131,44,0.1)", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" as const, gap: "16px" }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(181,131,44,0.04) 0%, transparent 70%)" }} />
            <PlayBtn />
            <div style={{ textAlign: "center" as const }}>
              <p style={{ fontFamily: FONT_UI, fontSize: "11px", letterSpacing: "0.14em", color: "rgba(181,131,44,0.5)", textTransform: "uppercase" as const, margin: "0 0 6px" }}>{conversation.type} · {conversation.duration}</p>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(16px, 2vw, 22px)", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>{conversation.title}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transcript excerpt ───────────────────────────────────────────────── */}
      {conversation.transcriptExcerpt.length > 0 && (
        <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(64px, 10vw, 96px)", paddingBottom: "clamp(80px, 12vw, 128px)", maxWidth: "880px" }}>
          <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: GOLD, textTransform: "uppercase" as const }}>Excerpt</span>
            <div style={{ flex: 1, maxWidth: "40px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "36px" }}>
            {conversation.transcriptExcerpt.map((text, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, delay: i * 0.1, ease: EASE }}
                style={{ borderLeft: "2px solid rgba(181,131,44,0.25)", paddingLeft: "24px", margin: 0 }}
              >
                <p style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: "clamp(17px, 1.6vw, 22px)", lineHeight: "1.7", color: CREAM_D, margin: 0 }}>
                  "{text}"
                </p>
              </motion.blockquote>
            ))}
          </div>
          <div style={{ marginTop: "56px", padding: "32px", background: "rgba(181,131,44,0.03)", border: "1px solid rgba(181,131,44,0.1)", textAlign: "center" as const }}>
            <p style={{ fontFamily: FONT_UI, fontSize: "13px", color: MUTED, margin: "0 0 20px" }}>Full conversation available to members</p>
            <Link href="/membership" style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: "#080604", background: GOLD, padding: "10px 28px", textDecoration: "none", textTransform: "uppercase" as const, display: "inline-block" }}>
              Join Indart
            </Link>
          </div>
        </section>
      )}
    </PageShell>
  )
}

function PlayBtn() {
  const [h, setH] = React.useState(false)
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ position: "relative", zIndex: 1, width: "72px", height: "72px", borderRadius: "50%", border: `1.5px solid rgba(181,131,44,${h ? 0.6 : 0.35})`, background: `rgba(181,131,44,${h ? 0.14 : 0.06})`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s ease" }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M6 4L14 9L6 14V4Z" fill={GOLD} />
      </svg>
    </button>
  )
}
