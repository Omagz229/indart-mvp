"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useClerk } from "@clerk/nextjs"
import {
  GOLD, CREAM, CREAM_D, MUTED, BG_INK,
  BRONZE, BORDER, EASE, FADE_UP, REVEAL,
  GRAD_BLOOM_TOP,
} from "@/lib/indart-tokens"
import {
  FONT_DISPLAY, FONT_UI, FW, TS, LS, LH, FEATURES_DISPLAY,
} from "@/lib/typography"

interface Props {
  tier: string
  name?: string
}

const TIER_MESSAGES = {
  scholar: {
    heading: "The full library is yours.",
    sub: "Every Journey. Every Conversation. The complete annotated Archive. All of it, without restriction.",
    next: [
      { label: "Continue your Journey", href: "/journeys", note: "Pick up where you left off, or begin something new" },
      { label: "Explore the Archive", href: "/archive", note: "Primary texts, film, music, and artefacts — fully annotated" },
      { label: "Join a Study Circle", href: "/circles", note: "Small, slow reading groups for deep engagement" },
      { label: "Your account", href: "/account", note: "Scholar profile and membership details" },
    ],
  },
  "founding-patron": {
    heading: "You are part of the foundation.",
    sub: "Your name will be inscribed in the Archive. Everything a Scholar has — permanently. A founding voice in what this becomes.",
    next: [
      { label: "Begin a Journey", href: "/journeys", note: "Your first step into the full library" },
      { label: "Explore the Archive", href: "/archive", note: "Primary texts, film, music, and artefacts" },
      { label: "Your account", href: "/account", note: "Founding Patron profile and Archive inscription" },
      { label: "Founding dispatches", href: "/member", note: "Private editorial letters and member area" },
    ],
  },
} as const

type TierKey = keyof typeof TIER_MESSAGES

function isTierKey(v: string): v is TierKey {
  return v === "scholar" || v === "founding-patron"
}

function useTierConfirmation(expectedTier: "scholar" | "founding-patron") {
  const { session } = useClerk()
  const [confirmed, setConfirmed] = React.useState(false)
  const [timedOut,  setTimedOut]  = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    const deadline = Date.now() + 14_000  // 14 seconds max

    async function attempt() {
      // Step 1: refresh the Clerk session so the JWT picks up the new tier
      try { await session?.reload() } catch { /* continue even if reload fails */ }

      // Step 2: poll the live tier endpoint
      const poll = async () => {
        if (cancelled) return
        try {
          const res  = await fetch("/api/auth/tier")
          const data = await res.json()
          if (data.tier === expectedTier) {
            setConfirmed(true)
            return
          }
        } catch { /* network error — keep polling */ }

        if (Date.now() < deadline) {
          setTimeout(poll, 1_500)
        } else {
          setTimedOut(true)
        }
      }

      poll()
    }

    attempt()
    return () => { cancelled = true }
  }, [expectedTier, session])

  return { confirmed, timedOut }
}

export default function WelcomeView({ tier: tierParam, name }: Props) {
  const tierKey: TierKey = isTierKey(tierParam) ? tierParam : "scholar"
  const config = TIER_MESSAGES[tierKey]
  const firstName = name ?? "Scholar"
  const isPatron = tierKey === "founding-patron"

  const { confirmed, timedOut } = useTierConfirmation(tierKey)

  const [entered, setEntered] = React.useState(false)
  React.useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080604",
        position: "relative",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(64px, 10vw, 96px) clamp(32px, 6vw, 96px)",
      }}
    >
      {/* Ambient background */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: GRAD_BLOOM_TOP, pointerEvents: "none" }} />
      {isPatron && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(139,94,42,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ maxWidth: "740px", width: "100%", textAlign: "center" as const, position: "relative" }}>

        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={entered ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2.2, ease: EASE }}
          style={{ marginBottom: "48px" }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              border: `1px solid rgba(181,131,44,${isPatron ? 0.55 : 0.38})`,
              borderRadius: "50%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isPatron ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3L12 8h5l-4 3 1.5 5L10 13l-4.5 3L7 11 3 8h5z" stroke={GOLD} strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9h10M9 4v10" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
                <rect x="1.5" y="1.5" width="15" height="15" stroke="rgba(181,131,44,0.35)" strokeWidth="0.8" />
              </svg>
            )}
          </div>
        </motion.div>

        {/* Welcome heading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: FONT_UI,
            fontSize: "9px",
            fontWeight: FW.medium,
            letterSpacing: LS.label,
            color: isPatron ? BRONZE : GOLD,
            textTransform: "uppercase" as const,
            margin: "0 0 20px",
          }}
        >
          {isPatron ? "Founding Patron" : "Scholar"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.4, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: FW.light,
            fontSize: TS.d2xl,
            lineHeight: LH.headline,
            color: CREAM,
            letterSpacing: LS.tight,
            fontFeatureSettings: FEATURES_DISPLAY,
            margin: "0 0 20px",
          }}
        >
          Welcome, {firstName}.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.2, delay: 0.6, ease: EASE }}
          style={{
            fontFamily: FONT_DISPLAY,
            fontStyle: "italic",
            fontSize: TS.dl,
            lineHeight: LH.subhead,
            color: GOLD,
            letterSpacing: LS.relaxed,
            fontFeatureSettings: FEATURES_DISPLAY,
            margin: "0 auto 32px",
            maxWidth: "600px",
          }}
        >
          {config.heading}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ duration: 2.0, delay: 0.85, ease: EASE }}
          style={{
            fontFamily: FONT_UI,
            fontWeight: FW.light,
            fontSize: TS.bl,
            lineHeight: LH.body,
            color: MUTED,
            margin: "0 auto 64px",
            maxWidth: "520px",
          }}
        >
          {config.sub}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={entered ? { scaleX: 1 } : {}}
          transition={{ duration: 1.6, delay: 1.0, ease: EASE }}
          style={{
            width: "80px",
            height: "1px",
            background: "rgba(181,131,44,0.4)",
            margin: "0 auto 56px",
            transformOrigin: "center",
          }}
        />

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.0, delay: 1.15, ease: EASE }}
        >
          <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: FW.medium, letterSpacing: LS.label, color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 28px" }}>
            Where to begin
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "1px", background: "rgba(181,131,44,0.08)", textAlign: "left" as const }}>
            {config.next.map((item, i) => (
              <NextCard key={i} item={item} delay={1.3 + i * 0.1} entered={entered} />
            ))}
          </div>
        </motion.div>

        {/* Final note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ duration: 1.8, delay: 1.7, ease: EASE }}
          style={{
            fontFamily: FONT_UI,
            fontWeight: FW.light,
            fontSize: TS.bs,
            color: "rgba(114,100,86,0.55)",
            lineHeight: LH.body,
            margin: "40px auto 0",
            maxWidth: "440px",
          }}
        >
          {isPatron
            ? "Your Archive inscription will appear within 24 hours. Watch for the first Founding Patron dispatch."
            : "Your account is active. You can manage your membership at any time from your account page."}
        </motion.p>

        {!confirmed && !timedOut && (
          <motion.p
            {...FADE_UP}
            style={{
              fontFamily: FONT_UI, fontSize: "11px", color: MUTED,
              textAlign: "center" as const, marginTop: "32px", letterSpacing: "0.06em",
            }}
          >
            Confirming your membership…
          </motion.p>
        )}
        {timedOut && !confirmed && (
          <motion.p
            {...FADE_UP}
            style={{
              fontFamily: FONT_UI, fontSize: "11px", color: MUTED,
              textAlign: "center" as const, marginTop: "32px", letterSpacing: "0.06em",
            }}
          >
            Your membership is being processed. You will receive an email confirmation shortly.{" "}
            <Link href="/account" style={{ color: GOLD, textDecoration: "none" }}>Check your account</Link>.
          </motion.p>
        )}
      </div>
    </div>
  )
}

// ── Next card ─────────────────────────────────────────────────────────────────

function NextCard({
  item,
  delay,
  entered,
}: {
  item: { label: string; href: string; note: string }
  delay: number
  entered: boolean
}) {
  const [hover, setHover] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={entered ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, delay, ease: EASE }}
    >
      <Link href={item.href} style={{ textDecoration: "none" }}>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            padding: "clamp(18px, 2.5vw, 24px)",
            background: hover ? "rgba(181,131,44,0.05)" : "#0D0B08",
            cursor: "pointer",
            transition: "background 0.3s ease",
            display: "flex",
            flexDirection: "column" as const,
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: FONT_UI,
                fontSize: TS.bm,
                fontWeight: FW.regular,
                color: hover ? CREAM : CREAM_D,
                transition: "color 0.3s ease",
              }}
            >
              {item.label}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{ opacity: hover ? 1 : 0.35, transition: "opacity 0.3s ease", flexShrink: 0 }}
            >
              <path d="M2 6h8M7 3.5L9.5 6 7 8.5" stroke={GOLD} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: FONT_UI,
              fontWeight: FW.light,
              fontSize: TS.bs,
              color: MUTED,
              lineHeight: "1.55",
            }}
          >
            {item.note}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
