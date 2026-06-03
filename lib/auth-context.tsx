// lib/auth-context.tsx
// This file is kept for import compatibility.
// New code should import from lib/auth/client.ts directly.
"use client"

export type { Tier, ContentTier } from "./auth/tier"
export { useIndartAuth as useAuth } from "./auth/client"
export type { IndartAuthState } from "./auth/client"

// persistDemoSignIn is intentionally not re-exported.
// It was a development-only shim — use real Clerk auth instead.
