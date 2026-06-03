// lib/auth/server.ts
import { currentUser } from "@clerk/nextjs/server"
import type { Tier, ContentTier } from "./tier"
import { hasAccess } from "./tier"

export interface IndartServerUser {
  userId: string
  tier: Tier
  accessUntil: string | null
  onboardingComplete: boolean
  disciplines: string[]
  traditions: string[]
}

/**
 * Fetches the current user from Clerk (one live API call).
 * Returns null if not signed in.
 *
 * Use this in server components that need accurate, post-webhook tier data.
 * For middleware or non-critical checks, session claims are faster but may
 * be stale for up to the JWT TTL (~1 hour) after a tier change.
 */
export async function getIndartUser(): Promise<IndartServerUser | null> {
  const user = await currentUser()
  if (!user) return null

  const meta = user.publicMetadata as Record<string, unknown>

  return {
    userId:             user.id,
    tier:               (meta.tier as Tier) ?? "free",
    accessUntil:        (meta.accessUntil as string | null) ?? null,
    onboardingComplete: (meta.onboardingComplete as boolean) ?? false,
    disciplines:        (meta.disciplines as string[]) ?? [],
    traditions:         (meta.traditions as string[]) ?? [],
  }
}

/**
 * Server-side access check. Returns true if the current user
 * may access content at `required` tier.
 * Unauthenticated users are treated as "free".
 */
export async function canAccess(required: ContentTier): Promise<boolean> {
  const user = await getIndartUser()
  const tier: Tier = user?.tier ?? "free"
  return hasAccess(tier, required, user?.accessUntil)
}
