// app/api/checkout/route.ts
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { getOrCreateStripeCustomer } from "@/lib/stripe/customers"
import { z } from "zod"

const PRICE_MAP = {
  "scholar-monthly":  process.env.STRIPE_PRICE_SCHOLAR_MONTHLY,
  "scholar-annual":   process.env.STRIPE_PRICE_SCHOLAR_ANNUAL,
  "founding-patron":  process.env.STRIPE_PRICE_FOUNDING_PATRON,
} as const

const CheckoutBody = z.object({
  tier:    z.enum(["scholar", "founding-patron"]),
  billing: z.enum(["monthly", "annual", "lifetime"]).optional().default("monthly"),
})

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = CheckoutBody.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { tier, billing } = parsed.data

  const priceKey =
    tier === "founding-patron" ? "founding-patron" :
    billing === "annual"       ? "scholar-annual"  :
    "scholar-monthly"

  const priceId = PRICE_MAP[priceKey]
  if (!priceId) {
    return NextResponse.json({ error: `Stripe price not configured for "${priceKey}". Set ${priceKey.toUpperCase().replace(/-/g, "_")} in environment variables.` }, { status: 503 })
  }

  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const stripeCustomerId = await getOrCreateStripeCustomer(
    userId,
    user.emailAddresses[0]?.emailAddress ?? "",
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
  )

  const origin = req.nextUrl.origin

  const session = await stripe.checkout.sessions.create({
    customer:            stripeCustomerId,
    client_reference_id: userId,       // links Stripe session → Clerk user in webhook
    metadata:            { clerkUserId: userId, tier },
    mode:                tier === "founding-patron" ? "payment" : "subscription",
    line_items:          [{ price: priceId, quantity: 1 }],
    success_url:         `${origin}/membership/welcome?tier=${tier}`,
    cancel_url:          `${origin}/membership`,
    allow_promotion_codes: true,
    ...(tier === "founding-patron" && {
      payment_intent_data: { metadata: { clerkUserId: userId, tier } },
    }),
  })

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }

  return NextResponse.json({ checkoutUrl: session.url })
}
