export {}

declare global {
  // Augments Clerk's UserPublicMetadata so user.publicMetadata is typed
  // throughout the app without casts.
  interface UserPublicMetadata {
    tier?:               "free" | "scholar" | "founding-patron"
    tierId?:             string   // stripe subscription ID or "patron-{paymentIntentId}"
    tierSince?:          string   // ISO date
    accessUntil?:        string | null  // ISO date or null — see lib/auth/tier.ts
    onboardingComplete?: boolean
    disciplines?:        string[]
    traditions?:         string[]
  }

  interface UserPrivateMetadata {
    stripeCustomerId?:             string
    subscriptionId?:               string | null
    priceId?:                      string | null
    subscriptionStatus?:           string | null
    patronPaymentIntentId?:        string | null
    lastProcessedStripeEventId?:   string
    lastSyncedAt?:                 string
  }
}
