"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import {
  GOLD, CREAM, CREAM_D, MUTED, BG, BG_CARD, BG_HOVER, BG_INK,
  BRONZE, BORDER, EASE, FADE_UP, REVEAL,
} from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FW, TS, LH, LS, FEATURES_DISPLAY } from "@/lib/typography"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = "free" | "scholar" | "founding-patron"

type LibraryTab = "journeys" | "conversations" | "archive" | "reflections"

// ─── Mock data ────────────────────────────────────────────────────────────────

const JOURNEY_PROGRESS = [
  {
    slug: "griot-tradition",
    title: "The Griot Tradition:\nStorytelling as Survival",
    thinker: "Kofi Mensah-Asante",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=260&fit=crop&auto=format",
    currentEpisode: 3,
    totalEpisodes: 12,
    progress: 25,
    status: "in-progress" as const,
    lastStudied: "2 days ago",
    nextEpisodeTitle: "The Memory Keeper",
  },
  {
    slug: "ubuntu-philosophy",
    title: "Ubuntu: The Philosophy of Radical Belonging",
    thinker: "Thaddeus Metz",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=260&fit=crop&auto=format",
    currentEpisode: 8,
    totalEpisodes: 8,
    progress: 100,
    status: "completed" as const,
    lastStudied: "1 week ago",
    nextEpisodeTitle: "",
  },
  {
    slug: "decolonising-the-mind",
    title: "Decolonising the Mind:\nLanguage as Liberation",
    thinker: "Ngũgĩ wa Thiong'o",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=260&fit=crop&auto=format",
    currentEpisode: 0,
    totalEpisodes: 10,
    progress: 0,
    status: "saved" as const,
    lastStudied: "",
    nextEpisodeTitle: "The Language Question",
  },
]

const SAVED_CONVERSATIONS = [
  {
    slug: "language-and-politics-of-identity",
    title: "Language and the Politics of Identity",
    participants: ["Chimamanda Ngozi Adichie", "Ngũgĩ wa Thiong'o"],
    duration: "1h 12m",
    savedAt: "3 days ago",
  },
  {
    slug: "ubuntu-and-the-self",
    title: "Ubuntu and the Self: Is There an African Individual?",
    participants: ["Thaddeus Metz"],
    duration: "44m",
    savedAt: "1 week ago",
  },
]

const ARCHIVED_BOOKMARKS = [
  {
    slug: "things-fall-apart-achebe",
    title: "Things Fall Apart",
    type: "TEXT",
    creator: "Chinua Achebe",
    date: "1958",
    savedAt: "5 days ago",
  },
  {
    slug: "africa-must-unite-nkrumah",
    title: "Africa Must Unite",
    type: "TEXT",
    creator: "Kwame Nkrumah",
    date: "1963",
    savedAt: "2 weeks ago",
  },
  {
    slug: "sankofa-haile-gerima",
    title: "Sankofa",
    type: "FILM",
    creator: "Haile Gerima",
    date: "1993",
    savedAt: "3 weeks ago",
  },
]

const REFLECTIONS = [
  {
    id: "r1",
    journeySlug: "ubuntu-philosophy",
    journeyTitle: "Ubuntu: The Philosophy of Radical Belonging",
    episodeNumber: 3,
    prompt: "How does the Ubuntu principle of 'I am because we are' challenge the Western liberal conception of individual rights?",
    response: "What struck me most about this episode was how Ubuntu isn't simply a communitarian counter to individualism — it's a fundamentally different ontology. The self is constituted through relationship, not prior to it. This doesn't abolish personal responsibility; it relocates its meaning...",
    createdAt: "2026-05-14",
    wordCount: 342,
  },
  {
    id: "r2",
    journeySlug: "griot-tradition",
    journeyTitle: "The Griot Tradition: Storytelling as Survival",
    episodeNumber: 1,
    prompt: "What is lost when oral tradition is transcribed? What, if anything, is gained?",
    response: "There is something in the griot tradition that transcription cannot contain — the pauses, the performance, the listening audience that shapes what is said in real time. But I wonder if Kofi's framing is too elegiac...",
    createdAt: "2026-05-20",
    wordCount: 218,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const { user, isLoaded } = useUser()
  const router             = useRouter()
  const [activeTab, setActiveTab] = React.useState<LibraryTab>("journeys")

  if (!isLoaded) return null
  if (!user) { router.push("/sign-in"); return null }

  const meta      = user.publicMetadata as { tier?: Tier }
  const tier: Tier = meta.tier ?? "free"
  const firstName  = user.firstName ?? "Scholar"

  const inProgress  = JOURNEY_PROGRESS.filter((j) => j.status === "in-progress")
  const completed   = JOURNEY_PROGRESS.filter((j) => j.status === "completed")
  const saved       = JOURNEY_PROGRESS.filter((j) => j.status === "saved")

  return (
    <PageShell>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingLeft: "clamp(40px, 7vw, 112px)",
          paddingRight: "clamp(40px, 7vw, 112px)",
          paddingTop: "clamp(80px, 12vw, 120px)",
          paddingBottom: "clamp(48px, 7vw, 72px)",
          borderBottom: `1px solid ${BORDER}`,
          position: "relative",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(181,131,44,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "clamp(28px, 4vw, 40px)" }}>
          <Link href="/member" style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.16em", color: MUTED, textDecoration: "none" }}>
            ← Portal
          </Link>
          <div style={{ width: "1px", height: "12px", background: "rgba(181,131,44,0.2)" }} />
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const }}>
            Library
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(24px, 4vw, 48px)", alignItems: "flex-end" }}>
          <motion.div {...REVEAL}>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.d2xl, lineHeight: LH.headline, color: CREAM, letterSpacing: LS.tight, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
              {firstName}'s<br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Library.</em>
            </h1>
          </motion.div>
          <motion.div {...FADE_UP} transition={{ duration: 1.8, delay: 0.25, ease: EASE }}>
            <div className="grid grid-cols-3" style={{ gap: "1px", background: BORDER }}>
              <LibraryStat value={inProgress.length.toString()} label="In Progress" />
              <LibraryStat value={completed.length.toString()} label="Completed" />
              <LibraryStat value={REFLECTIONS.length.toString()} label="Reflections" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Tab navigation ───────────────────────────────────────────────────── */}
      <div
        style={{
          paddingLeft: "clamp(40px, 7vw, 112px)",
          paddingRight: "clamp(40px, 7vw, 112px)",
          borderBottom: `1px solid ${BORDER}`,
          position: "sticky",
          top: "72px",
          background: "rgba(8,6,4,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", gap: 0, overflow: "auto" }}>
          {(["journeys", "conversations", "archive", "reflections"] as LibraryTab[]).map((tab) => (
            <LibraryTabBtn
              key={tab}
              tab={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            paddingLeft: "clamp(40px, 7vw, 112px)",
            paddingRight: "clamp(40px, 7vw, 112px)",
            paddingTop: "clamp(56px, 8vw, 80px)",
            paddingBottom: "clamp(96px, 14vw, 160px)",
          }}
        >
          {activeTab === "journeys" && (
            <JourneysTab inProgress={inProgress} completed={completed} saved={saved} />
          )}
          {activeTab === "conversations" && (
            <ConversationsTab conversations={SAVED_CONVERSATIONS} />
          )}
          {activeTab === "archive" && (
            <ArchiveTab bookmarks={ARCHIVED_BOOKMARKS} />
          )}
          {activeTab === "reflections" && (
            <ReflectionsTab reflections={REFLECTIONS} />
          )}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  )
}

// ─── Tabs navigation ─────────────────────────────────────────────────────────

function LibraryTabBtn({ tab, active, onClick }: { tab: LibraryTab; active: boolean; onClick: () => void }) {
  const labels: Record<LibraryTab, string> = {
    journeys: "Journeys",
    conversations: "Conversations",
    archive: "Archive",
    reflections: "Reflections",
  }
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? GOLD : "transparent"}`,
        cursor: "pointer",
        padding: "16px 20px",
        fontFamily: FONT_UI,
        fontSize: "11px",
        fontWeight: active ? 500 : 400,
        letterSpacing: "0.1em",
        color: active ? GOLD : MUTED,
        textTransform: "uppercase" as const,
        transition: "color 0.3s ease, border-color 0.3s ease",
        flexShrink: 0,
      }}
    >
      {labels[tab]}
    </button>
  )
}

// ─── Journeys Tab ─────────────────────────────────────────────────────────────

function JourneysTab({ inProgress, completed, saved }: {
  inProgress: typeof JOURNEY_PROGRESS
  completed: typeof JOURNEY_PROGRESS
  saved: typeof JOURNEY_PROGRESS
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(48px, 7vw, 72px)" }}>
      {inProgress.length > 0 && (
        <JourneysGroup label="In Progress" index="01" items={inProgress} />
      )}
      {completed.length > 0 && (
        <JourneysGroup label="Completed" index="02" items={completed} />
      )}
      {saved.length > 0 && (
        <JourneysGroup label="Saved" index="03" items={saved} />
      )}
      {inProgress.length === 0 && completed.length === 0 && saved.length === 0 && (
        <EmptyTab label="No journeys yet." cta="Browse Journeys" href="/journeys" />
      )}
    </div>
  )
}

function JourneysGroup({ label, index, items }: { label: string; index: string; items: typeof JOURNEY_PROGRESS }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <span style={{ fontFamily: FONT_UI, fontSize: "8px", fontWeight: 300, letterSpacing: "0.18em", color: BRONZE }}>{index}</span>
        <div style={{ width: "20px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
        {items.map((journey) => (
          <JourneyProgressRow key={journey.slug} journey={journey} />
        ))}
      </div>
    </div>
  )
}

function JourneyProgressRow({ journey }: { journey: typeof JOURNEY_PROGRESS[0] }) {
  const [hovered, setHovered] = React.useState(false)
  const href = journey.status === "saved"
    ? `/journeys/${journey.slug}`
    : `/journeys/${journey.slug}/${journey.currentEpisode || 1}`

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-16px" }}
        transition={{ duration: 1.2, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto]"
        style={{
          gap: "clamp(16px, 3vw, 32px)",
          alignItems: "center",
          padding: "clamp(16px, 2.5vw, 24px) clamp(16px, 2.5vw, 28px)",
          background: hovered ? BG_HOVER : BG_CARD,
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
      >
        {/* Thumbnail */}
        <div style={{ width: "80px", height: "54px", overflow: "hidden", flexShrink: 0 }}>
          <img
            src={journey.coverImage}
            alt={journey.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${hovered ? 0.65 : 0.5}) grayscale(${hovered ? 30 : 60}%)`, transition: "filter 0.5s ease" }}
          />
        </div>

        {/* Info */}
        <div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.2, color: hovered ? CREAM : CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 6px", whiteSpace: "pre-line", transition: "color 0.3s ease" }}>
            {journey.title}
          </h3>
          <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, margin: "0 0 10px" }}>
            {journey.thinker}
          </p>
          {/* Progress bar */}
          {journey.status !== "saved" && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "120px", height: "1px", background: "rgba(181,131,44,0.12)", position: "relative" as const }}>
                <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${journey.progress}%`, background: journey.status === "completed" ? GOLD : BRONZE, transition: "width 1s ease" }} />
              </div>
              <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: MUTED, letterSpacing: "0.08em" }}>
                {journey.status === "completed" ? "Complete" : `${journey.currentEpisode} / ${journey.totalEpisodes}`}
              </span>
            </div>
          )}
          {journey.status === "saved" && (
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.14em", color: "rgba(181,131,44,0.5)", textTransform: "uppercase" as const }}>Not started</span>
          )}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
          {journey.status === "in-progress" && journey.nextEpisodeTitle && (
            <p style={{ fontFamily: FONT_UI, fontSize: "10px", color: MUTED, margin: 0, textAlign: "right" as const, maxWidth: "160px" }}>
              Next: <span style={{ color: CREAM_D }}>{journey.nextEpisodeTitle}</span>
            </p>
          )}
          {journey.lastStudied && (
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>
              {journey.lastStudied}
            </span>
          )}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s ease" }}>
            <path d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </Link>
  )
}

// ─── Conversations Tab ────────────────────────────────────────────────────────

function ConversationsTab({ conversations }: { conversations: typeof SAVED_CONVERSATIONS }) {
  if (conversations.length === 0) return <EmptyTab label="No saved conversations." cta="Browse Conversations" href="/conversations" />

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <div style={{ width: "20px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const }}>Saved</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
        {conversations.map((c) => (
          <ConversationRow key={c.slug} conversation={c} />
        ))}
      </div>
    </div>
  )
}

function ConversationRow({ conversation }: { conversation: typeof SAVED_CONVERSATIONS[0] }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <Link href={`/conversations/${conversation.slug}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: hovered ? BG_HOVER : BG_CARD, cursor: "pointer", transition: "background 0.3s ease", gap: "16px" }}
      >
        <div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(16px, 1.6vw, 20px)", lineHeight: 1.2, color: hovered ? CREAM : CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 6px", transition: "color 0.3s ease" }}>
            {conversation.title}
          </h3>
          <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, margin: 0 }}>
            {conversation.participants.join(" × ")} · {conversation.duration}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>{conversation.savedAt}</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s ease" }}>
            <path d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

// ─── Archive Tab ──────────────────────────────────────────────────────────────

function ArchiveTab({ bookmarks }: { bookmarks: typeof ARCHIVED_BOOKMARKS }) {
  if (bookmarks.length === 0) return <EmptyTab label="No bookmarked archive items." cta="Browse the Archive" href="/archive" />

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <div style={{ width: "20px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const }}>Bookmarked</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
        {bookmarks.map((b) => (
          <BookmarkRow key={b.slug} bookmark={b} />
        ))}
      </div>
    </div>
  )
}

function BookmarkRow({ bookmark }: { bookmark: typeof ARCHIVED_BOOKMARKS[0] }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <Link href={`/archive/${bookmark.slug}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: hovered ? BG_HOVER : BG_CARD, cursor: "pointer", transition: "background 0.3s ease", gap: "16px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.18em", color: GOLD, padding: "3px 7px", border: "1px solid rgba(181,131,44,0.25)", textTransform: "uppercase" as const, flexShrink: 0 }}>
            {bookmark.type}
          </span>
          <div>
            <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(15px, 1.5vw, 19px)", lineHeight: 1.2, color: hovered ? CREAM : CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 4px", transition: "color 0.3s ease" }}>
              {bookmark.title}
            </h3>
            <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, margin: 0 }}>
              {bookmark.creator} · {bookmark.date}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>{bookmark.savedAt}</span>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s ease" }}>
            <path d="M2 6.5H11M11 6.5L7.5 3M11 6.5L7.5 10" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

// ─── Reflections Tab ──────────────────────────────────────────────────────────

function ReflectionsTab({ reflections }: { reflections: typeof REFLECTIONS }) {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  if (reflections.length === 0) return (
    <EmptyTab
      label="Your written reflections will appear here."
      description="As you study, you'll be invited to respond to reflection prompts. Your responses are saved privately."
      cta="Begin a Journey"
      href="/journeys"
    />
  )

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
        <div style={{ width: "20px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const }}>
          {reflections.length} Reflection{reflections.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
        {reflections.map((r) => (
          <ReflectionCard
            key={r.id}
            reflection={r}
            expanded={expanded === r.id}
            onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ReflectionCard({
  reflection, expanded, onToggle,
}: { reflection: typeof REFLECTIONS[0]; expanded: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: expanded ? BG_CARD : (hovered ? BG_HOVER : BG_CARD), transition: "background 0.3s ease" }}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", width: "100%", padding: "24px 24px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.14em", color: BRONZE, textTransform: "uppercase" as const }}>
              {reflection.journeyTitle.split(":")[0].split("\n")[0]}
            </span>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>·</span>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>Episode {reflection.episodeNumber}</span>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>·</span>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: "rgba(114,100,86,0.45)" }}>
              {new Date(reflection.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <p style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.regular, fontSize: "clamp(15px, 1.6vw, 19px)", lineHeight: 1.35, color: hovered ? CREAM : CREAM_D, fontStyle: "italic", fontFeatureSettings: FEATURES_DISPLAY, margin: 0, transition: "color 0.3s ease" }}>
            "{reflection.prompt}"
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "4px", flexShrink: 0, paddingTop: "4px" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: "9px", color: MUTED }}>{reflection.wordCount}w</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.3s ease", opacity: 0.5 }}>
            <path d="M3 5l4 4 4-4" stroke={CREAM} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Expanded response */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 24px 28px", paddingLeft: "clamp(24px, 4vw, 48px)" }}>
              <div style={{ borderLeft: "1px solid rgba(181,131,44,0.2)", paddingLeft: "20px" }}>
                <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "14px", lineHeight: "1.85", color: CREAM_D, margin: 0 }}>
                  {reflection.response}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function LibraryStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: "20px 24px", background: BG_CARD, textAlign: "center" as const }}>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: FW.light, color: GOLD, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 4px", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.14em", color: MUTED, textTransform: "uppercase" as const, margin: 0 }}>
        {label}
      </p>
    </div>
  )
}

function EmptyTab({ label, description, cta, href }: { label: string; description?: string; cta: string; href: string }) {
  return (
    <div style={{ padding: "clamp(48px, 8vw, 80px) 0", textAlign: "center" as const, maxWidth: "440px", margin: "0 auto" }}>
      <div style={{ width: "1px", height: "48px", background: "linear-gradient(180deg, transparent, rgba(181,131,44,0.3), transparent)", margin: "0 auto 28px" }} />
      <p style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dm, lineHeight: 1.3, color: CREAM_D, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 12px" }}>
        {label}
      </p>
      {description && (
        <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", lineHeight: "1.75", color: MUTED, margin: "0 0 24px" }}>
          {description}
        </p>
      )}
      <Link
        href={href}
        style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 24px", background: GOLD, textDecoration: "none" }}
      >
        <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", color: BG_INK, textTransform: "uppercase" as const }}>
          {cta}
        </span>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M1.5 5.5h8M9.5 5.5L7 3M9.5 5.5L7 8" stroke={BG_INK} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}
