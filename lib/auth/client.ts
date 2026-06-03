// lib/auth/client.ts
"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import type { Tier, ContentTier } from "./tier"
import { hasAccess } from "./tier"

export interface IndartAuthState {
  userId:             string | null
  tier:               Tier
  isLoaded:           boolean
  isSignedIn:         boolean
  onboardingComplete: boolean
  disciplines:        string[]
  traditions:         string[]
  /**
   * Client-side access check — for UX only (show/hide UI elements).
   * Content security is always enforced server-side.
   */
  hasAccess:  (required: ContentTier) => boolean
  signOut:    () => Promise<void>
}

export function useIndartAuth(): IndartAuthState {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>
  const tier: Tier        = (meta.tier as Tier) ?? "free"
  const accessUntil       = (meta.accessUntil as string | null) ?? null

  return {
    userId:             user?.id ?? null,
    tier,
    isLoaded,
    isSignedIn:         !!user,
    onboardingComplete: (meta.onboardingComplete as boolean) ?? false,
    disciplines:        (meta.disciplines as string[]) ?? [],
    traditions:         (meta.traditions as string[]) ?? [],
    hasAccess:          (required) => hasAccess(tier, required, accessUntil),
    signOut:            () => signOut(),
  }
}
