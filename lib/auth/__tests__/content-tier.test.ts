import { describe, it, expect } from "vitest"
import { contentTier } from "../../sanity-helpers"

describe("contentTier", () => {
  it("null access object → free (null)", () => {
    expect(contentTier(null)).toBe(null)
    expect(contentTier(undefined)).toBe(null)
  })

  it("null tier value → free (null)", () => {
    expect(contentTier({ tier: null })).toBe(null)
  })

  it("explicit 'free' tier → null (free content)", () => {
    // Sanity stores "free" as initialValue — must NOT route to "scholar"
    expect(contentTier({ tier: "free" })).toBe(null)
  })

  it("'scholar' tier → 'scholar'", () => {
    expect(contentTier({ tier: "scholar" })).toBe("scholar")
  })

  it("'founding-patron' tier → 'founding-patron'", () => {
    expect(contentTier({ tier: "founding-patron" })).toBe("founding-patron")
  })

  it("legacy 'member' value → 'scholar' (migration compat)", () => {
    expect(contentTier({ tier: "member" })).toBe("scholar")
  })

  it("legacy 'founding-member' value → 'founding-patron' (migration compat)", () => {
    expect(contentTier({ tier: "founding-member" })).toBe("founding-patron")
  })

  it("unknown tier value → null (safe default = free)", () => {
    expect(contentTier({ tier: "unknown-future-value" })).toBe(null)
  })
})
