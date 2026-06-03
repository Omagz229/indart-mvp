#!/usr/bin/env node
// ─── Indart Sanity Access Tier Migration ──────────────────────────────────────
//
// One-time script: migrates legacy tier values in all Sanity documents.
// Run ONCE against the production dataset after deploying the schema change.
// Safe to re-run: already-migrated documents are no-ops.
//
// Usage:
//   SANITY_API_TOKEN=<token-with-write-access> npx tsx scripts/migrate-access-tiers.ts
//
// Environment variables required:
//   NEXT_PUBLIC_SANITY_PROJECT_ID — from .env or .env.local
//   NEXT_PUBLIC_SANITY_DATASET    — optional, defaults to "production"
//   SANITY_API_TOKEN              — auth token with write access to dataset

import { createClient } from "next-sanity"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
const token = process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error("ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is required")
  process.exit(1)
}

if (!token) {
  console.error("ERROR: SANITY_API_TOKEN environment variable is required")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
})

const DOCUMENT_TYPES = [
  "journey",
  "lesson",
  "conversation",
  "archiveItem",
  "journalEntry",
]

const MIGRATION_MAP: Record<string, string> = {
  member: "scholar",
  "founding-member": "founding-patron",
}

interface AccessDocument {
  _id: string
  access?: { tier?: string }
}

async function migrate(): Promise<void> {
  let totalMigrated = 0

  console.log(`\nIndart Sanity Access Tier Migration`)
  console.log(`Project: ${projectId}`)
  console.log(`Dataset: ${dataset}`)
  console.log("─".repeat(60))

  for (const docType of DOCUMENT_TYPES) {
    const docs = await client.fetch<AccessDocument[]>(
      `*[_type == $type && defined(access.tier) && access.tier in ["member", "founding-member"]]{ _id, access }`,
      { type: docType },
    )

    if (docs.length === 0) {
      console.log(`[${docType}] No legacy documents — skipping.`)
      continue
    }

    console.log(`[${docType}] Migrating ${docs.length} documents...`)

    const mutations = docs.map((doc) => {
      const oldTier = doc.access?.tier
      const newTier = MIGRATION_MAP[oldTier ?? ""]

      return {
        patch: {
          id: doc._id,
          set: {
            "access.tier": newTier,
          },
        },
      }
    })

    await client.mutate(mutations)
    totalMigrated += docs.length
    console.log(`  ✓ Migrated ${docs.length} ${docType} documents`)
  }

  console.log("─".repeat(60))
  if (totalMigrated === 0) {
    console.log("\n✓ No legacy tier values found. Dataset is clean.\n")
  } else {
    console.log(`\n✓ Migrated ${totalMigrated} documents total.\n`)
    console.log("Next steps:")
    console.log(
      "  1. Review the migrated documents in Sanity Studio to verify correctness",
    )
    console.log(
      "  2. After confirming, remove legacy branches from contentTier() in lib/sanity-helpers.ts",
    )
    console.log("")
  }
}

migrate().catch((err) => {
  console.error("\nMigration failed:", err)
  process.exit(1)
})
