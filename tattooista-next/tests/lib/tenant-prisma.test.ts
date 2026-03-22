import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/prisma", () => ({
  prisma: { $extends: vi.fn() },
}))

import {
  TENANT_SCOPED_MODELS,
  isTenantScopedModel,
} from "@/lib/tenant-prisma"

describe("tenant-prisma", () => {
  describe("TENANT_SCOPED_MODELS", () => {
    it("includes all business models", () => {
      const expected = [
        "client", "contact", "clientGalleryItem",
        "booking", "review", "reviewGalleryItem",
        "galleryItem", "galleryItemStyle", "tattooStyle",
        "service", "page", "faqItem",
      ]
      for (const model of expected) {
        expect(TENANT_SCOPED_MODELS).toContain(model)
      }
    })

    it("does not include platform models", () => {
      const platformModels = [
        "user", "account", "session",
        "studio", "studioMembership",
      ]
      for (const model of platformModels) {
        expect(TENANT_SCOPED_MODELS).not.toContain(model)
      }
    })
  })

  describe("isTenantScopedModel", () => {
    it("returns true for tenant-scoped models", () => {
      expect(isTenantScopedModel("client")).toBe(true)
      expect(isTenantScopedModel("booking")).toBe(true)
    })

    it("returns false for platform models", () => {
      expect(isTenantScopedModel("user")).toBe(false)
      expect(isTenantScopedModel("studio")).toBe(false)
    })
  })
})
