import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { handleWebhookEvent } from "@/lib/stripe/webhooks"

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = (await headers()).get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.log(JSON.stringify({ level: "warn", event: "stripe_webhook_verify_failed", error: String(err) }))
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    await handleWebhookEvent(event)
  } catch {
    // handleWebhookEvent logs the error and re-throws so Stripe retries
    return NextResponse.json({ error: "Handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
