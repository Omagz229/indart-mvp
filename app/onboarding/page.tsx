"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  GOLD, GOLD_H, CREAM, CREAM_D, MUTED, BG, BG_CARD, BG_HOVER,
  BG_INK, BRONZE, BORDER, EASE,
} from "@/lib/indart-tokens"
import { FONT_DISPLAY, FONT_UI, FW, TS, FEATURES_DISPLAY } from "@/lib/typography"

// ─── Onboarding data ──────────────────────────────────────────────────────────

const DISCIPLINES = [
  { id: "philosophy",  label: "Philosophy",       description: "Epistemology, ethics, metaphysics" },
  { id: "literature",  label: "Literature",        description: "Fiction, poetry, oral traditions" },
  { id: "history",     label: "History",           description: "Civilisations, revolutions, archives" },
  { id: "politics",    label: "Political thought", description: "Decolonisation, sovereignty, power" },
  { id: "art",         label: "Arts & Cinema",     description: "Visual culture, film, music" },
  { id: "science",     label: "Science & Tech",    description: "Indigenous knowledge, futures" },
  { id: "religion",    label: "Religion & Spirit", description: "Theology, cosmology, practice" },
  { id: "economics",   label: "Economics",         description: "Development, resource, labour" },
]

const TRADITIONS = [
  "West African", "East African", "Southern African",
  "Central African", "North African", "Diaspora (Americas)",
  "Diaspora (Europe)", "Diaspora (Caribbean)",
]

const HOW_HEARD = [
  "A friend or colleague",
  "Social media",
  "Academic institution",
  "Podcast or newsletter",
  "Search engine",
  "Other",
]

const STEPS = ["Welcome", "Interests", "Traditions", "First journey"] as const
type StepName = typeof STEPS[number]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [step,       setStep]       = React.useState(0)
  const [interests,  setInterests]  = React.useState<string[]>([])
  const [traditions, setTraditions] = React.useState<string[]>([])
  const [howHeard,   setHowHeard]   = React.useState<string | null>(null)
  const [saving,     setSaving]     = React.useState(false)

  if (!isLoaded) return null

  const firstName = user?.firstName ?? "Scholar"

  async function finish() {
    setSaving(true)
    try {
      await user?.update({
        unsafeMetadata: {
          onboarded: true,
          interests,
          traditions,
          howHeard,
        },
      })
    } finally {
      router.push("/journeys")
    }
  }

  const canProceed = [
    true,
    interests.length > 0,
    traditions.length > 0,
    true,
  ][step]

  return (
    <div
      style={{
        minHeight: "100svh",
        background: BG_INK,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(24px, 5vw, 60px)",
        position: "relative",
      }}
    >
      {/* Background bloom */}
      <div aria-hidden style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(181,131,44,0.055) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Progress filament */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "rgba(181,131,44,0.1)" }}>
        <motion.div
          style={{ height: "100%", background: GOLD }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>

      {/* Logo */}
      <Link href="/" style={{ position: "fixed", top: "24px", left: "clamp(24px, 4vw, 48px)", textDecoration: "none" }}>
        <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: "13px", letterSpacing: "0.42em", color: CREAM, textTransform: "uppercase" as const }}>
          INDART
        </span>
      </Link>

      {/* Step indicator */}
      <div style={{ position: "fixed", top: "30px", right: "clamp(24px, 4vw, 48px)", display: "flex", gap: "6px", alignItems: "center" }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            style={{
              width: i === step ? "14px" : "5px",
              height: "5px",
              borderRadius: "2.5px",
              background: i < step ? BRONZE : i === step ? GOLD : "rgba(181,131,44,0.18)",
              transition: "width 0.4s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{ width: "100%", maxWidth: "520px", position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepWelcome key="welcome" name={firstName} onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <StepInterests key="interests" selected={interests} onToggle={(id) => setInterests((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])} onNext={() => setStep(2)} canProceed={canProceed} />
          )}
          {step === 2 && (
            <StepTraditions key="traditions" selected={traditions} onToggle={(t) => setTraditions((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])} howHeard={howHeard} onHowHeard={setHowHeard} onNext={() => setStep(3)} canProceed={canProceed} />
          )}
          {step === 3 && (
            <StepFirstJourney key="journey" name={firstName} onFinish={finish} saving={saving} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepWelcome({ name, onNext }: { name: string; onNext: () => void }) {
  return (
    <OnboardingCard>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}
      >
        <div
          style={{
            width: "72px", height: "72px",
            border: "1px solid rgba(181,131,44,0.3)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(181,131,44,0.05)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4C9 4 5 8 5 14s4 10 9 10 9-4 9-10" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" fill="none" />
            <path d="M14 10v8M10.5 14h7" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 14px", textAlign: "center" as const }}>
        Welcome to Indart
      </p>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dl, lineHeight: "1.08", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 20px", textAlign: "center" as const }}>
        Welcome,<br />{name}.
      </h1>
      <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "14px", lineHeight: "1.85", color: MUTED, margin: "0 0 36px", textAlign: "center" as const }}>
        Indart is an archive of African thought — built for serious study. Take two minutes to tell us who you are, and we'll shape your first experience around you.
      </p>

      <OnboardingBtn label="Begin" onClick={onNext} />
    </OnboardingCard>
  )
}

function StepInterests({
  selected, onToggle, onNext, canProceed,
}: {
  selected: string[]; onToggle: (id: string) => void; onNext: () => void; canProceed: boolean
}) {
  return (
    <OnboardingCard>
      <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 14px" }}>
        Step 1 of 3
      </p>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dm, lineHeight: "1.1", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 10px" }}>
        What are your intellectual interests?
      </h2>
      <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", color: MUTED, lineHeight: "1.7", margin: "0 0 28px" }}>
        Select everything that calls to you. You can always change this later.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "32px" }}>
        {DISCIPLINES.map(({ id, label, description }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              style={{
                padding: "14px 16px",
                background: active ? "rgba(181,131,44,0.08)" : "transparent",
                border: `1px solid rgba(181,131,44,${active ? 0.4 : 0.12})`,
                cursor: "pointer", textAlign: "left" as const,
                transition: "background 0.3s ease, border-color 0.3s ease",
              }}
            >
              <p style={{ fontFamily: FONT_UI, fontSize: "12px", fontWeight: 500, color: active ? GOLD : CREAM_D, margin: "0 0 3px", transition: "color 0.3s ease" }}>
                {label}
              </p>
              <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "10px", color: MUTED, margin: 0 }}>
                {description}
              </p>
            </button>
          )
        })}
      </div>

      <OnboardingBtn label="Continue" onClick={onNext} disabled={!canProceed} />
      {!canProceed && (
        <p style={{ fontFamily: FONT_UI, fontSize: "11px", color: MUTED, textAlign: "center" as const, marginTop: "12px" }}>
          Select at least one interest to continue.
        </p>
      )}
    </OnboardingCard>
  )
}

function StepTraditions({
  selected, onToggle, howHeard, onHowHeard, onNext, canProceed,
}: {
  selected: string[]; onToggle: (t: string) => void
  howHeard: string | null; onHowHeard: (v: string) => void
  onNext: () => void; canProceed: boolean
}) {
  return (
    <OnboardingCard>
      <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 14px" }}>
        Step 2 of 3
      </p>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dm, lineHeight: "1.1", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 10px" }}>
        Which traditions speak to you?
      </h2>
      <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", color: MUTED, lineHeight: "1.7", margin: "0 0 24px" }}>
        We'll surface content from these regions first.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginBottom: "28px" }}>
        {TRADITIONS.map((t) => {
          const active = selected.includes(t)
          return (
            <button
              key={t}
              onClick={() => onToggle(t)}
              style={{
                padding: "8px 16px",
                background: active ? "rgba(181,131,44,0.08)" : "transparent",
                border: `1px solid rgba(181,131,44,${active ? 0.4 : 0.12})`,
                cursor: "pointer",
                fontFamily: FONT_UI, fontSize: "12px",
                color: active ? GOLD : CREAM_D,
                transition: "all 0.3s ease",
              }}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* How did you hear */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: MUTED, textTransform: "uppercase" as const, margin: "0 0 12px" }}>
          How did you find us? (optional)
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
          {HOW_HEARD.map((h) => (
            <button
              key={h}
              onClick={() => onHowHeard(h)}
              style={{
                padding: "6px 13px",
                background: howHeard === h ? "rgba(181,131,44,0.06)" : "transparent",
                border: `1px solid rgba(181,131,44,${howHeard === h ? 0.3 : 0.1})`,
                cursor: "pointer",
                fontFamily: FONT_UI, fontSize: "11px",
                color: howHeard === h ? GOLD : MUTED,
                transition: "all 0.3s ease",
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <OnboardingBtn label="Continue" onClick={onNext} disabled={!canProceed} />
    </OnboardingCard>
  )
}

function StepFirstJourney({ name, onFinish, saving }: { name: string; onFinish: () => void; saving: boolean }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <OnboardingCard>
      <p style={{ fontFamily: FONT_UI, fontSize: "9px", fontWeight: 500, letterSpacing: "0.26em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 14px" }}>
        Step 3 of 3
      </p>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: TS.dm, lineHeight: "1.1", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: "0 0 20px" }}>
        Your first Journey awaits.
      </h2>

      {/* Suggested journey */}
      <div
        style={{
          background: BG_HOVER,
          border: "1px solid rgba(181,131,44,0.12)",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div style={{ position: "relative", paddingBottom: "44%", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=300&fit=crop&auto=format"
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", objectFit: "cover",
              filter: "grayscale(60%) brightness(0.4)",
            }}
          />
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(8,6,4,0.95) 100%)" }} />
          <div style={{ position: "absolute", top: "12px", left: "14px" }}>
            <span style={{ fontFamily: FONT_UI, fontSize: "8px", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase" as const, padding: "3px 8px", border: "1px solid rgba(181,131,44,0.35)", background: "rgba(8,6,4,0.6)" }}>
              Free Access
            </span>
          </div>
        </div>
        <div style={{ padding: "16px 18px 20px" }}>
          <p style={{ fontFamily: FONT_UI, fontSize: "9px", letterSpacing: "0.16em", color: BRONZE, textTransform: "uppercase" as const, margin: "0 0 6px" }}>
            Recommended · 12 episodes · 8 hours
          </p>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: FW.light, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: "1.15", color: CREAM, fontFeatureSettings: FEATURES_DISPLAY, margin: 0 }}>
            The Griot Tradition
          </h3>
        </div>
      </div>

      <p style={{ fontFamily: FONT_UI, fontWeight: 300, fontSize: "13px", lineHeight: "1.8", color: MUTED, margin: "0 0 28px" }}>
        Your profile is ready, {name}. We'll refine your recommendations as you study.
      </p>

      <button
        onClick={onFinish}
        disabled={saving}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative" as const, overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
          padding: "15px 28px", width: "100%",
          background: saving ? "rgba(181,131,44,0.5)" : hovered ? GOLD_H : GOLD,
          border: "none", cursor: saving ? "wait" : "pointer",
          transition: "background 0.4s ease",
        }}
      >
        {saving ? (
          <div style={{ display: "flex", gap: "5px" }}>
            {[0, 1, 2].map((i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                style={{ width: "4px", height: "4px", borderRadius: "50%", background: BG_INK }} />
            ))}
          </div>
        ) : (
          <>
            <span style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: BG_INK, textTransform: "uppercase" as const }}>
              Enter the Archive
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke={BG_INK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </OnboardingCard>
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function OnboardingCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        padding: "clamp(28px, 5vw, 48px)",
      }}
    >
      {children}
    </motion.div>
  )
}

function OnboardingBtn({
  label, onClick, disabled,
}: { label: string; onClick: () => void; disabled?: boolean }) {
  const [h, setH] = React.useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
        padding: "14px 28px", width: "100%",
        background: disabled ? "rgba(181,131,44,0.18)" : h ? GOLD_H : GOLD,
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.4s ease",
      }}
    >
      <span style={{ fontFamily: FONT_UI, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", color: disabled ? "rgba(4,2,0,0.45)" : BG_INK, textTransform: "uppercase" as const }}>
        {label}
      </span>
      {!disabled && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10M10 6L7 3M10 6L7 9" stroke={BG_INK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
