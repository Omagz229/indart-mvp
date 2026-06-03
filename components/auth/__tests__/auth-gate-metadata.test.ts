import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import path from "path"

describe("AuthGate metadata source", () => {
  it("does not reference unsafeMetadata for tier", () => {
    const source = readFileSync(
      path.join(process.cwd(), "components/auth/auth-gate.tsx"),
      "utf-8"
    )
    expect(source).not.toContain("unsafeMetadata")
  })

  it("reads tier from publicMetadata", () => {
    const source = readFileSync(
      path.join(process.cwd(), "components/auth/auth-gate.tsx"),
      "utf-8"
    )
    expect(source).toContain("publicMetadata")
  })
})
