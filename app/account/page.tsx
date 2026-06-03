"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { motion } from "framer-motion"
import PageShell from "@/components/layout/page-shell"
import {
  GOLD, CREAM, CREAM_D, MUTED, BG, BG_CARD, BG_HOVER,
  BG_INK, BRONZE, BORDER, EASE, FADE_UP,
} from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FW, TS, FEATURES_DISPLAY } from "@/lib/typography"

type Tier = "free" | "scholar" | "founding-patron"

const TIER_LABELS: Record<Tier, string> = {
  "free": "Explorer",
  "scholar": "Scholar",
  "founding-patron": "Founding Patron",
}

const TIER_COLORS: Record<Tier, string> = {
  "free": BRONZE,
  "scholar": GOLD,
  "founding-patron": "#C49034",
}

// Mock progress data (would come from a database in production)
const RECENT_JOURNEYS = [
  { slug: "griot-tradition", title: "The Griot Tradition", progress: 25, total: 12, current: 3 },
]

export default function AccountPage() {
  const { user, isLoaded } = useUser()
  const { signOut }        = useClerk()
  const router             = useRouter()

  if (!isLoaded) return null

  if (!user) {
    router.push("/sign-in")
    return null
  }

  const meta       = user.publicMetadata as { tier?: Tier }
  const tier: Tier = meta.tier ?? "free"
  const unsafeMeta = user.unsafeMetadata as { interests?: string[]; traditions?: string[]; onboarded?: boolean }
  const interests  = unsafeMeta.interests ?? []
  const traditions = unsafeMeta.traditions ?? []

  const firstName = user.firstName ?? ""
  const lastName  = user.lastName  ?? ""
  const email     = user.primaryEmailAddress?.emailAddress ?? ""
  const initials  = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?"

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  return (
    <PageShell>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingLeft: "clamp(32px, 6vw, 96px)",
          paddingRight: "clamp(32px, 6vw, 96px)",
          paddingTop: "clamp(64px, 10vw, 96px)",
          paddingBottom: "clamp(48px, 7vw, 72px)",
          borderBottom: `1px solid ${BORDER}`,
          position: "relative",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(181,131,44,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div {...FADE_UP} style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" as const }}>
          {/* Avatar */}
          <div
            style={{
              width: "88px", height: "88px",
              borderRadius: "50%",
              border: "1px solid rgba(181,131,44,0.3)",
              overflow: "hidden",
              flexShrink: 0,
              background: "rgba(181,131,44,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={firstName} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%)" }} />
            ) : (
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", color: GOLD, fontFeatureSettings: FEATURES_DISPLAY }}>
                {initials}
              </span>
            )}
          </div>

          {/* Identity */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" as const }}>
              <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dl, lineHeight: "1.05", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
                {firstName} {lastName}
              </h1>
              <TierBadge tier={tier} />
            </div>
            <p style={{ fontFamily: FONT_UI, fontSize: "13px", color: MUTED, margin: 0 }}>{email}</p>
          </div>
        </motion.div>
      </section>

      {/* ── Main grid ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          paddingLeft: "clamp(32px, 6vw, 96px)",
          paddingRight: "clamp(32px, 6vw, 96px)",
          paddingTop: "clamp(48px, 7vw, 72px)",
          paddingBottom: "clamp(80px, 12vw, 128px)",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(32px, 5vw, 56px)",
        }}
        className="lg:grid-cols-[1fr_320px]"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(32px, 5vw, 48px)" }}>

          {/* Membership card */}
          <AccountSection label="Membership" index={1}>
            <div style={{ background: BG_CARD, border: `1px solid rgba(181,131,44,${tier === "free" ? 0.08 : 0.22})`, padding: "clamp(20px, 3vw, 32px)", position: "relative", overflow: "hidden" }}>
              {tier !== "free" && (
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 100% 0%, rgba(181,131,44,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" as const }}>
                <div>
                  <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.22em", color: TIER_COLORS[tier], textTransform: "uppercase" as const, margin: "0 0 8px" }}>
                    Current plan
                  </p>
                  <p style={{ fontFamily: FONT_DISPLAY, fontSize: TS.dm, fontWeight: FW.light, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 8px" }}>
                    {TIER_LABELS[tier]}
                  </p>
                  <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", lineHeight: "1.75", color: MUTED, margin: 0, maxWidth: "380px" }}>
                    {tier === "free"
                      ? "You have access to free episodes and archive browsing. Upgrade to unlock the full intellectual experience."
                      : tier === "scholar"
                      ? "Full access to all Journeys, Conversations, and Archive annotations."
                      : "Permanent full access. Your name is inscribed in the Indart Archive."}
                  </p>
                </div>
                {tier === "free" && (
                  <Link
                    href="/membership"
                    style={{
                      display: "flex", alignItems: "center", gap: "9px",
                      padding: "11px 20px",
                      background: GOLD, border: "none",
                      textDecoration: "none", flexShrink: 0,
                    }}
                  >
                    <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", color: BG_INK, textTransform: "uppercase" as const }}>
                      Upgrade
                    </span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5h7M8.5 5L6 2.5M8.5 5L6 7.5" stroke={BG_INK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
                {tier === "scholar" && <ManageBillingButton />}
              </div>
            </div>
          </AccountSection>

          {/* Journeys in progress */}
          <AccountSection label="In progress" index={2}>
            {RECENT_JOURNEYS.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
                {RECENT_JOURNEYS.map((j) => (
                  <JourneyProgressRow key={j.slug} journey={j} />
                ))}
              </div>
            ) : (
              <EmptyState label="No journeys started yet." cta="Browse Journeys" href="/journeys" />
            )}
          </AccountSection>

          {/* Profile */}
          <AccountSection label="Profile" index={3}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: BORDER }}>
              <ProfileField label="First name" value={firstName} />
              <ProfileField label="Last name"  value={lastName} />
              <ProfileField label="Email"      value={email} span />
              {interests.length > 0 && (
                <div style={{ gridColumn: "1 / -1", padding: "16px 20px", background: BG_CARD }}>
                  <p style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.14em", color: MUTED, textTransform: "uppercase" as const, margin: "0 0 10px" }}>Interests</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                    {interests.map((i) => (
                      <span key={i} style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.12em", color: GOLD, textTransform: "capitalize" as const, padding: "3px 10px", border: "1px solid rgba(181,131,44,0.22)" }}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {traditions.length > 0 && (
                <div style={{ gridColumn: "1 / -1", padding: "16px 20px", background: BG_CARD }}>
                  <p style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.14em", color: MUTED, textTransform: "uppercase" as const, margin: "0 0 10px" }}>Traditions</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                    {traditions.map((t) => (
                      <span key={t} style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.12em", color: BRONZE, padding: "3px 10px", border: "1px solid rgba(139,94,42,0.3)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccountSection>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(24px, 4vw, 32px)" }}>
          {/* Quick links */}
          <AccountSection label="Navigate" index={4}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1px", background: BORDER }}>
              {[
                { label: "All Journeys",    href: "/journeys"    },
                { label: "Thinkers",        href: "/thinkers"    },
                { label: "Archive",         href: "/archive"     },
                { label: "Conversations",   href: "/conversations"},
                { label: "Membership",      href: "/membership"  },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                  <QuickLinkRow label={link.label} />
                </Link>
              ))}
            </div>
          </AccountSection>

          {/* Danger zone */}
          <div style={{ padding: "20px", border: "1px solid rgba(181,131,44,0.08)", background: BG_CARD }}>
            <p style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", color: MUTED, textTransform: "uppercase" as const, margin: "0 0 16px" }}>
              Account
            </p>
            <button
              onClick={handleSignOut}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "none", border: "1px solid rgba(181,131,44,0.14)",
                padding: "10px 18px", cursor: "pointer", width: "100%",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.14em", color: MUTED, textTransform: "uppercase" as const }}>
                Sign out
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ManageBillingButton() {
  const [loading, setLoading] = React.useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res  = await fetch("/api/billing-portal", { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.portalUrl) {
        alert(data.error ?? "Could not open billing portal.")
        return
      }
      window.location.href = data.portalUrl
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: "10px",
        fontWeight: 400,
        letterSpacing: "0.12em",
        color: loading ? "rgba(232,220,200,0.3)" : "rgba(232,220,200,0.55)",
        background: "transparent",
        border: "1px solid rgba(181,131,44,0.15)",
        padding: "8px 16px",
        cursor: loading ? "not-allowed" : "pointer",
        textTransform: "uppercase" as const,
        transition: "color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {loading ? "Opening…" : "Manage subscription"}
    </button>
  )
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      style={{
        fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500,
        letterSpacing: "0.18em", color: TIER_COLORS[tier],
        textTransform: "uppercase" as const,
        padding: "4px 12px",
        border: `1px solid ${TIER_COLORS[tier]}44`,
        background: `${TIER_COLORS[tier]}0A`,
      }}
    >
      {TIER_LABELS[tier]}
    </span>
  )
}

function AccountSection({
  label, index, children,
}: { label: string; index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 1.4, delay: index * 0.08, ease: EASE }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 300, letterSpacing: "0.18em", color: BRONZE }}>
          {String(index).padStart(2, "0")}
        </span>
        <div style={{ width: "24px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
        <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.24em", color: GOLD, textTransform: "uppercase" as const }}>
          {label}
        </span>
      </div>
      {children}
    </motion.div>
  )
}

function JourneyProgressRow({ journey }: { journey: typeof RECENT_JOURNEYS[0] }) {
  const [hovered, setHovered] = React.useState(false)
  const pct = Math.round((journey.progress / journey.total) * 100)

  return (
    <Link href={`/journeys/${journey.slug}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "16px 20px",
          background: hovered ? BG_HOVER : BG_CARD,
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: FW.regular, color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
            {journey.title}
          </p>
          <span style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED }}>
            {journey.current} / {journey.total}
          </span>
        </div>
        <div style={{ height: "2px", background: "rgba(181,131,44,0.12)" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: GOLD, transition: "width 1s ease" }} />
        </div>
      </div>
    </Link>
  )
}

function ProfileField({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div style={{ gridColumn: span ? "1 / -1" : undefined, padding: "14px 20px", background: BG_CARD }}>
      <p style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.14em", color: MUTED, textTransform: "uppercase" as const, margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontFamily: FONT_UI, fontSize: "14px", color: CREAM_D, margin: 0 }}>{value || "–"}</p>
    </div>
  )
}

function QuickLinkRow({ label }: { label: string }) {
  const [h, setH] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
        background: h ? BG_HOVER : BG_CARD,
        cursor: "pointer",
        transition: "background 0.3s ease",
      }}
    >
      <span style={{ fontFamily: FONT_UI, fontSize: "12px", color: h ? CREAM : CREAM_D, transition: "color 0.3s ease" }}>
        {label}
      </span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: h ? 1 : 0.4, transition: "opacity 0.3s ease" }}>
        <path d="M2 6h8M8 3.5L10 6 8 8.5" stroke={GOLD} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function EmptyState({ label, cta, href }: { label: string; cta: string; href: string }) {
  return (
    <div style={{ padding: "28px 20px", background: BG_CARD, textAlign: "center" as const }}>
      <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", color: MUTED, margin: "0 0 16px" }}>{label}</p>
      <Link href={href} style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", color: GOLD, textDecoration: "none", textTransform: "uppercase" as const }}>
        {cta} →
      </Link>
    </div>
  )
}
