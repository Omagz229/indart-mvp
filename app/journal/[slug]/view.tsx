"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import { ThemeTag } from "@/components/discovery/theme-tag"
import { GOLD, CREAM, CREAM_D, MUTED, EASE, FADE_UP, REVEAL } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, TS, FW, LS, LH, FEATURES_DISPLAY } from "@/lib/typography"
import type { BodyBlock } from "@/lib/sanity-helpers"

export type JournalEntryDetail = {
  slug: string
  title: string
  subtitle: string
  authorName: string
  authorSlug: string
  authorTitle: string
  publishedAt: string
  readingTime: string
  disciplines: string[]
  themes: { name: string; slug: string; color?: string }[]
  type: string
  coverImage: string
  body: BodyBlock[]
}

export default function JournalEntryView({ entry }: { entry: JournalEntryDetail }) {
  return (
    <PageShell>
      {/* ── Cover ────────────────────────────────────────────────────────────── */}
      {entry.coverImage && (
        <div style={{ position: "relative", height: "48vh", overflow: "hidden" }}>
          <img src={entry.coverImage} alt={entry.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(40%) brightness(0.42)" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(8,6,4,0.97) 100%)" }} />
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(48px, 7vw, 72px)", paddingBottom: "clamp(56px, 8vw, 88px)", borderBottom: "1px solid rgba(181,131,44,0.07)" }}>
        <div style={{ maxWidth: "760px" }}>
          <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
            <Link href="/journal" style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(181,131,44,0.55)", textDecoration: "none", textTransform: "uppercase" as const }}>Journal</Link>
            <span style={{ color: "rgba(181,131,44,0.3)" }}>→</span>
            <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" as const }}>{entry.type}</span>
          </motion.div>

          {(entry.disciplines.length > 0 || entry.themes.length > 0) && (
            <motion.div {...FADE_UP} transition={{ duration: 1.6, delay: 0.1, ease: EASE }} style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, marginBottom: "16px", alignItems: "center" }}>
              {entry.disciplines.map((d) => (
                <span key={d} style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" as const }}>{d}</span>
              ))}
              {entry.disciplines.length > 0 && entry.themes.length > 0 && (
                <span style={{ width: "1px", height: "10px", background: "rgba(181,131,44,0.2)", display: "inline-block", margin: "0 2px" }} />
              )}
              {entry.themes.map((t) => (
                <ThemeTag key={t.slug} name={t.name} slug={t.slug} color={t.color} size="sm" />
              ))}
            </motion.div>
          )}

          <motion.h1 {...REVEAL} transition={{ duration: 2.4, delay: 0.15, ease: EASE }} style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dxl, lineHeight: LH.subhead, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 12px" }}>
            {entry.title}
          </motion.h1>

          {entry.subtitle && (
            <motion.p {...FADE_UP} transition={{ duration: 1.6, delay: 0.3, ease: EASE }} style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: "clamp(16px, 1.6vw, 22px)", color: CREAM_D, margin: "0 0 28px" }}>
              {entry.subtitle}
            </motion.p>
          )}

          <motion.div {...FADE_UP} transition={{ duration: 1.6, delay: 0.4, ease: EASE }} style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" as const }}>
            {entry.authorSlug ? (
              <Link href={`/thinkers/${entry.authorSlug}`} style={{ textDecoration: "none" }}>
                <span style={{ fontFamily: FONT_UI, fontSize: "13px", color: CREAM_D }}>{entry.authorName}</span>
              </Link>
            ) : (
              <span style={{ fontFamily: FONT_UI, fontSize: "13px", color: CREAM_D }}>{entry.authorName}</span>
            )}
            {entry.readingTime && <span style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED }}>{entry.readingTime} read</span>}
            {entry.publishedAt && <span style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED }}>{entry.publishedAt}</span>}
          </motion.div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(56px, 8vw, 88px)", paddingBottom: "clamp(80px, 12vw, 128px)" }}>
        <div style={{ maxWidth: "680px" }}>
          {entry.body.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.05, ease: EASE }}
                  style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: "1.95", color: MUTED, margin: i === 0 ? 0 : "28px 0 0" }}
                >
                  {block.text}
                </motion.p>
              )
            }
            if (block.type === "heading") {
              return (
                <motion.h2
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: EASE }}
                  style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: TS.dm, lineHeight: 1.25, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "48px 0 20px", letterSpacing: LS.relaxed }}
                >
                  {block.text}
                </motion.h2>
              )
            }
            if (block.type === "pull-quote") {
              return (
                <motion.blockquote
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease: EASE }}
                  style={{ borderLeft: "2px solid rgba(181,131,44,0.4)", paddingLeft: "28px", margin: "40px 0" }}
                >
                  <p style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: "clamp(18px, 1.8vw, 24px)", lineHeight: "1.6", color: CREAM_D, margin: 0 }}>
                    "{block.text}"
                  </p>
                </motion.blockquote>
              )
            }
            return null
          })}
        </div>
      </section>
    </PageShell>
  )
}
