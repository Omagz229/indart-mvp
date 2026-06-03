import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
  }

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId)
  const stripeCustomerId = (user.privateMetadata as UserPrivateMetadata).stripeCustomerId

  if (!stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${req.nextUrl.origin}/account`,
  })

  return NextResponse.json({ portalUrl: session.url })
}
