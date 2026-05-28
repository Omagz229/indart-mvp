"use client"

import React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import ThinkerHero from "@/components/thinker/thinker-hero"
import ThinkerPhilosophy from "@/components/thinker/thinker-philosophy"
import ThinkerJourneys from "@/components/thinker/thinker-journeys"
import ThinkerLessons from "@/components/thinker/thinker-lessons"
import ThinkerConversations from "@/components/thinker/thinker-conversations"
import ThinkerArchive from "@/components/thinker/thinker-archive"
import ThinkerReadingList from "@/components/thinker/thinker-reading-list"
import ThinkerRelated from "@/components/thinker/thinker-related"
import { GOLD, CREAM, MUTED, BG, EASE } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FW, FEATURES_DISPLAY } from "@/lib/typography"
import type { ThinkerProfile } from "@/components/thinker/types"
import { ThemeTagList } from "@/components/discovery/theme-tag-list"

export default function ThinkerView({ thinker }: { thinker: ThinkerProfile }) {
  const { scrollY } = useScroll()
  const [showSticky, setShowSticky] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (y) => {
    setShowSticky(y > (typeof window !== "undefined" ? window.innerHeight * 0.8 : 600))
  })

  return (
    <PageShell>
      <AnimatePresence>
        {showSticky && (
          <motion.div
            key="sticky"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ position: "fixed", top: "72px", left: 0, right: 0, height: "56px", background: "rgba(8,6,4,0.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(181,131,44,0.1)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "clamp(24px, 4vw, 72px)", paddingRight: "clamp(24px, 4vw, 72px)", gap: "16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
              <div style={{ width: "32px", height: "40px", overflow: "hidden", flexShrink: 0 }}>
                <img src={thinker.portrait} alt={thinker.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(60%) brightness(0.7)" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "16px", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{thinker.name}</p>
                {thinker.thinkerTitle && <p style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED, margin: 0, letterSpacing: "0.04em" }}>{thinker.thinkerTitle}</p>}
              </div>
            </div>
            <Link href="/membership" style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", color: BG, background: GOLD, padding: "9px 20px", textDecoration: "none", textTransform: "uppercase" as const, flexShrink: 0 }}>
              Join Indart
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <ThinkerHero thinker={thinker} />
      <IdentityStrip thinker={thinker} />
      <ThinkerPhilosophy thinker={thinker} chapterIndex={1} />
      <ThinkerJourneys thinkerName={thinker.name} journeys={thinker.journeys} chapterIndex={2} />
      <ThinkerLessons lessons={thinker.featuredLessons} chapterIndex={3} />
      <ThinkerConversations thinker={{ name: thinker.name, portrait: thinker.portrait }} conversations={thinker.conversations} chapterIndex={4} />
      <ThinkerArchive items={thinker.archiveItems} chapterIndex={5} />
      <ThinkerReadingList books={thinker.readingList} thinkerName={thinker.name} chapterIndex={6} />
      <ThinkerRelated thinkers={thinker.relatedThinkers} chapterIndex={7} />
    </PageShell>
  )
}

function IdentityStrip({ thinker }: { thinker: ThinkerProfile }) {
  const meta = [thinker.nationality, thinker.birthPlace ?? thinker.born, thinker.era, thinker.region].filter(Boolean) as string[]
  return (
    <div style={{ background: "#080604", borderBottom: "1px solid rgba(181,131,44,0.07)", paddingLeft: "clamp(32px, 6vw, 96px)", paddingRight: "clamp(32px, 6vw, 96px)", paddingTop: "clamp(28px, 4vw, 40px)", paddingBottom: "clamp(28px, 4vw, 40px)" }}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: "0", rowGap: "8px" }}>
        {meta.map((item, i) => (
          <React.Fragment key={item}>
            <span style={{ fontFamily: FONT_UI, fontSize: "11px", letterSpacing: "0.08em", color: MUTED }}>{item}</span>
            {i < meta.length - 1 && <span style={{ display: "inline-block", width: "1px", height: "10px", background: "rgba(181,131,44,0.2)", margin: "0 16px" }} />}
          </React.Fragment>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column" as const, gap: "10px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
            {thinker.disciplines.map((d) => (
              <span key={d} style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const, padding: "3px 10px", border: "1px solid rgba(181,131,44,0.22)" }}>{d}</span>
            ))}
          </div>
          {thinker.themes.length > 0 && (
            <>
              <div style={{ width: "100%", height: "1px", background: "rgba(181,131,44,0.07)" }} />
              <ThemeTagList themes={thinker.themes} size="sm" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
