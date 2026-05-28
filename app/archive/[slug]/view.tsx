"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import { ThemeTag } from "@/components/discovery/theme-tag"
import { GOLD, CREAM, CREAM_D, MUTED, BRONZE, EASE, FADE_UP, REVEAL } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, TS, FW, LS, LH, FEATURES_DISPLAY } from "@/lib/typography"

export type ArchiveItemDetail = {
  slug: string
  title: string
  type: string
  creator: string
  date: string
  origin: string
  era: string
  medium: string
  description: string
  annotation: string[]
  imageUrl: string
  themes: { name: string; slug: string; color?: string }[]
  relatedThinkers: { slug: string; name: string; portrait: string }[]
  access: "free" | "premium"
}

export default function ArchiveItemView({ item }: { item: ArchiveItemDetail }) {
  return (
    <PageShell>
      {/* ── Image / Hero ─────────────────────────────────────────────────────── */}
      {item.imageUrl && (
        <div style={{ position: "relative", height: "50vh", overflow: "hidden" }}>
          <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(40%) brightness(0.45)" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(8,6,4,0.96) 100%)" }} />
          <div style={{ position: "absolute", bottom: "clamp(32px, 6vw, 56px)", left: "clamp(32px, 5vw, 80px)", right: "clamp(32px, 5vw, 80px)" }}>
            <motion.div {...FADE_UP} style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" as const }}>
              <Link href="/archive" style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(181,131,44,0.55)", textDecoration: "none", textTransform: "uppercase" as const }}>Archive</Link>
              <span style={{ color: "rgba(181,131,44,0.3)" }}>→</span>
              <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" as const }}>{item.type}</span>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(48px, 7vw, 72px)", paddingBottom: "clamp(56px, 8vw, 88px)", borderBottom: "1px solid rgba(181,131,44,0.07)" }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]" style={{ gap: "clamp(40px, 6vw, 80px)" }}>
          <div>
            <motion.h1 {...REVEAL} transition={{ duration: 2.2, delay: 0.1, ease: EASE }} style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dxl, lineHeight: LH.subhead, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 16px" }}>
              {item.title}
            </motion.h1>
            {item.description && (
              <motion.p {...FADE_UP} transition={{ duration: 1.6, delay: 0.25, ease: EASE }} style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: "1.9", color: MUTED, margin: 0 }}>
                {item.description}
              </motion.p>
            )}
          </div>

          <motion.div {...FADE_UP} transition={{ duration: 1.6, delay: 0.3, ease: EASE }} style={{ display: "flex", flexDirection: "column" as const }}>
            {[
              { label: "Creator", value: item.creator },
              { label: "Date", value: item.date },
              { label: "Origin", value: item.origin },
              { label: "Era", value: item.era },
              { label: "Medium", value: item.medium },
              { label: "Access", value: item.access === "free" ? "Free" : "Premium" },
            ].filter(({ value }) => value).map(({ label, value }) => (
              <div key={label} style={{ padding: "14px 0", borderBottom: "1px solid rgba(181,131,44,0.07)", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
                <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.18em", color: BRONZE, textTransform: "uppercase" as const, flexShrink: 0 }}>{label}</span>
                <span style={{ fontFamily: FONT_UI, fontSize: "12px", color: CREAM_D, textAlign: "right" as const }}>{value}</span>
              </div>
            ))}
            {item.themes.length > 0 && (
              <div style={{ paddingTop: "16px" }}>
                <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.18em", color: BRONZE, textTransform: "uppercase" as const, display: "block", marginBottom: "10px" }}>Threads</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                  {item.themes.map((t) => (
                    <ThemeTag key={t.slug} name={t.name} slug={t.slug} color={t.color} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Scholarly Annotation ─────────────────────────────────────────────── */}
      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(56px, 8vw, 88px)", paddingBottom: "clamp(56px, 8vw, 88px)", borderBottom: "1px solid rgba(181,131,44,0.07)", maxWidth: "880px" }}>
        <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: GOLD, textTransform: "uppercase" as const }}>Scholarly Annotation</span>
          <div style={{ width: "28px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        </motion.div>

        {item.access === "premium" && item.annotation.length === 0 ? (
          <div style={{ padding: "40px", background: "rgba(181,131,44,0.03)", border: "1px solid rgba(181,131,44,0.1)", textAlign: "center" as const }}>
            <p style={{ fontFamily: FONT_UI, fontSize: "13px", color: MUTED, margin: "0 0 20px" }}>Scholarly annotation available to members</p>
            <Link href="/membership" style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: "#080604", background: GOLD, padding: "10px 28px", textDecoration: "none", textTransform: "uppercase" as const, display: "inline-block" }}>
              Join Indart
            </Link>
          </div>
        ) : (
          item.annotation.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: i * 0.1, ease: EASE }}
              style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "clamp(14px, 1.2vw, 16px)", lineHeight: "1.95", color: MUTED, margin: i === 0 ? 0 : "28px 0 0" }}
            >
              {para}
            </motion.p>
          ))
        )}
      </section>

      {/* ── Related Thinkers ─────────────────────────────────────────────────── */}
      {item.relatedThinkers.length > 0 && (
        <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(48px, 7vw, 72px)", paddingBottom: "clamp(80px, 12vw, 128px)" }}>
          <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: GOLD, textTransform: "uppercase" as const }}>Related Thinkers</span>
            <div style={{ width: "28px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
          </motion.div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" as const }}>
            {item.relatedThinkers.map((t, i) => (
              <Link key={t.slug} href={`/thinkers/${t.slug}`} style={{ textDecoration: "none" }}>
                <ThinkerPill thinker={t} index={i} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  )
}

function ThinkerPill({ thinker, index }: { thinker: { slug: string; name: string; portrait: string }; index: number }) {
  const [h, setH] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: index * 0.1, ease: EASE }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px 10px 10px", border: `1px solid rgba(181,131,44,${h ? 0.22 : 0.12})`, background: h ? "rgba(181,131,44,0.04)" : "transparent", transition: "all 0.35s ease", cursor: "pointer" }}
    >
      {thinker.portrait && <img src={thinker.portrait} alt={thinker.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", filter: `grayscale(${h ? 20 : 50}%)`, transition: "filter 0.5s ease" }} />}
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", color: h ? CREAM : CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, transition: "color 0.35s ease" }}>{thinker.name}</span>
    </motion.div>
  )
}
