import { describe, it, expect } from "vitest"
import { hasAccess, TIER_RANK } from "../tier"
import type { ContentTier } from "../tier"

describe("TIER_RANK", () => {
  it("free < scholar < founding-patron", () => {
    expect(TIER_RANK["free"]).toBeLessThan(TIER_RANK["scholar"])
    expect(TIER_RANK["scholar"]).toBeLessThan(TIER_RANK["founding-patron"])
  })
})

describe("hasAccess", () => {
  it("free content is accessible to everyone", () => {
    expect(hasAccess("free", null)).toBe(true)
    expect(hasAccess("free", "free")).toBe(true)
    expect(hasAccess("free", undefined)).toBe(true)
  })

  it("scholar content requires scholar or higher", () => {
    expect(hasAccess("free", "scholar")).toBe(false)
    expect(hasAccess("scholar", "scholar")).toBe(true)
    expect(hasAccess("founding-patron", "scholar")).toBe(true)
  })

  it("founding-patron content requires founding-patron exactly", () => {
    expect(hasAccess("free", "founding-patron")).toBe(false)
    expect(hasAccess("scholar", "founding-patron")).toBe(false)
    expect(hasAccess("founding-patron", "founding-patron")).toBe(true)
  })

  it("expired accessUntil denies access regardless of tier", () => {
    const pastDate = new Date(Date.now() - 86_400_000).toISOString() // yesterday
    expect(hasAccess("scholar", "scholar", pastDate)).toBe(false)
  })

  it("future accessUntil grants access within grace period", () => {
    const futureDate = new Date(Date.now() + 86_400_000).toISOString() // tomorrow
    expect(hasAccess("scholar", "scholar", futureDate)).toBe(true)
  })

  it("null accessUntil does not restrict active subscriptions", () => {
    expect(hasAccess("scholar", "scholar", null)).toBe(true)
    expect(hasAccess("founding-patron", "founding-patron", null)).toBe(true)
  })
})
