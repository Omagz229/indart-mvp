"use client"

import React from "react"
import Link from "next/link"
import { ThemeTagList } from "@/components/discovery/theme-tag-list"
import { motion } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import { GOLD, CREAM, CREAM_D, MUTED, EASE, FADE_UP, REVEAL, BRONZE } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, TS, FW, LS, LH, FEATURES_DISPLAY } from "@/lib/typography"

export type DisciplineItem = {
  slug: string
  name: string
  region: string
  statement: string
  coverImage: string
  thinkerCount: number
  journeyCount: number
  themes: { name: string; slug: string; color?: string }[]
}

export default function DisciplinesView({ disciplines }: { disciplines: DisciplineItem[] }) {
  return (
    <PageShell>
      <section style={{ paddingTop: "clamp(80px, 12vw, 128px)", paddingBottom: "clamp(56px, 8vw, 88px)", paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", position: "relative", borderBottom: "1px solid rgba(181,131,44,0.06)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(181,131,44,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 300, letterSpacing: "0.18em", color: BRONZE }}>03</span>
          <div style={{ width: "28px", height: "1px", background: "rgba(181,131,44,0.5)" }} />
          <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.26em", color: GOLD, textTransform: "uppercase" as const }}>Disciplines</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }}>
          <motion.h1 {...REVEAL} style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.d2xl, lineHeight: LH.headline, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
            Not subjects.
            <br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Intellectual traditions.</em>
          </motion.h1>
          <motion.p {...FADE_UP} transition={{ duration: 1.8, delay: 0.3, ease: EASE }} style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: "1.9", color: MUTED, margin: 0 }}>
            A discipline on Indart is not a category in a dropdown menu. It is an intellectual tradition with a lineage, founding arguments, living practitioners, and unresolved questions. Each has a history that predates the European academy — and a future that does not depend on it.
          </motion.p>
        </div>
      </section>

      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(56px, 8vw, 88px)", paddingBottom: "clamp(80px, 12vw, 128px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", background: "rgba(181,131,44,0.07)" }}>
          {disciplines.map((d, i) => (
            <div key={d.slug} style={{ position: "relative" }}>
              <Link
                href={`/disciplines/${d.slug}`}
                aria-label={d.name}
                style={{ position: "absolute", inset: 0, zIndex: 0, textDecoration: "none" }}
              />
              <DisciplineCard discipline={d} index={i} />
            </div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            style={{ background: "#080604", padding: "clamp(28px, 4vw, 48px)", display: "flex", flexDirection: "column" as const, justifyContent: "flex-end", minHeight: "280px" }}
          >
            <p style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: "1.6", color: "rgba(232,220,200,0.28)", margin: "0 0 20px" }}>
              "Every generation must discover its discipline, or betray it."
            </p>
            <Link href="/about" style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.18em", color: "rgba(181,131,44,0.45)", textDecoration: "none", textTransform: "uppercase" as const }}>
              Propose a Discipline →
            </Link>
          </motion.div>
        </div>
      </section>
    </PageShell>
  )
}

function DisciplineCard({ discipline, index }: { discipline: DisciplineItem; index: number }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 1.5, delay: (index % 3) * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "rgba(13,11,8,1)" : "#080604", transition: "background 0.5s ease", cursor: "pointer", overflow: "hidden", minHeight: "280px", display: "flex", flexDirection: "column" as const }}
    >
      <div style={{ position: "relative", flex: "0 0 180px", overflow: "hidden" }}>
        <img src={discipline.coverImage} alt={discipline.name} style={{ width: "100%", height: "180px", objectFit: "cover", filter: `grayscale(${hovered ? 40 : 70}%) brightness(${hovered ? 0.55 : 0.42})`, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "filter 0.8s ease, transform 1.2s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(8,6,4,0.9) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 1px rgba(181,131,44,${hovered ? 0.32 : 0})`, transition: "box-shadow 0.5s ease" }} />
      </div>
      <div style={{ padding: "24px 24px 28px", flex: 1, display: "flex", flexDirection: "column" as const, gap: "12px" }}>
        <p style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.18em", color: hovered ? GOLD : "rgba(181,131,44,0.45)", textTransform: "uppercase" as const, margin: 0, transition: "color 0.35s ease" }}>{discipline.region}</p>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: TS.dm, lineHeight: 1.15, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>{discipline.name}</h3>
        <p style={{ fontFamily: FONT_UI, fontSize: "12px", fontWeight: 300, lineHeight: "1.75", color: "rgba(114,100,86,0.6)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{discipline.statement}</p>
        <div style={{ display: "flex", gap: "16px", marginTop: "auto", paddingTop: "8px" }}>
          {discipline.thinkerCount > 0 && <span style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED }}>{discipline.thinkerCount} thinkers</span>}
          {discipline.journeyCount > 0 && <span style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED }}>{discipline.journeyCount} journeys</span>}
        </div>
        {discipline.themes.length > 0 && (
          <div style={{ position: "relative", zIndex: 1, marginTop: "8px" }}>
            <ThemeTagList themes={discipline.themes} size="sm" max={2} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
