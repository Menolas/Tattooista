import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}))

import { validateStudioCreation } from "@/lib/studio"

describe("validateStudioCreation", () => {
  it("returns valid for good input", () => {
    const result = validateStudioCreation({
      name: "Ink Master Studio",
      slug: "ink-master-studio",
    })
    expect(result).toEqual({ valid: true })
  })

  it("rejects empty name", () => {
    const result = validateStudioCreation({ name: "", slug: "test" })
    expect(result).toEqual({ valid: false, reason: "Studio name is required" })
  })

  it("rejects invalid slug", () => {
    const result = validateStudioCreation({
      name: "Test",
      slug: "www",
    })
    expect(result.valid).toBe(false)
  })
})
