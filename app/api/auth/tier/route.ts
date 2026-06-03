// app/api/auth/tier/route.ts
// Returns the user's current tier by reading LIVE from Clerk — not from the
// session JWT, which may be stale for up to the Clerk token TTL after a
// tier change via webhook.
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ tier: "free", onboardingComplete: false })
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const meta = user.publicMetadata as UserPublicMetadata

    return NextResponse.json({
      tier: meta.tier ?? "free",
      tierSince: meta.tierSince ?? null,
      onboardingComplete: meta.onboardingComplete ?? false,
    })
  } catch {
    // Clerk API unavailable — fall back to safe default
    return NextResponse.json({ tier: "free", onboardingComplete: false })
  }
}
