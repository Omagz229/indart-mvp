"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import {
  GOLD, GOLD_H, CREAM, CREAM_D, CREAM_DIM, MUTED, BG, BG_CARD, BG_HOVER, BG_INK,
  BRONZE, BORDER, EASE, FADE_UP, REVEAL,
} from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FW, TS, LS, LH, FEATURES_DISPLAY } from "@/lib/typography"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = "free" | "scholar" | "founding-patron"

const TIER_LABELS: Record<Tier, string> = {
  "free": "Explorer",
  "scholar": "Scholar",
  "founding-patron": "Founding Patron",
}

// ─── Content data ─────────────────────────────────────────────────────────────

const FEATURED_THINKER = {
  name: "Ngũgĩ wa Thiong'o",
  title: "Novelist, Professor Emeritus",
  institution: "University of California, Irvine",
  disciplines: ["Language", "Literature", "Decolonisation"],
  portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&auto=format",
  quote: "Until the lion learns to write, every story will glorify the hunter.",
  journeySlug: "decolonising-the-mind",
  journeyTitle: "Decolonising the Mind",
}

const IN_PROGRESS_JOURNEY = {
  slug: "griot-tradition",
  title: "The Griot Tradition:\nStorytelling as Survival",
  currentEpisode: 3,
  currentEpisodeTitle: "The Memory Keeper",
  totalEpisodes: 12,
  progress: 25,
  coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&h=700&fit=crop&auto=format",
  thinker: "Kofi Mensah-Asante",
  nextEpisode: "/journeys/griot-tradition/3",
}

const RECOMMENDED_JOURNEYS = [
  {
    slug: "ubuntu-philosophy",
    title: "Ubuntu: The Philosophy of Radical Belonging",
    thinker: "Thaddeus Metz",
    disciplines: ["Philosophy", "Ethics"],
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=380&fit=crop&auto=format",
    episodeCount: 8,
    duration: "5h 40m",
    access: "premium" as const,
  },
  {
    slug: "afrobeat-and-resistance",
    title: "Afrobeat and Resistance: Fela Kuti's Political Philosophy",
    thinker: "Sola Olorunyomi",
    disciplines: ["Music", "Political Philosophy"],
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=380&fit=crop&auto=format",
    episodeCount: 9,
    duration: "6h 15m",
    access: "premium" as const,
  },
  {
    slug: "kemetic-science",
    title: "Kemetic Science: Africa and the Origins of Knowledge",
    thinker: "Cheikh Anta Diop Institute",
    disciplines: ["History", "Science"],
    coverImage: "https://images.unsplash.com/photo-1539650116574-75c0b23a7f1c?w=600&h=380&fit=crop&auto=format",
    episodeCount: 14,
    duration: "9h 10m",
    access: "premium" as const,
  },
]

const FEATURED_CONVERSATION = {
  slug: "language-and-politics-of-identity",
  title: "Language and the Politics of Identity",
  participants: ["Chimamanda Ngozi Adichie", "Ngũgĩ wa Thiong'o"],
  portraits: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format",
  ],
  duration: "1h 12m",
  excerpt: "On whether it is possible to fully decolonise oneself while writing in English — and whether that is even the right question.",
}

const ARCHIVE_PICKS = [
  {
    slug: "things-fall-apart-achebe",
    title: "Things Fall Apart",
    type: "TEXT",
    creator: "Chinua Achebe",
    date: "1958",
    origin: "Nigeria",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=280&fit=crop&auto=format",
  },
  {
    slug: "africa-must-unite-nkrumah",
    title: "Africa Must Unite",
    type: "TEXT",
    creator: "Kwame Nkrumah",
    date: "1963",
    origin: "Ghana",
    coverImage: "https://images.unsplash.com/photo-1539650116574-75c0b23a7f1c?w=400&h=280&fit=crop&auto=format",
  },
  {
    slug: "sankofa-haile-gerima",
    title: "Sankofa",
    type: "FILM",
    creator: "Haile Gerima",
    date: "1993",
    origin: "Ethiopia",
    coverImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=280&fit=crop&auto=format",
  },
  {
    slug: "fela-kuti-zombie",
    title: "Zombie (Recording)",
    type: "MUSIC",
    creator: "Fela Kuti",
    date: "1977",
    origin: "Nigeria",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=280&fit=crop&auto=format",
  },
]

const SECTION_NAV = [
  { label: "Journeys",      href: "/journeys",      index: "01", description: "Structured expeditions of thought", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=260&fit=crop&auto=format" },
  { label: "Thinkers",      href: "/thinkers",      index: "02", description: "The minds who shaped the tradition", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=260&fit=crop&auto=format" },
  { label: "Disciplines",   href: "/disciplines",   index: "03", description: "The intellectual traditions of the continent", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=260&fit=crop&auto=format" },
  { label: "Conversations", href: "/conversations", index: "04", description: "Arguments between the sharpest minds", cover: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=260&fit=crop&auto=format" },
  { label: "Archive",       href: "/archive",       index: "05", description: "Primary texts, film, music, and artefacts", cover: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=260&fit=crop&auto=format" },
  { label: "Journal",       href: "/journal",       index: "06", description: "Essays, criticism, and annotation", cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=260&fit=crop&auto=format" },
]

const APHORISMS = [
  "The universe is not outside of you. Look inside yourself; everything that you want, you already are.",
  "Until the lion learns to write, every story will glorify the hunter.",
  "A child who is not embraced by the village will burn it down to feel its warmth.",
  "In the moment of crisis, the wise build bridges and the foolish build dams.",
  "Knowledge is like a garden: if it is not cultivated, it cannot be harvested.",
  "The forest would be very silent if no bird sang there except those that sang best.",
]

// ─── Utilities ────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 5)  return "Good night"
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  if (h < 21) return "Good evening"
  return "Good night"
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [aphorism] = React.useState(() =>
    APHORISMS[Math.floor(Math.random() * APHORISMS.length)]
  )

  if (!isLoaded) return <MemberSkeleton />

  if (!user) {
    router.push("/sign-in")
    return null
  }

  const meta      = user.publicMetadata as { tier?: Tier }
  const tier: Tier = meta.tier ?? "free"
  const unsafeMeta = user.unsafeMetadata as { interests?: string[] }
  const firstName  = user.firstName ?? "Scholar"

  return (
    <PageShell>
      {/* ── Threshold: Greeting ──────────────────────────────────────────────── */}
      <Threshold firstName={firstName} tier={tier} aphorism={aphorism} />

      {/* ── Continue Your Journey ────────────────────────────────────────────── */}
      <ContinueJourney journey={IN_PROGRESS_JOURNEY} />

      {/* ── Today's Dispatch ─────────────────────────────────────────────────── */}
      <TodayDispatch conversation={FEATURED_CONVERSATION} />

      {/* ── Recommended Journeys ─────────────────────────────────────────────── */}
      <RecommendedJourneys journeys={RECOMMENDED_JOURNEYS} interests={unsafeMeta.interests ?? []} />

      {/* ── Thinker in Focus ─────────────────────────────────────────────────── */}
      <ThinkerInFocus thinker={FEATURED_THINKER} />

      {/* ── Archive Picks ────────────────────────────────────────────────────── */}
      <ArchivePicks items={ARCHIVE_PICKS} />

      {/* ── Institution Navigation ───────────────────────────────────────────── */}
      <InstitutionNav sections={SECTION_NAV} tier={tier} />
    </PageShell>
  )
}

// ─── Threshold ────────────────────────────────────────────────────────────────

function Threshold({ firstName, tier, aphorism }: { firstName: string; tier: Tier; aphorism: string }) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "clamp(40px, 7vw, 112px)",
        paddingRight: "clamp(40px, 7vw, 112px)",
        paddingTop: "clamp(80px, 12vw, 120px)",
        paddingBottom: "clamp(64px, 10vw, 96px)",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric layers */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 65% at 50% 15%, rgba(181,131,44,0.07) 0%, transparent 68%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 70% at 0% 50%, rgba(181,131,44,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Date & tier */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "clamp(36px, 5vw, 56px)", flexWrap: "wrap" as const }}
      >
        <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 300, letterSpacing: "0.18em", color: MUTED }}>
          {getFormattedDate()}
        </span>
        <div style={{ width: "1px", height: "12px", background: "rgba(181,131,44,0.25)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const, padding: "3px 10px", border: "1px solid rgba(181,131,44,0.25)", background: "rgba(181,131,44,0.04)" }}>
          {TIER_LABELS[tier]}
        </span>
        <Link href="/member/library" style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.18em", color: MUTED, textDecoration: "none", textTransform: "uppercase" as const, marginLeft: "auto" }}>
          My Library →
        </Link>
      </motion.div>

      {/* Greeting + name */}
      <div style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.15, ease: EASE }}
          style={{ fontFamily: FONT_UI, fontSize: "13px", fontWeight: 300, letterSpacing: "0.12em", color: MUTED, margin: "0 0 10px" }}
        >
          {getGreeting()}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.0, delay: 0.28, ease: EASE }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: FW.light,
            fontSize: "clamp(64px, 10vw, 144px)",
            lineHeight: "0.9",
            color: CREAM,
            letterSpacing: LS.tightest,
            fontFeatureSettings: FEATURES_DISPLAY,
            margin: 0,
          }}
        >
          {firstName}
          <span style={{ color: GOLD }}>.</span>
        </motion.h1>
      </div>

      {/* Aphorism */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: 0.55, ease: EASE }}
        style={{ maxWidth: "560px", marginBottom: "clamp(48px, 8vw, 80px)" }}
      >
        <div style={{ width: "40px", height: "1px", background: "rgba(181,131,44,0.4)", marginBottom: "20px" }} />
        <p style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: "clamp(18px, 2vw, 24px)", lineHeight: "1.55", color: CREAM_D, fontStyle: "italic", fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 12px" }}>
          "{aphorism}"
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
        style={{ display: "flex", gap: "16px", flexWrap: "wrap" as const }}
      >
        <ThresholdCTA href={IN_PROGRESS_JOURNEY.nextEpisode} primary label="Continue Your Journey" />
        <ThresholdCTA href="/archive" label="Today's Archive" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.4, ease: EASE }}
        style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "8px" }}
      >
        <span style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.22em", color: MUTED, textTransform: "uppercase" as const }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "24px", background: "linear-gradient(180deg, rgba(181,131,44,0.5) 0%, transparent 100%)" }}
        />
      </motion.div>
    </section>
  )
}

function ThresholdCTA({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  const [h, setH] = React.useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 28px",
        background: primary ? (h ? GOLD_H : GOLD) : "transparent",
        border: primary ? "none" : `1px solid rgba(181,131,44,${h ? 0.4 : 0.2})`,
        textDecoration: "none",
        transition: "all 0.4s ease",
      }}
    >
      <span style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: primary ? BG_INK : (h ? GOLD : CREAM_D), textTransform: "uppercase" as const, transition: "color 0.3s ease" }}>
        {label}
      </span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke={primary ? BG_INK : (h ? GOLD : CREAM_D)} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

// ─── Continue Journey ─────────────────────────────────────────────────────────

function ContinueJourney({ journey }: { journey: typeof IN_PROGRESS_JOURNEY }) {
  const [hovered, setHovered] = React.useState(false)
  const pct = journey.progress

  return (
    <section
      style={{
        paddingLeft: "clamp(40px, 7vw, 112px)",
        paddingRight: "clamp(40px, 7vw, 112px)",
        paddingTop: "clamp(80px, 10vw, 112px)",
        paddingBottom: "clamp(80px, 10vw, 112px)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
        <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.28em", color: GOLD, textTransform: "uppercase" as const }}>
          Continue Your Study
        </span>
      </motion.div>

      <Link href={journey.nextEpisode} style={{ textDecoration: "none", display: "block" }}>
        <motion.div
          {...REVEAL}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
        >
          {/* Cover image */}
          <div style={{ position: "relative", height: "clamp(280px, 50vh, 520px)", overflow: "hidden" }}>
            <img
              src={journey.coverImage}
              alt={journey.title}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: `brightness(${hovered ? 0.38 : 0.3}) saturate(0.55)`,
                transform: hovered ? "scale(1.02)" : "scale(1)",
                transition: "filter 0.9s ease, transform 1.4s ease",
              }}
            />
            <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.72) 45%, rgba(8,6,4,0.3) 100%)" }} />
            <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(0deg, rgba(8,6,4,0.9) 0%, transparent 100%)" }} />

            {/* Content overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "clamp(32px, 5vw, 72px)" }}>
              <div style={{ maxWidth: "640px" }}>
                <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.24em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 16px" }}>
                  Episode {journey.currentEpisode} of {journey.totalEpisodes}
                </p>
                <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dxl, lineHeight: LH.headline, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, whiteSpace: "pre-line", margin: "0 0 12px" }}>
                  {journey.title}
                </h2>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(16px, 1.6vw, 22px)", fontStyle: "italic", color: GOLD, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 28px" }}>
                  "{journey.currentEpisodeTitle}"
                </p>
                <p style={{ fontFamily: FONT_UI, fontSize: "12px", color: MUTED, margin: "0 0 24px" }}>
                  {journey.thinker}
                </p>

                {/* Progress */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(181,131,44,0.15)", position: "relative" as const }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, delay: 0.4, ease: EASE }}
                      style={{ position: "absolute", top: 0, left: 0, height: "100%", background: GOLD }}
                    />
                  </div>
                  <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.12em", color: MUTED, flexShrink: 0 }}>
                    {pct}% complete
                  </span>
                </div>
              </div>
            </div>

            {/* Resume arrow */}
            <motion.div
              style={{
                position: "absolute", bottom: "32px", right: "32px",
                display: "flex", alignItems: "center", gap: "10px",
                opacity: hovered ? 1 : 0,
                x: hovered ? 0 : -8,
                transition: "all 0.4s ease",
              }}
            >
              <span style={{ fontFamily: FONT_UI, fontSize: "11px", letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const }}>
                Resume
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </section>
  )
}

// ─── Today's Dispatch ─────────────────────────────────────────────────────────

function TodayDispatch({ conversation }: { conversation: typeof FEATURED_CONVERSATION }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <section
      style={{
        paddingLeft: "clamp(40px, 7vw, 112px)",
        paddingRight: "clamp(40px, 7vw, 112px)",
        paddingTop: "clamp(80px, 10vw, 112px)",
        paddingBottom: "clamp(80px, 10vw, 112px)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
        <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.28em", color: GOLD, textTransform: "uppercase" as const }}>
          Today's Conversation
        </span>
      </motion.div>

      <Link href={`/conversations/${conversation.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <motion.div
          {...REVEAL}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
            padding: "clamp(32px, 4vw, 52px)",
            background: hovered ? BG_CARD : "transparent",
            border: `1px solid rgba(181,131,44,${hovered ? 0.16 : 0.07})`,
            transition: "background 0.5s ease, border-color 0.4s ease",
            cursor: "pointer",
          }}
          className="flex-col-mobile"
        >
          {/* Participants */}
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <div style={{ display: "flex" }}>
              {conversation.portraits.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={conversation.participants[i]}
                  style={{
                    width: "64px", height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    filter: `grayscale(${hovered ? 20 : 55}%)`,
                    border: "2px solid #080604",
                    marginLeft: i > 0 ? "-20px" : 0,
                    transition: "filter 0.5s ease",
                    position: "relative",
                    zIndex: 2 - i,
                  }}
                />
              ))}
            </div>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.12em", color: MUTED, textAlign: "center" as const }}>
              Dialogue
            </span>
          </div>

          {/* Content */}
          <div>
            <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, margin: "0 0 16px" }}>
              {conversation.participants.join(" × ")}
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.2, color: hovered ? CREAM : CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 16px", transition: "color 0.35s ease" }}>
              {conversation.title}
            </h2>
            <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", lineHeight: "1.8", fontStyle: "italic", color: "rgba(114,100,86,0.65)", margin: "0 0 20px" }}>
              "{conversation.excerpt}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED }}>{conversation.duration}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)", transition: "opacity 0.35s ease, transform 0.4s ease" }}>
                <span style={{ fontFamily: FONT_UI, fontSize: "11px", letterSpacing: "0.12em", color: GOLD }}>Watch</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  )
}

// ─── Recommended Journeys ─────────────────────────────────────────────────────

function RecommendedJourneys({ journeys, interests }: { journeys: typeof RECOMMENDED_JOURNEYS; interests: string[] }) {
  return (
    <section
      style={{
        paddingLeft: "clamp(40px, 7vw, 112px)",
        paddingRight: "clamp(40px, 7vw, 112px)",
        paddingTop: "clamp(80px, 10vw, 112px)",
        paddingBottom: "clamp(80px, 10vw, 112px)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap" as const, gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.28em", color: GOLD, textTransform: "uppercase" as const }}>
            Recommended for You
          </span>
        </div>
        {interests.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
            {interests.slice(0, 3).map((i) => (
              <span key={i} style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.14em", color: "rgba(181,131,44,0.6)", padding: "3px 8px", border: "1px solid rgba(181,131,44,0.18)", textTransform: "capitalize" as const }}>
                {i}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1px", background: "rgba(181,131,44,0.07)" }}>
        {journeys.map((journey, i) => (
          <Link key={journey.slug} href={`/journeys/${journey.slug}`} style={{ textDecoration: "none" }}>
            <RecommendedJourneyCard journey={journey} index={i} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function RecommendedJourneyCard({ journey, index }: { journey: typeof RECOMMENDED_JOURNEYS[0]; index: number }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 1.4, delay: index * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? BG_CARD : BG, transition: "background 0.5s ease", cursor: "pointer" }}
    >
      <div style={{ position: "relative", paddingBottom: "58%", overflow: "hidden" }}>
        <img
          src={journey.coverImage}
          alt={journey.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.52 : 0.38}) saturate(0.55)`, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "filter 0.8s ease, transform 1.2s ease" }}
        />
        <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(0deg, rgba(8,6,4,0.8) 0%, transparent 100%)" }} />
      </div>
      <div style={{ padding: "20px 20px 24px" }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" as const }}>
          {journey.disciplines.map((d) => (
            <span key={d} style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.16em", color: hovered ? GOLD : "rgba(181,131,44,0.5)", textTransform: "uppercase" as const, transition: "color 0.35s ease" }}>
              {d}
            </span>
          ))}
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: TS.dm, lineHeight: 1.2, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 8px" }}>
          {journey.title}
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <div>
            <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: CREAM_D, margin: 0 }}>{journey.thinker}</p>
            <p style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED, margin: "3px 0 0" }}>{journey.episodeCount} eps · {journey.duration}</p>
          </div>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-5px)", transition: "opacity 0.35s ease, transform 0.4s ease" }}>
            <path d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Thinker in Focus ─────────────────────────────────────────────────────────

function ThinkerInFocus({ thinker }: { thinker: typeof FEATURED_THINKER }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <section
      style={{
        borderTop: `1px solid ${BORDER}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        {...FADE_UP}
        style={{
          paddingLeft: "clamp(40px, 7vw, 112px)",
          paddingTop: "clamp(80px, 10vw, 112px)",
          paddingBottom: "clamp(24px, 3vw, 36px)",
          display: "flex", alignItems: "center", gap: "12px",
        }}
      >
        <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.28em", color: GOLD, textTransform: "uppercase" as const }}>
          Thinker in Focus
        </span>
      </motion.div>

      <div
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr]"
        style={{ minHeight: "clamp(480px, 65vh, 640px)" }}
      >
        {/* Portrait side */}
        <motion.div
          {...REVEAL}
          style={{ position: "relative", overflow: "hidden", minHeight: "360px" }}
        >
          <img
            src={thinker.portrait}
            alt={thinker.name}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", objectFit: "cover",
              filter: "grayscale(60%) brightness(0.55) sepia(15%)",
            }}
          />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 50%, rgba(8,6,4,0.95) 100%)" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 30% 50%, rgba(181,131,44,0.06) 0%, transparent 65%)" }} />
        </motion.div>

        {/* Content side */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-64px" }}
          transition={{ duration: 1.8, ease: EASE }}
          style={{
            display: "flex",
            flexDirection: "column" as const,
            justifyContent: "center",
            padding: "clamp(40px, 6vw, 80px)",
            paddingRight: "clamp(40px, 7vw, 112px)",
            background: BG,
          }}
        >
          {/* Disciplines */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "28px" }}>
            {thinker.disciplines.map((d) => (
              <span key={d} style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.16em", color: "rgba(181,131,44,0.6)", textTransform: "uppercase" as const }}>{d}</span>
            ))}
          </div>

          {/* Quote */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.35)", marginBottom: "20px" }} />
            <p style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: "clamp(20px, 2.4vw, 30px)", lineHeight: "1.5", color: CREAM, fontStyle: "italic", fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
              "{thinker.quote}"
            </p>
          </div>

          {/* Identity */}
          <div style={{ marginBottom: "36px" }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: TS.dl, lineHeight: 1.1, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 6px" }}>
              {thinker.name}
            </h2>
            <p style={{ fontFamily: FONT_UI, fontSize: "12px", color: MUTED, margin: 0 }}>
              {thinker.title}
            </p>
            <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: "rgba(114,100,86,0.55)", margin: "2px 0 0" }}>
              {thinker.institution}
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
            <Link
              href={`/journeys/${thinker.journeySlug}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 22px", background: hovered ? GOLD_H : GOLD, textDecoration: "none", transition: "background 0.4s ease" }}
            >
              <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", color: BG_INK, textTransform: "uppercase" as const }}>
                Begin Journey
              </span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 5.5h8M9.5 5.5L7 3M9.5 5.5L7 8" stroke={BG_INK} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={`/thinkers`}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", border: "1px solid rgba(181,131,44,0.2)", textDecoration: "none", transition: "border-color 0.3s ease" }}
            >
              <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.12em", color: CREAM_D, textTransform: "uppercase" as const }}>
                All Thinkers
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Archive Picks ────────────────────────────────────────────────────────────

function ArchivePicks({ items }: { items: typeof ARCHIVE_PICKS }) {
  return (
    <section
      style={{
        paddingLeft: "clamp(40px, 7vw, 112px)",
        paddingRight: "clamp(40px, 7vw, 112px)",
        paddingTop: "clamp(80px, 10vw, 112px)",
        paddingBottom: "clamp(80px, 10vw, 112px)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap" as const, gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.28em", color: GOLD, textTransform: "uppercase" as const }}>
            From the Archive
          </span>
        </div>
        <Link href="/archive" style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.12em", color: MUTED, textDecoration: "none", textTransform: "uppercase" as const }}>
          Explore all →
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: "rgba(181,131,44,0.07)" }}>
        {items.map((item, i) => (
          <Link key={item.slug} href={`/archive/${item.slug}`} style={{ textDecoration: "none" }}>
            <ArchivePickCard item={item} index={i} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function ArchivePickCard({ item, index }: { item: typeof ARCHIVE_PICKS[0]; index: number }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 1.3, delay: index * 0.08, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? BG_CARD : BG, cursor: "pointer", transition: "background 0.4s ease", overflow: "hidden" }}
    >
      <div style={{ position: "relative", paddingBottom: "65%", overflow: "hidden" }}>
        <img
          src={item.coverImage}
          alt={item.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.5 : 0.38}) grayscale(${hovered ? 40 : 65}%)`, transform: hovered ? "scale(1.06)" : "scale(1)", transition: "filter 0.7s ease, transform 1.1s ease" }}
        />
        <div style={{ position: "absolute", top: "10px", left: "10px", fontFamily: FONT_UI, fontSize: "7px", letterSpacing: "0.2em", color: GOLD, background: "rgba(8,6,4,0.75)", padding: "3px 7px", textTransform: "uppercase" as const }}>
          {item.type}
        </div>
      </div>
      <div style={{ padding: "14px 14px 18px" }}>
        <p style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.14em", color: hovered ? GOLD : "rgba(181,131,44,0.45)", textTransform: "uppercase" as const, margin: "0 0 6px", transition: "color 0.3s ease" }}>
          {item.creator} · {item.date}
        </p>
        <h4 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.25, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 4px" }}>
          {item.title}
        </h4>
        <p style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED, margin: 0 }}>{item.origin}</p>
      </div>
    </motion.div>
  )
}

// ─── Institution Navigation ───────────────────────────────────────────────────

function InstitutionNav({ sections, tier }: { sections: typeof SECTION_NAV; tier: Tier }) {
  return (
    <section
      style={{
        borderTop: `1px solid ${BORDER}`,
        paddingLeft: "clamp(40px, 7vw, 112px)",
        paddingRight: "clamp(40px, 7vw, 112px)",
        paddingTop: "clamp(80px, 10vw, 112px)",
        paddingBottom: "clamp(96px, 14vw, 160px)",
      }}
    >
      <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px", flexWrap: "wrap" as const, gap: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.28em", color: GOLD, textTransform: "uppercase" as const }}>
              Navigate the Institution
            </span>
          </div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dxl, lineHeight: LH.headline, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
            Everything, at once.
          </h2>
        </div>
        {tier === "free" && (
          <Link
            href="/membership"
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 22px", background: "rgba(181,131,44,0.06)", border: "1px solid rgba(181,131,44,0.22)", textDecoration: "none" }}
          >
            <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", color: GOLD, textTransform: "uppercase" as const }}>Unlock All →</span>
          </Link>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", background: "rgba(181,131,44,0.07)" }}>
        {sections.map((section, i) => (
          <Link key={section.href} href={section.href} style={{ textDecoration: "none" }}>
            <SectionCard section={section} index={i} />
          </Link>
        ))}
      </div>
    </section>
  )
}

function SectionCard({ section, index }: { section: typeof SECTION_NAV[0]; index: number }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 1.4, delay: (index % 3) * 0.1, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden", background: hovered ? BG_CARD : BG, cursor: "pointer", transition: "background 0.5s ease", minHeight: "clamp(200px, 28vw, 320px)" }}
    >
      {/* Background image */}
      <img
        src={section.cover}
        alt={section.label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.22 : 0.14}) grayscale(${hovered ? 50 : 80}%)`, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "filter 0.9s ease, transform 1.4s ease" }}
      />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.65) 55%, rgba(8,6,4,0.2) 100%)" }} />
      {hovered && (
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(181,131,44,0.1) 0%, transparent 70%)" }} />
      )}

      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const, justifyContent: "flex-end", padding: "clamp(20px, 3vw, 32px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "8px", fontWeight: 300, letterSpacing: "0.16em", color: BRONZE }}>
            {section.index}
          </span>
          <div style={{ width: "16px", height: "1px", background: "rgba(181,131,44,0.35)", transform: hovered ? "scaleX(2)" : "scaleX(1)", transformOrigin: "left", transition: "transform 0.4s ease" }} />
        </div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.1, color: hovered ? CREAM : CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 8px", transition: "color 0.35s ease" }}>
          {section.label}
        </h3>
        <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "11px", lineHeight: "1.6", color: hovered ? MUTED : "rgba(114,100,86,0.4)", margin: "0 0 16px", transition: "color 0.4s ease" }}>
          {section.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.35s ease, transform 0.4s ease" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const }}>Enter</span>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1.5 5.5h8M9.5 5.5L7 3M9.5 5.5L7 8" stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MemberSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "16px" }}
      >
        <div style={{ width: "1px", height: "48px", background: "linear-gradient(180deg, transparent, rgba(181,131,44,0.4), transparent)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.22em", color: MUTED, textTransform: "uppercase" as const }}>
          Entering the Archive
        </span>
      </motion.div>
    </div>
  )
}
