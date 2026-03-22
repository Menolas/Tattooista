import { describe, it, expect, vi } from "vitest"

// Mock next/headers to prevent import errors (not used by extractSubdomain)
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}))

// Mock prisma to prevent import errors (not used by extractSubdomain)
vi.mock("@/lib/prisma", () => ({
  prisma: {
    studio: { findUnique: vi.fn() },
    studioMembership: { findUnique: vi.fn() },
  },
}))

import { extractSubdomain } from "@/lib/tenant"

describe("extractSubdomain", () => {
  it("extracts subdomain from studio.tattooista.com", () => {
    expect(extractSubdomain("ink-master.tattooista.com")).toBe("ink-master")
  })

  it("returns null for bare domain", () => {
    expect(extractSubdomain("tattooista.com")).toBeNull()
  })

  it("returns null for www", () => {
    expect(extractSubdomain("www.tattooista.com")).toBeNull()
  })

  it("returns null for app (platform admin)", () => {
    expect(extractSubdomain("app.tattooista.com")).toBeNull()
  })

  it("returns null for localhost", () => {
    expect(extractSubdomain("localhost")).toBeNull()
    expect(extractSubdomain("localhost:3000")).toBeNull()
  })

  it("handles port in hostname", () => {
    expect(extractSubdomain("ink-master.tattooista.com:3000")).toBe("ink-master")
  })
})
