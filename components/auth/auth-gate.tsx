"use client"

import React from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import {
  GOLD, GOLD_H, CREAM, CREAM_D, MUTED, BG, BG_CARD, BG_INK, BRONZE, BORDER, EASE,
} from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FW, TS, FEATURES_DISPLAY } from "@/lib/typography"

type Tier = "free" | "scholar" | "founding-patron"

const TIER_RANK: Record<Tier, number> = {
  "free": 0,
  "scholar": 1,
  "founding-patron": 2,
}

interface AuthGateProps {
  required: Tier
  // If set, renders children normally when access is granted
  children: React.ReactNode
  // Optional: override the preview shown to locked users
  preview?: React.ReactNode
  // Optional: context shown in the gate prompt
  context?: string
}

// AuthGate wraps content that requires a specific membership tier.
// Unauthenticated users see a sign-in prompt.
// Authenticated free users see an upgrade prompt.
// Authorised users see the children unchanged.
export default function AuthGate({ required, children, preview, context }: AuthGateProps) {
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return <GateSkeleton />

  const tier: Tier = (user?.publicMetadata?.tier as Tier) ?? "free"
  const hasAccess  = TIER_RANK[tier] >= TIER_RANK[required]

  if (hasAccess) return <>{children}</>

  return (
    <GatePrompt
      tier={required}
      isSignedIn={isSignedIn ?? false}
      preview={preview}
      context={context}
    />
  )
}

// ─── Gate prompt ──────────────────────────────────────────────────────────────

function GatePrompt({
  tier, isSignedIn, preview, context,
}: {
  tier: Tier; isSignedIn: boolean; preview?: React.ReactNode; context?: string
}) {
  const isScholar = tier === "scholar" || tier === "founding-patron"

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Blurred preview layer */}
      {preview && (
        <div style={{ filter: "blur(6px)", opacity: 0.4, pointerEvents: "none", userSelect: "none" as const }}>
          {preview}
        </div>
      )}

      {/* Gate overlay */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{
          position: preview ? "absolute" : "relative",
          inset: preview ? 0 : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: preview
            ? "linear-gradient(0deg, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.7) 60%, transparent 100%)"
            : BG_CARD,
          padding: preview ? "48px clamp(24px, 5vw, 64px) 40px" : "clamp(36px, 5vw, 56px)",
          border: preview ? "none" : `1px solid ${BORDER}`,
        }}
      >
        <div style={{ maxWidth: "480px", textAlign: "center" as const, position: "relative", zIndex: 1 }}>
          {/* Lock icon */}
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
          >
            <div style={{ width: "52px", height: "52px", border: "1px solid rgba(181,131,44,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <rect x="2" y="9" width="14" height="10" rx="1.5" stroke={GOLD} strokeWidth="1.3" />
                <path d="M5.5 9V6.5a3.5 3.5 0 017 0V9" stroke={GOLD} strokeWidth="1.3" />
              </svg>
            </div>
          </motion.div>

          {/* Label */}
          <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 12px" }}>
            {isSignedIn ? "Scholar access" : "Members only"}
          </p>

          {/* Headline */}
          <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dm, lineHeight: "1.15", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 14px" }}>
            {isSignedIn
              ? "Upgrade to continue"
              : "Join the Archive"}
          </h3>

          {/* Description */}
          <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", lineHeight: "1.8", color: MUTED, margin: "0 0 28px" }}>
            {context ?? (isSignedIn
              ? "This content is available to Indart Scholars. Upgrade to access every Journey, Conversation, and Archive annotation."
              : "Create a free account to access the first episodes of every Journey and begin your study.")}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" as const }}>
            {isSignedIn ? (
              <GoldBtn href="/membership" label="Become a Scholar" />
            ) : (
              <>
                <GoldBtn href="/sign-up" label="Join free" />
                <OutlineBtn href="/sign-in" label="Sign in" />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function GoldBtn({ href, label }: { href: string; label: string }) {
  const [h, setH] = React.useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: "9px",
        padding: "12px 24px",
        background: h ? GOLD_H : GOLD,
        textDecoration: "none",
        transition: "background 0.4s ease",
      }}
    >
      <span style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: BG_INK, textTransform: "uppercase" as const }}>
        {label}
      </span>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1.5 5.5h8M9.5 5.5L7 3M9.5 5.5L7 8" stroke={BG_INK} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

function OutlineBtn({ href, label }: { href: string; label: string }) {
  const [h, setH] = React.useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: "9px",
        padding: "12px 22px",
        border: `1px solid rgba(181,131,44,${h ? 0.4 : 0.2})`,
        background: h ? "rgba(181,131,44,0.04)" : "transparent",
        textDecoration: "none",
        transition: "border-color 0.3s ease, background 0.3s ease",
      }}
    >
      <span style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 400, letterSpacing: "0.12em", color: h ? GOLD : CREAM_D, textTransform: "uppercase" as const, transition: "color 0.3s ease" }}>
        {label}
      </span>
    </Link>
  )
}

function GateSkeleton() {
  return (
    <div style={{ padding: "48px", background: BG_CARD, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "40px", height: "40px", border: "1px solid rgba(181,131,44,0.2)", borderTop: `1px solid ${GOLD}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
