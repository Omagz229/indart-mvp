import { stripe } from "./client"
import { clerkClient } from "@clerk/nextjs/server"

/**
 * Returns an existing Stripe customer ID for this Clerk user,
 * or creates a new one. Uses Stripe idempotency keys to prevent
 * duplicate customers from concurrent checkout requests.
 */
export async function getOrCreateStripeCustomer(
  clerkUserId: string,
  email: string,
  name: string,
): Promise<string> {
  const clerk = await clerkClient()
  const user = await clerk.users.getUser(clerkUserId)
  const existing = (user.privateMetadata as UserPrivateMetadata)
    .stripeCustomerId

  if (existing) return existing

  // Idempotency key: same user always creates the same customer
  // even if two checkout requests fire concurrently.
  const customer = await stripe.customers.create(
    {
      email,
      name,
      metadata: { clerkUserId },
    },
    { idempotencyKey: `clerk-customer-${clerkUserId}` },
  )

  await clerk.users.updateUserMetadata(clerkUserId, {
    privateMetadata: { stripeCustomerId: customer.id },
  })

  return customer.id
}
