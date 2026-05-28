"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import { GOLD, CREAM, CREAM_D, MUTED, BG_CARD, EASE, FADE_UP, REVEAL, BRONZE } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, TS, FW, LS, LH, FEATURES_DISPLAY } from "@/lib/typography"
import { ThemeTagList } from "@/components/discovery/theme-tag-list"

export type JourneyItem = {
  slug: string
  title: string
  tagline: string
  thinkerName: string
  thinkerTitle: string
  disciplines: string[]
  coverImage: string
  episodeCount: number
  duration: string
  level: string
  access: "free" | "premium"
  themes: { name: string; slug: string; color?: string }[]
}

const DISCIPLINE_FILTERS = ["All", "Literature", "Philosophy", "History", "Language", "Music", "Architecture", "Science"]
const LEVEL_FILTERS = ["All levels", "Introductory", "Intermediate", "Advanced"]

export default function JourneysView({ journeys }: { journeys: JourneyItem[] }) {
  const [disciplineFilter, setDisciplineFilter] = React.useState("All")
  const [levelFilter, setLevelFilter] = React.useState("All levels")
  const featured = journeys[0] ?? null
  const rest = journeys.slice(1)

  const filtered = rest.filter((j) => {
    const passDisc = disciplineFilter === "All" || j.disciplines.some((d) => d === disciplineFilter)
    const passLevel = levelFilter === "All levels" || j.level === levelFilter
    return passDisc && passLevel
  })

  return (
    <PageShell>
      <section
        style={{ paddingTop: "clamp(80px, 12vw, 128px)", paddingBottom: "clamp(56px, 8vw, 80px)", paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", borderBottom: "1px solid rgba(181,131,44,0.06)", position: "relative" }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(181,131,44,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 300, letterSpacing: "0.18em", color: BRONZE }}>02</span>
          <div style={{ width: "28px", height: "1px", background: "rgba(181,131,44,0.5)" }} />
          <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.26em", color: GOLD, textTransform: "uppercase" as const }}>Journeys</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }}>
          <motion.h1 {...REVEAL} style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.d2xl, lineHeight: LH.headline, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
            Not courses.
            <br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Expeditions of the mind.</em>
          </motion.h1>
          <motion.div {...FADE_UP} transition={{ duration: 1.8, delay: 0.3, ease: EASE }}>
            <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: "1.9", color: MUTED, margin: "0 0 28px" }}>
              Each Journey is a structured narrative arc — 8 to 14 episodes, written and filmed with the gravity of a documentary. They do not survey topics. They pursue questions. You do not come away knowing more. You come away seeing differently.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                {DISCIPLINE_FILTERS.map((f) => (
                  <FilterChip key={f} label={f} active={disciplineFilter === f} onClick={() => setDisciplineFilter(f)} />
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                {LEVEL_FILTERS.map((f) => (
                  <FilterChip key={f} label={f} active={levelFilter === f} onClick={() => setLevelFilter(f)} small />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {featured && (
        <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingTop: "clamp(56px, 8vw, 88px)", paddingBottom: "clamp(56px, 8vw, 88px)" }}>
          <Link href={`/journeys/${featured.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <FeaturedJourneyCard journey={featured} />
          </Link>
        </section>
      )}

      <section style={{ paddingLeft: "clamp(32px, 5vw, 80px)", paddingRight: "clamp(32px, 5vw, 80px)", paddingBottom: "clamp(80px, 12vw, 128px)" }}>
        <div style={{ height: "1px", background: "rgba(181,131,44,0.07)", marginBottom: "clamp(40px, 6vw, 64px)" }} />
        {filtered.length === 0 ? (
          <p style={{ fontFamily: FONT_UI, fontSize: "14px", color: MUTED, textAlign: "center" as const, padding: "64px 0" }}>No journeys match these filters — yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "rgba(181,131,44,0.07)" }}>
            {filtered.map((j, i) => (
              <div key={j.slug} style={{ position: "relative" }}>
                <Link
                  href={`/journeys/${j.slug}`}
                  aria-label={j.title}
                  style={{ position: "absolute", inset: 0, zIndex: 0, textDecoration: "none" }}
                />
                <JourneyCard journey={j} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  )
}

function FilterChip({ label, active, onClick, small }: { label: string; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ fontFamily: FONT_UI, fontSize: small ? "9px" : "10px", fontWeight: 400, letterSpacing: "0.12em", color: active ? "#080604" : "rgba(181,131,44,0.65)", background: active ? GOLD : "transparent", border: `1px solid rgba(181,131,44,${active ? 1 : 0.22})`, padding: small ? "5px 10px" : "6px 14px", cursor: "pointer", textTransform: "uppercase" as const, transition: "all 0.3s ease" }}>
      {label}
    </button>
  )
}

function FeaturedJourneyCard({ journey }: { journey: JourneyItem }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: "relative", height: "clamp(400px, 60vh, 640px)", overflow: "hidden", cursor: "pointer" }}>
      <img src={journey.coverImage} alt={journey.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.42 : 0.35}) saturate(0.65)`, transform: hovered ? "scale(1.02)" : "scale(1)", transition: "filter 0.8s ease, transform 1.2s ease" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(8,6,4,0.95) 0%, rgba(8,6,4,0.65) 50%, rgba(8,6,4,0.25) 100%)" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 80% at 0% 55%, rgba(181,131,44,0.09) 0%, transparent 65%)" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const, justifyContent: "center", padding: "clamp(32px, 6vw, 80px)", maxWidth: "680px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: BRONZE, letterSpacing: "0.18em" }}>Featured Journey</span>
          <div style={{ width: "24px", height: "1px", background: "rgba(181,131,44,0.5)" }} />
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase" as const }}>{journey.access === "free" ? "Free" : "Premium"}</span>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "20px" }}>
          {journey.disciplines.slice(0, 2).map((d) => (
            <span key={d} style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const, padding: "3px 8px", border: "1px solid rgba(181,131,44,0.3)" }}>{d}</span>
          ))}
        </div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dxl, lineHeight: LH.headline, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, whiteSpace: "pre-line", margin: "0 0 16px" }}>{journey.title}</h2>
        <p style={{ fontFamily: FONT_UI, fontSize: "13px", fontStyle: "italic", color: MUTED, margin: "0 0 28px" }}>{journey.tagline}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" as const }}>
          <div>
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", color: CREAM, margin: 0, fontFeatureSettings: FEATURES_DISPLAY }}>{journey.thinkerName}</p>
            <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, margin: "3px 0 0" }}>{journey.thinkerTitle}</p>
          </div>
          <div style={{ width: "1px", height: "32px", background: "rgba(181,131,44,0.18)" }} className="hidden sm:block" />
          <span style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED }}>{journey.episodeCount} episodes{journey.duration ? ` · ${journey.duration}` : ""} · {journey.level}</span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "32px", right: "32px", display: "flex", alignItems: "center", gap: "10px", opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
        <span style={{ fontFamily: FONT_UI, fontSize: "11px", letterSpacing: "0.14em", color: GOLD, textTransform: "uppercase" as const }}>Begin Journey</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M12 7L8 3M12 7L8 11" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  )
}

function JourneyCard({ journey, index }: { journey: JourneyItem; index: number }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 1.4, delay: (index % 2) * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? BG_CARD : "#080604", transition: "background 0.5s ease", cursor: "pointer", overflow: "hidden" }}
    >
      <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden" }}>
        <img src={journey.coverImage} alt={journey.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.55 : 0.42}) saturate(0.6)`, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "filter 0.8s ease, transform 1.2s ease" }} />
        {journey.access === "free" && (
          <div style={{ position: "absolute", top: "16px", right: "16px", fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.16em", color: "#080604", background: GOLD, padding: "4px 10px", textTransform: "uppercase" as const }}>Free</div>
        )}
      </div>
      <div style={{ padding: "24px 24px 28px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "12px" }}>
          {journey.disciplines.slice(0, 2).map((d) => (
            <span key={d} style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.16em", color: hovered ? GOLD : "rgba(181,131,44,0.5)", textTransform: "uppercase" as const, transition: "color 0.35s ease" }}>{d}</span>
          ))}
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: TS.dm, lineHeight: 1.2, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 8px", whiteSpace: "pre-line" }}>{journey.title}</h3>
        <p style={{ fontFamily: FONT_UI, fontSize: "12px", fontStyle: "italic", color: MUTED, margin: "0 0 16px" }}>{journey.tagline}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: FONT_UI, fontSize: "12px", color: CREAM_D, margin: 0 }}>{journey.thinkerName}</p>
            <p style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED, margin: "2px 0 0" }}>{journey.episodeCount} episodes{journey.duration ? ` · ${journey.duration}` : ""}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-6px)", transition: "opacity 0.35s ease, transform 0.4s ease" }}>
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {journey.themes.length > 0 && (
          <div style={{ position: "relative", zIndex: 1, marginTop: "14px" }}>
            <ThemeTagList themes={journey.themes} size="sm" max={2} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
