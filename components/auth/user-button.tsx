"use client"

import React from "react"
import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { GOLD, CREAM, CREAM_D, MUTED, BG_CARD, BG_HOVER, BG_INK, BRONZE, BORDER, EASE } from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FEATURES_DISPLAY } from "@/lib/typography"

type Tier = "free" | "scholar" | "founding-patron"

const TIER_COLORS: Record<Tier, string> = {
  "free": BRONZE,
  "scholar": GOLD,
  "founding-patron": "#C49034",
}

const TIER_LABELS: Record<Tier, string> = {
  "free": "Explorer",
  "scholar": "Scholar",
  "founding-patron": "Founding Patron",
}

export default function UserButton() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <NavAuthLink href="/sign-in" label="Sign in" />
        <NavAuthCTA href="/sign-up" label="Join free" />
      </div>
    )
  }

  const meta      = user.publicMetadata as { tier?: Tier }
  const tier: Tier = meta.tier ?? "free"
  const firstName = user.firstName ?? ""
  const initials  = (firstName[0] ?? user.emailAddresses[0]?.emailAddress[0] ?? "?").toUpperCase()

  return (
    <div ref={ref} style={{ position: "relative" as const }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: "9px",
          background: "none", border: "none", cursor: "pointer", padding: "4px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "32px", height: "32px",
            borderRadius: "50%",
            border: `1px solid rgba(181,131,44,${open ? 0.45 : 0.25})`,
            overflow: "hidden",
            background: "rgba(181,131,44,0.07)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.3s ease",
          }}
        >
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={firstName} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%)" }} />
          ) : (
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: "13px", color: GOLD, fontFeatureSettings: FEATURES_DISPLAY }}>
              {initials}
            </span>
          )}
        </div>

        {/* Tier dot */}
        <div
          style={{
            width: "5px", height: "5px",
            borderRadius: "50%",
            background: TIER_COLORS[tier],
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: "220px",
              background: "#0D0B08",
              border: `1px solid rgba(181,131,44,0.14)`,
              zIndex: 200,
              overflow: "hidden",
            }}
          >
            {/* User header */}
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}` }}>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: "15px", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 2px" }}>
                {firstName || user.emailAddresses[0]?.emailAddress}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: TIER_COLORS[tier], flexShrink: 0 }} />
                <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: "0.1em", color: TIER_COLORS[tier] }}>
                  {TIER_LABELS[tier]}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <DropItem href="/account"    label="My Account"  onClick={() => setOpen(false)} />
            <DropItem href="/journeys"   label="Journeys"    onClick={() => setOpen(false)} />
            <DropItem href="/membership" label="Membership"  onClick={() => setOpen(false)} />

            <div style={{ height: "1px", background: BORDER }} />

            <button
              onClick={async () => {
                setOpen(false)
                await signOut()
                router.push("/")
              }}
              style={{
                display: "flex", alignItems: "center",
                width: "100%", padding: "11px 16px",
                background: "none", border: "none", cursor: "pointer", textAlign: "left" as const,
              }}
            >
              <span style={{ fontFamily: FONT_UI, fontSize: "12px", color: MUTED }}>Sign out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DropItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const [h, setH] = React.useState(false)
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }} onClick={onClick}>
      <div
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          padding: "11px 16px",
          background: h ? BG_HOVER : "transparent",
          transition: "background 0.2s ease",
          cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: FONT_UI, fontSize: "12px", color: h ? CREAM : CREAM_D, transition: "color 0.2s ease" }}>
          {label}
        </span>
      </div>
    </Link>
  )
}

function NavAuthLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{ fontFamily: FONT_UI, fontSize: "12px", letterSpacing: "0.06em", color: "rgba(232,220,200,0.55)", textDecoration: "none", padding: "6px 12px" }}>
      {label}
    </Link>
  )
}

function NavAuthCTA({ href, label }: { href: string; label: string }) {
  const [h, setH] = React.useState(false)
  return (
    <Link
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500,
        letterSpacing: "0.12em", color: h ? GOLD : "rgba(181,131,44,0.8)",
        textDecoration: "none",
        padding: "7px 16px",
        border: `1px solid rgba(181,131,44,${h ? 0.45 : 0.22})`,
        transition: "color 0.3s ease, border-color 0.3s ease",
        textTransform: "uppercase" as const,
      }}
    >
      {label}
    </Link>
  )
}
