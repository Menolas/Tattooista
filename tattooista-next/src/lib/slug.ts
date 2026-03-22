export const RESERVED_SLUGS = [
  "www",
  "app",
  "api",
  "admin",
  "static",
  "assets",
] as const

type SlugValidation =
  | { valid: true }
  | { valid: false; reason: string }

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function validateSlug(slug: string): SlugValidation {
  if (!slug) {
    return { valid: false, reason: "Slug cannot be empty" }
  }

  if (slug.length < 3) {
    return { valid: false, reason: "Slug must be at least 3 characters" }
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      valid: false,
      reason: "Slug must contain only lowercase letters, numbers, and hyphens",
    }
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { valid: false, reason: "Slug cannot start or end with a hyphen" }
  }

  if ((RESERVED_SLUGS as readonly string[]).includes(slug)) {
    return { valid: false, reason: `"${slug}" is reserved` }
  }

  return { valid: true }
}
