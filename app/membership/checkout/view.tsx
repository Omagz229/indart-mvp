"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { Tier } from "@/lib/auth/tier"
import {
  GOLD, GOLD_H, CREAM, CREAM_D, MUTED, BG, BG_CARD, BG_INK,
  BRONZE, BORDER, EASE, FADE_UP,
  GRAD_BLOOM_TOP, GRAD_BLOOM_LEFT,
} from "@/lib/indart-tokens"
import {
  FONT_DISPLAY, FONT_UI, FW, TS, LS, LH, FEATURES_DISPLAY,
} from "@/lib/typography"

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  scholar: {
    name: "Scholar",
    price: "£12",
    priceNote: "per month · billed monthly",
    annualNote: "or £96 per year — two months free",
    tier: "scholar" as Tier,
    commitment: "Monthly or annual · cancel any time",
    what: [
      "Every Journey — complete and unrestricted",
      "Full Archive with scholarly annotation",
      "All Conversations — present and forthcoming",
      "Study Circle participation",
      "Scholar designation and profile",
    ],
    statement: "Full access to every Journey, the annotated Archive, and all Conversations. The complete intellectual experience.",
  },
  "founding-patron": {
    name: "Founding Patron",
    price: "£150",
    priceNote: "one-time payment · permanent access",
    annualNote: "No recurring charge — ever",
    tier: "founding-patron" as Tier,
    commitment: "One-time · access does not expire",
    what: [
      "Everything in Scholar — permanently",
      "Your name inscribed in the Archive",
      "Founding Patron dispatches (private, twice yearly)",
      "Vote on the next discipline",
      "Invitation to the founding gathering",
    ],
    statement: "Permanent full access, Archive inscription, and a founding voice in what Indart becomes.",
  },
} as const

type TierKey = keyof typeof TIER_CONFIG

function isTierKey(v: string): v is TierKey {
  return v === "scholar" || v === "founding-patron"
}

// ── View ──────────────────────────────────────────────────────────────────────

interface Props {
  tier: string
}

type Step = "confirm" | "details" | "processing" | "done"

export default function CheckoutView({ tier: tierParam }: Props) {
  const router = useRouter()
  const tierKey: TierKey = isTierKey(tierParam) ? tierParam : "scholar"
  const config = TIER_CONFIG[tierKey]

  const [step, setStep] = React.useState<Step>("confirm")
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [annual, setAnnual] = React.useState(false)
  const [error, setError] = React.useState("")

  function handleConfirm() {
    setStep("details")
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    // Phase 6 wires this to real Stripe — see app/api/checkout/route.ts
    alert("Stripe checkout not yet configured.")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        paddingTop: "clamp(64px, 10vw, 96px)",
        paddingBottom: "clamp(80px, 12vw, 128px)",
        position: "relative",
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, background: GRAD_BLOOM_TOP, pointerEvents: "none" }} />

      {/* Nav breadcrumb */}
      <div
        style={{
          paddingLeft: "clamp(24px, 5vw, 72px)",
          paddingRight: "clamp(24px, 5vw, 72px)",
          marginBottom: "clamp(40px, 6vw, 64px)",
        }}
      >
        <Link
          href="/membership"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4.5 7 9 12" stroke="rgba(114,100,86,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: FONT_UI, fontSize: "10px", letterSpacing: LS.label, color: MUTED, textTransform: "uppercase" as const }}>
            Membership
          </span>
        </Link>
      </div>

      <div
        style={{
          paddingLeft: "clamp(24px, 5vw, 72px)",
          paddingRight: "clamp(24px, 5vw, 72px)",
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(40px, 6vw, 72px)",
        }}
        className="lg:grid-cols-[1fr_420px]"
      >
        {/* Left — tier summary */}
        <motion.div {...FADE_UP}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
            <span style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: FW.light, letterSpacing: LS.label, color: BRONZE }}>Joining</span>
            <div style={{ width: "24px", height: "1px", background: "rgba(181,131,44,0.4)" }} />
            <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: FW.medium, letterSpacing: LS.label, color: GOLD, textTransform: "uppercase" as const }}>
              {config.name}
            </span>
          </div>

          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: FW.light,
              fontSize: TS.dl,
              lineHeight: LH.subhead,
              color: CREAM,
              letterSpacing: LS.normal,
              fontFeatureSettings: FEATURES_DISPLAY,
              margin: "0 0 16px",
            }}
          >
            {tierKey === "scholar" ? "Commit to the work." : "Build what this becomes."}
          </h1>

          <p
            style={{
              fontFamily: FONT_UI,
              fontWeight: FW.light,
              fontSize: TS.bl,
              lineHeight: LH.body,
              color: MUTED,
              margin: "0 0 40px",
              maxWidth: "440px",
            }}
          >
            {config.statement}
          </p>

          <div
            style={{
              padding: "clamp(24px, 3vw, 32px)",
              background: BG_CARD,
              border: "1px solid rgba(181,131,44,0.12)",
              marginBottom: "24px",
            }}
          >
            <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: FW.medium, letterSpacing: LS.label, color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 20px" }}>
              What you receive
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "11px" }}>
              {config.what.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M1.5 6L4 8.5L9.5 3" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: FONT_UI, fontWeight: FW.light, fontSize: TS.bs, lineHeight: "1.65", color: CREAM_D }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "14px 20px", background: "rgba(181,131,44,0.04)", border: "1px solid rgba(181,131,44,0.09)" }}>
            <p style={{ fontFamily: FONT_UI, fontSize: "9px", color: MUTED, margin: 0, lineHeight: "1.7" }}>
              <strong style={{ color: "rgba(181,131,44,0.6)", fontWeight: FW.medium }}>Demo mode.</strong>
              {" "}No real payment is processed. In production, this step would connect to secure Stripe checkout.
            </p>
          </div>
        </motion.div>

        {/* Right — checkout form */}
        <motion.div {...FADE_UP} transition={{ duration: 2.0, delay: 0.18, ease: EASE }}>
          <div
            style={{
              border: "1px solid rgba(181,131,44,0.14)",
              background: BG_CARD,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div aria-hidden style={{ position: "absolute", inset: 0, background: GRAD_BLOOM_LEFT, opacity: 0.4, pointerEvents: "none" }} />

            <div style={{ padding: "clamp(24px, 3vw, 36px)", position: "relative" }}>

              {/* Price summary */}
              <div style={{ borderBottom: "1px solid rgba(181,131,44,0.1)", paddingBottom: "24px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: FW.medium, letterSpacing: LS.label, color: GOLD, textTransform: "uppercase" as const, margin: "0 0 6px" }}>
                      {config.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                      <span
                        style={{
                          fontFamily: FONT_DISPLAY,
                          fontSize: TS.dm,
                          fontWeight: FW.light,
                          color: CREAM,
                          fontFeatureSettings: FEATURES_DISPLAY,
                          lineHeight: 1,
                        }}
                      >
                        {annual && tierKey === "scholar" ? "£96" : config.price}
                      </span>
                      <span style={{ fontFamily: FONT_UI, fontSize: TS.bs, color: MUTED }}>
                        {annual && tierKey === "scholar" ? "per year" : config.priceNote}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: FONT_UI, fontSize: "10px", color: "rgba(114,100,86,0.6)", textAlign: "right" as const, maxWidth: "140px", lineHeight: "1.5" }}>
                    {config.commitment}
                  </p>
                </div>

                {tierKey === "scholar" && (
                  <button
                    onClick={() => setAnnual((v) => !v)}
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "18px",
                        borderRadius: "9px",
                        background: annual ? GOLD : "rgba(181,131,44,0.15)",
                        position: "relative",
                        transition: "background 0.3s ease",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: annual ? "17px" : "3px",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: annual ? BG_INK : MUTED,
                          transition: "left 0.3s ease, background 0.3s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: FONT_UI, fontSize: TS.bs, color: annual ? GOLD : MUTED, transition: "color 0.3s ease" }}>
                      Annual billing — {config.annualNote}
                    </span>
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: TS.dm,
                        fontWeight: FW.light,
                        color: CREAM,
                        fontFeatureSettings: FEATURES_DISPLAY,
                        margin: "0 0 12px",
                      }}
                    >
                      Your commitment.
                    </p>
                    <p style={{ fontFamily: FONT_UI, fontWeight: FW.light, fontSize: TS.bm, lineHeight: LH.body, color: MUTED, margin: "0 0 28px" }}>
                      Confirm the tier you are joining. You can change or cancel at any time.
                    </p>
                    <button
                      onClick={handleConfirm}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        width: "100%",
                        padding: "16px",
                        background: GOLD,
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = GOLD_H)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
                    >
                      <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: FW.medium, letterSpacing: LS.widened, color: BG_INK, textTransform: "uppercase" as const }}>
                        Continue to details
                      </span>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5h7M6 2.5L8.5 5 6 7.5" stroke={BG_INK} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </motion.div>
                )}

                {step === "details" && (
                  <motion.form
                    key="details"
                    onSubmit={handleComplete}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ display: "flex", flexDirection: "column" as const, gap: "20px" }}
                  >
                    <div>
                      <label
                        htmlFor="fullName"
                        style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: FW.medium, letterSpacing: LS.label, color: MUTED, textTransform: "uppercase" as const, display: "block", marginBottom: "8px" }}
                      >
                        Full name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          background: "rgba(181,131,44,0.03)",
                          border: "1px solid rgba(181,131,44,0.18)",
                          color: CREAM,
                          fontFamily: FONT_UI,
                          fontSize: TS.bm,
                          outline: "none",
                          boxSizing: "border-box" as const,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: FW.medium, letterSpacing: LS.label, color: MUTED, textTransform: "uppercase" as const, display: "block", marginBottom: "8px" }}
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          background: "rgba(181,131,44,0.03)",
                          border: "1px solid rgba(181,131,44,0.18)",
                          color: CREAM,
                          fontFamily: FONT_UI,
                          fontSize: TS.bm,
                          outline: "none",
                          boxSizing: "border-box" as const,
                        }}
                      />
                    </div>

                    {error && (
                      <p style={{ fontFamily: FONT_UI, fontSize: TS.bs, color: "rgba(220,100,80,0.85)", margin: 0 }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "16px",
                        background: GOLD,
                        border: "none",
                        cursor: "pointer",
                        marginTop: "8px",
                        transition: "background 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = GOLD_H)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
                    >
                      <span style={{ fontFamily: FONT_UI, fontSize: "10px", fontWeight: FW.medium, letterSpacing: LS.widened, color: BG_INK, textTransform: "uppercase" as const }}>
                        Complete Membership
                      </span>
                    </button>

                    <p style={{ fontFamily: FONT_UI, fontWeight: FW.light, fontSize: "10px", color: "rgba(114,100,86,0.55)", lineHeight: "1.65", margin: 0, textAlign: "center" as const }}>
                      Demo mode — no real payment required
                    </p>
                  </motion.form>
                )}

                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ textAlign: "center" as const, padding: "32px 0" }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        border: `1px solid ${GOLD}`,
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        margin: "0 auto 20px",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <p style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: TS.ds, color: CREAM_D, fontFeatureSettings: FEATURES_DISPLAY }}>
                      Opening the Archive…
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
