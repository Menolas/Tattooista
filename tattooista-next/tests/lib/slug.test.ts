import { describe, it, expect } from "vitest"
import { generateSlug, validateSlug, RESERVED_SLUGS } from "@/lib/slug"

describe("generateSlug", () => {
  it("converts studio name to lowercase hyphenated slug", () => {
    expect(generateSlug("Ink Master Studio")).toBe("ink-master-studio")
  })

  it("strips non-alphanumeric characters except hyphens", () => {
    expect(generateSlug("Studio @ #1!")).toBe("studio-1")
  })

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("  My Studio  ")).toBe("my-studio")
  })

  it("collapses multiple hyphens", () => {
    expect(generateSlug("My---Studio")).toBe("my-studio")
  })
})

describe("validateSlug", () => {
  it("returns valid for a good slug", () => {
    const result = validateSlug("ink-master")
    expect(result).toEqual({ valid: true })
  })

  it("rejects empty slug", () => {
    const result = validateSlug("")
    expect(result).toEqual({ valid: false, reason: "Slug cannot be empty" })
  })

  it("rejects slugs with uppercase", () => {
    const result = validateSlug("InkMaster")
    expect(result).toEqual({
      valid: false,
      reason: "Slug must contain only lowercase letters, numbers, and hyphens",
    })
  })

  it("rejects slugs with special characters", () => {
    const result = validateSlug("ink_master")
    expect(result).toEqual({
      valid: false,
      reason: "Slug must contain only lowercase letters, numbers, and hyphens",
    })
  })

  it("rejects reserved slugs", () => {
    for (const reserved of RESERVED_SLUGS) {
      const result = validateSlug(reserved)
      expect(result).toEqual({
        valid: false,
        reason: `"${reserved}" is reserved`,
      })
    }
  })

  it("rejects slugs that start or end with a hyphen", () => {
    expect(validateSlug("-studio")).toEqual({
      valid: false,
      reason: "Slug cannot start or end with a hyphen",
    })
    expect(validateSlug("studio-")).toEqual({
      valid: false,
      reason: "Slug cannot start or end with a hyphen",
    })
  })

  it("rejects slugs shorter than 3 characters", () => {
    expect(validateSlug("ab")).toEqual({
      valid: false,
      reason: "Slug must be at least 3 characters",
    })
  })
})
