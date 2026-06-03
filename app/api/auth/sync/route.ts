// app/api/auth/sync/route.ts
// Manual tier reconciliation — for support/ops use only.
// Reconciles a user's Clerk tier with their live Stripe subscription state.
//
// Authentication: Bearer token matching ADMIN_SYNC_KEY env var.
// Rate limited to 10 requests per minute per IP at the edge.
//
// Usage:
//   curl -X POST https://indart.com/api/auth/sync \
//     -H "Authorization: Bearer $ADMIN_SYNC_KEY" \
//     -H "Content-Type: application/json" \
//     -d '{"userId": "user_..."}'

import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization")
  const adminKey   = process.env.ADMIN_SYNC_KEY

  if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
    console.log(JSON.stringify({ level: "warn", event: "admin_sync_unauthorized", ip: req.headers.get("x-forwarded-for") }))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ── Parse + validate userId ─────────────────────────────────────────────────
  const body   = await req.json().catch(() => null)
  const userId = typeof body?.userId === "string" ? body.userId.trim() : null

  if (!userId || !userId.startsWith("user_")) {
    return NextResponse.json({ error: "userId must be a Clerk user ID (starts with 'user_')" }, { status: 400 })
  }

  // ── Load user ───────────────────────────────────────────────────────────────
  const clerk = await clerkClient()
  let user
  try {
    user = await clerk.users.getUser(userId)
  } catch {
    return NextResponse.json({ error: "Clerk user not found" }, { status: 404 })
  }

  const publicMeta  = user.publicMetadata  as UserPublicMetadata
  const privateMeta = user.privateMetadata as UserPrivateMetadata

  // ── Founding patron immunity ─────────────────────────────────────────────────
  const isFoundingPatron =
    publicMeta.tier === "founding-patron" ||
    !!privateMeta.patronPaymentIntentId

  if (isFoundingPatron) {
    // Verify the payment intent is legitimate
    if (privateMeta.patronPaymentIntentId) {
      try {
        const pi = await stripe.paymentIntents.retrieve(privateMeta.patronPaymentIntentId)
        if (pi.status === "succeeded" && publicMeta.tier !== "founding-patron") {
          // Recovery: patron metadata was lost — restore it
          await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
              tier:        "founding-patron",
              tierId:      `patron-${pi.id}`,
              tierSince:   publicMeta.tierSince ?? new Date().toISOString(),
              accessUntil: null,
            },
          })
          console.log(JSON.stringify({ level: "info", event: "admin_sync", userId, outcome: "founding_patron_recovered" }))
          return NextResponse.json({ synced: true, outcome: "founding_patron_recovered" })
        }
      } catch { /* Stripe lookup failed — skip recovery */ }
    }

    console.log(JSON.stringify({ level: "info", event: "admin_sync", userId, outcome: "founding_patron_skipped" }))
    return NextResponse.json({ synced: false, outcome: "founding_patron_immune", reason: "Founding patron tier is permanent — use founding_patron_recovered if metadata is corrupt." })
  }

  // ── No Stripe customer ──────────────────────────────────────────────────────
  if (!privateMeta.stripeCustomerId) {
    console.log(JSON.stringify({ level: "info", event: "admin_sync", userId, outcome: "no_stripe_customer" }))
    return NextResponse.json({ synced: false, outcome: "no_stripe_customer" })
  }

  // ── Fetch live subscription state ───────────────────────────────────────────
  const subs = await stripe.subscriptions.list({
    customer: privateMeta.stripeCustomerId,
    status:   "all",
    limit:    5,
  })

  const activeSub = subs.data.find((s) =>
    ["active", "trialing"].includes(s.status)
  )

  const prevTier = publicMeta.tier ?? "free"
  const newTier  = activeSub ? "scholar" : "free"

  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      tier:        newTier,
      accessUntil: null,
    },
    privateMetadata: {
      subscriptionStatus: activeSub?.status ?? "canceled",
      lastSyncedAt:       new Date().toISOString(),
    },
  })

  console.log(JSON.stringify({
    level: "info",
    event: "admin_sync",
    userId,
    prevTier,
    newTier,
    outcome: "synced",
    stripeCustomerId: privateMeta.stripeCustomerId,
  }))

  return NextResponse.json({ synced: true, outcome: "synced", prevTier, newTier })
}
