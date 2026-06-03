// lib/stripe/webhooks.ts
import type Stripe from "stripe"
import { stripe } from "./client"
import { clerkClient } from "@clerk/nextjs/server"

// ── Type helpers ──────────────────────────────────────────────────────────────

type StripeSubStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "paused"

// ── Staleness detection ───────────────────────────────────────────────────────

/** Logs a warning if a user's lastSyncedAt is more than 7 days old. */
function warnIfStale(userId: string, lastSyncedAt: string | undefined) {
  if (!lastSyncedAt) return
  const age = Date.now() - new Date(lastSyncedAt).getTime()
  if (age > 7 * 24 * 60 * 60 * 1000) {
    console.log(JSON.stringify({
      level: "warn",
      event: "stripe_sync_stale",
      clerkUserId: userId,
      lastSyncedAt,
      staleDays: Math.floor(age / (24 * 60 * 60 * 1000)),
    }))
  }
}

// ── Resolve Clerk user from Stripe event ──────────────────────────────────────

async function resolveClerkUserId(event: Stripe.Event): Promise<string | null> {
  const obj = event.data.object as unknown as Record<string, unknown>

  // Checkout session has client_reference_id set to clerkUserId at session creation
  if (typeof obj.client_reference_id === "string") {
    return obj.client_reference_id
  }

  // Other events reference a Stripe customer
  const customerId = (obj.customer ?? obj.customer_id) as string | null
  if (!customerId) return null

  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) return null

  return (customer as Stripe.Customer).metadata?.clerkUserId ?? null
}

// ── Main dispatcher ───────────────────────────────────────────────────────────

const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "payment_intent.succeeded",
])

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const start = Date.now()

  if (!HANDLED_EVENTS.has(event.type)) return

  const clerkUserId = await resolveClerkUserId(event)
  if (!clerkUserId) {
    console.log(JSON.stringify({ level: "warn", event: "stripe_webhook", eventId: event.id, type: event.type, error: "could_not_resolve_clerk_user" }))
    return
  }

  const clerk = await clerkClient()
  const user  = await clerk.users.getUser(clerkUserId)
  const privateMeta = user.privateMetadata as UserPrivateMetadata
  const publicMeta  = user.publicMetadata  as UserPublicMetadata

  // ── Staleness check ──────────────────────────────────────────────────────────
  warnIfStale(clerkUserId, privateMeta.lastSyncedAt)

  // ── Idempotency ─────────────────────────────────────────────────────────────
  if (privateMeta.lastProcessedStripeEventId === event.id) {
    console.log(JSON.stringify({ level: "info", event: "stripe_webhook", eventId: event.id, type: event.type, outcome: "skipped_duplicate", clerkUserId }))
    return
  }

  // ── Founding patron immunity ─────────────────────────────────────────────────
  // Founding patron tier is set by a one-time payment and must never be
  // downgraded by subscription lifecycle events.
  const isFoundingPatron =
    publicMeta.tier === "founding-patron" ||
    !!privateMeta.patronPaymentIntentId  // recovery: metadata may have been corrupted

  let outcome = "processed"

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event, clerkUserId, clerk)
        break

      case "customer.subscription.updated":
        if (!isFoundingPatron) await handleSubscriptionUpdated(event, clerkUserId, clerk)
        else outcome = "skipped_founding_patron"
        break

      case "customer.subscription.deleted":
        if (!isFoundingPatron) await handleSubscriptionDeleted(event, clerkUserId, clerk)
        else outcome = "skipped_founding_patron"
        break

      case "invoice.payment_succeeded":
        if (!isFoundingPatron) await handlePaymentSucceeded(event, clerkUserId, clerk)
        else outcome = "skipped_founding_patron"
        break

      case "invoice.payment_failed":
        if (!isFoundingPatron) await handlePaymentFailed(event, clerkUserId, clerk)
        else outcome = "skipped_founding_patron"
        break

      case "payment_intent.succeeded":
        await handlePatronPayment(event, clerkUserId, clerk, publicMeta)
        break
    }

    // Mark processed — only after successful handling
    await clerk.users.updateUserMetadata(clerkUserId, {
      privateMetadata: {
        lastProcessedStripeEventId: event.id,
        lastSyncedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    outcome = "error"
    console.log(JSON.stringify({ level: "error", event: "stripe_webhook", eventId: event.id, type: event.type, clerkUserId, error: String(err) }))
    throw err  // re-throw so Stripe retries
  }

  console.log(JSON.stringify({
    level: "info",
    event: "stripe_webhook",
    eventId: event.id,
    type: event.type,
    clerkUserId,
    outcome,
    durationMs: Date.now() - start,
  }))
}

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(
  event: Stripe.Event,
  clerkUserId: string,
  clerk: Awaited<ReturnType<typeof clerkClient>>,
) {
  const session = event.data.object as Stripe.Checkout.Session
  const tier    = session.metadata?.tier as "scholar" | "founding-patron" | undefined

  if (tier === "founding-patron") {
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        tier:        "founding-patron",
        tierId:      `patron-${session.payment_intent}`,
        tierSince:   new Date().toISOString(),
        accessUntil: null,
      },
      privateMetadata: {
        patronPaymentIntentId: session.payment_intent as string,
        subscriptionId:        null,
        subscriptionStatus:    null,
        stripeCustomerId:      session.customer as string,
      },
    })
    return
  }

  if (tier === "scholar") {
    const subscriptionId = session.subscription as string
    const sub = await stripe.subscriptions.retrieve(subscriptionId)

    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        tier:        "scholar",
        tierId:      subscriptionId,
        tierSince:   new Date().toISOString(),
        accessUntil: null,
      },
      privateMetadata: {
        subscriptionId,
        priceId:           sub.items.data[0]?.price.id ?? null,
        subscriptionStatus: "active",
        stripeCustomerId:  session.customer as string,
      },
    })
  }
}

async function handleSubscriptionUpdated(
  event: Stripe.Event,
  clerkUserId: string,
  clerk: Awaited<ReturnType<typeof clerkClient>>,
) {
  const sub = event.data.object as Stripe.Subscription

  // User canceled but keeps access until period end
  if (sub.cancel_at_period_end) {
    // Fall back to now if Stripe omits current_period_end (shouldn't happen, but safe).
    const accessUntil = sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : new Date().toISOString()
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata:  { accessUntil },
      privateMetadata: { subscriptionStatus: sub.status as StripeSubStatus },
    })
    return
  }

  const isActive = (["active", "trialing"] as StripeSubStatus[]).includes(sub.status as StripeSubStatus)

  if (isActive) {
    // Plan change (monthly → annual) or trial converted — clear any expiry
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        tier:        "scholar",
        accessUntil: null,
      },
      privateMetadata: {
        priceId:           sub.items.data[0]?.price.id ?? null,
        subscriptionStatus: sub.status as StripeSubStatus,
      },
    })
  }
  // Non-active, non-canceling updates (paused, etc.) — let subscription.deleted handle final downgrade
}

async function handleSubscriptionDeleted(
  event: Stripe.Event,
  clerkUserId: string,
  clerk: Awaited<ReturnType<typeof clerkClient>>,
) {
  await clerk.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      tier:        "free",
      tierId:      "free",
      accessUntil: null,
    },
    privateMetadata: {
      subscriptionId:    null,
      subscriptionStatus: "canceled",
    },
  })
}

async function handlePaymentSucceeded(
  event: Stripe.Event,
  clerkUserId: string,
  clerk: Awaited<ReturnType<typeof clerkClient>>,
) {
  // Payment recovered after failure — clear grace period
  await clerk.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      tier:        "scholar",
      accessUntil: null,
    },
    privateMetadata: {
      subscriptionStatus: "active",
    },
  })
}

async function handlePaymentFailed(
  event: Stripe.Event,
  clerkUserId: string,
  clerk: Awaited<ReturnType<typeof clerkClient>>,
) {
  // Do not immediately revoke — 7-day grace period.
  // Stripe will retry payment. If subscription.deleted fires, that
  // will downgrade definitively. accessUntil controls the cutoff.
  const gracePeriod = new Date()
  gracePeriod.setDate(gracePeriod.getDate() + 7)

  await clerk.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      accessUntil: gracePeriod.toISOString(),
    },
    privateMetadata: {
      subscriptionStatus: "past_due",
    },
  })
}

async function handlePatronPayment(
  event: Stripe.Event,
  clerkUserId: string,
  clerk: Awaited<ReturnType<typeof clerkClient>>,
  publicMeta: UserPublicMetadata,
) {
  // One-time payment for Founding Patron tier.
  // checkout.session.completed fires first with session metadata.
  // This handler provides a secondary safety net.
  const pi = event.data.object as Stripe.PaymentIntent
  const isFounding = pi.metadata?.tier === "founding-patron"
  if (!isFounding) return

  // Use publicMeta already loaded in the outer scope — avoid a second Clerk fetch
  // that could race against the checkout.session.completed handler.
  const current = publicMeta.tier

  // Only upgrade — never overwrite a founding-patron with this event
  if (current !== "founding-patron") {
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        tier:        "founding-patron",
        tierId:      `patron-${pi.id}`,
        tierSince:   new Date().toISOString(),
        accessUntil: null,
      },
      privateMetadata: {
        patronPaymentIntentId: pi.id,
        subscriptionStatus:    null,
      },
    })
  }
}
