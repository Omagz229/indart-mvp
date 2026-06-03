// lib/auth/tier.ts

export type Tier = "free" | "scholar" | "founding-patron"

// Precise tier required by a piece of Sanity content.
// null means free — no restriction.
export type ContentTier = "free" | "scholar" | "founding-patron" | null | undefined

export const TIER_RANK: Record<Tier, number> = {
  "free":            0,
  "scholar":         1,
  "founding-patron": 2,
}

/**
 * Returns true if `userTier` meets `required`.
 *
 * @param userTier    - The authenticated user's current tier.
 * @param required    - The minimum tier the content requires. null/undefined = free.
 * @param accessUntil - ISO date string. When set, access is only valid before this
 *                      date. Used for grace periods and period-end cancellations.
 *                      null = no expiry (active subscription or founding patron).
 */
export function hasAccess(
  userTier: Tier,
  required: ContentTier,
  accessUntil?: string | null,
): boolean {
  if (!required || required === "free") return true

  // If accessUntil is set and in the past, access has expired.
  if (accessUntil !== null && accessUntil !== undefined) {
    if (new Date(accessUntil) <= new Date()) return false
  }

  return TIER_RANK[userTier] >= TIER_RANK[required]
}
