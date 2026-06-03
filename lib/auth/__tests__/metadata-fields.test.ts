import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import path from "path"

const filesToCheck = [
  "lib/stripe/webhooks.ts",
  "lib/auth/server.ts",
  "types/clerk.d.ts",
  "lib/auth/tier.ts",
]

describe("metadata field consistency", () => {
  it.each(filesToCheck)("%s does not use legacy field names", (file) => {
    const source = readFileSync(path.join(process.cwd(), file), "utf-8")
    expect(source, `${file} contains 'tierExpiresAt'`).not.toContain("tierExpiresAt")
    expect(source, `${file} contains 'gracePeriodUntil'`).not.toContain("gracePeriodUntil")
  })
})
