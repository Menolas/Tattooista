# Multi-Tenant Layer 0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Tattooista's database schema, auth, routing, and data access layer with multi-tenancy baked in, so every feature built from here forward is automatically tenant-scoped.

**Architecture:** Shared PostgreSQL DB with `studioId` FK on every business model. Subdomain-based tenant resolution via Next.js middleware. Prisma extension auto-scopes all queries. NextAuth session carries `platformRole`, studio role resolved per-request via `StudioMembership`.

**Tech Stack:** Next.js 16, Prisma 7, NextAuth v5, PostgreSQL, Vercel Blob, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-22-multi-tenant-architecture-design.md`

---

## File Structure

### New files

| File | Responsibility |
|------|---------------|
| `prisma/migrations/*/migration.sql` | Generated migration for new schema |
| `prisma/seed.ts` | Updated seed script with Studio + membership |
| `src/lib/tenant.ts` | `getTenantContext()`, `requireStudioRole()`, tenant resolution utilities |
| `src/lib/tenant-prisma.ts` | `tenantPrisma(studioId)` — Prisma extension that auto-scopes queries |
| `src/lib/slug.ts` | Slug validation and generation utilities |
| `src/lib/studio.ts` | `createStudioWithDefaults()` — studio creation + seed data transaction |
| `tests/lib/tenant-prisma.test.ts` | Tests for tenant-scoped Prisma extension |
| `tests/lib/tenant.test.ts` | Tests for tenant context resolution |
| `tests/lib/slug.test.ts` | Tests for slug validation |
| `tests/lib/studio.test.ts` | Tests for studio creation |
| `vitest.config.ts` | Vitest configuration |

### Modified files

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Add Studio, StudioMembership, Plan/StudioRole enums, studioId FKs, drop Role/UserRole, add platformRole, update indexes/constraints |
| `src/types/index.ts` | Add Studio, StudioMembership, PlatformRole, StudioRole types; update Role references |
| `src/lib/auth.ts` | Replace roles array with `platformRole`, update session/JWT types, remove `hasRole`/`isAdmin`/`isSuperAdmin` |
| `src/lib/auth.config.ts` | Update pages config (no changes to edge compat) |
| `src/middleware.ts` | Add subdomain extraction, header stripping, tenant resolution, dev mode `?studio=` support |
| `src/lib/prisma.ts` | Export base client, add `tenantPrisma` re-export |
| `src/lib/image-utils.ts` | No changes in this layer (blob paths updated in Layer 1 when upload routes are rebuilt) |
| `package.json` | Add `vitest`, `@vitest/coverage-v8` as dev dependencies |

---

## Task 1: Set Up Test Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/lib/.gitkeep`
- Modify: `package.json` (add vitest)

- [ ] **Step 1: Install vitest**

```bash
cd tattooista-next && npm install -D vitest @vitest/coverage-v8
```

- [ ] **Step 2: Create vitest config**

Create `tattooista-next/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

- [ ] **Step 3: Add test script to package.json**

Add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify vitest runs**

Run: `cd tattooista-next && npm test`
Expected: "No test files found" (clean exit, no errors)

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json tests/
git commit -m "chore: add vitest test infrastructure"
```

---

## Task 2: Slug Validation Utilities

**Files:**
- Create: `src/lib/slug.ts`
- Create: `tests/lib/slug.test.ts`

- [ ] **Step 1: Write failing tests for slug utilities**

Create `tattooista-next/tests/lib/slug.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tattooista-next && npm test -- tests/lib/slug.test.ts`
Expected: FAIL — module `@/lib/slug` not found

- [ ] **Step 3: Implement slug utilities**

Create `tattooista-next/src/lib/slug.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd tattooista-next && npm test -- tests/lib/slug.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/slug.ts tests/lib/slug.test.ts
git commit -m "feat: add slug validation and generation utilities"
```

---

## Task 3: Update Prisma Schema for Multi-Tenancy

This is the core schema change. All business models get `studioId`. The old `Role`/`UserRole` tables are replaced.

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Replace the full schema**

Replace the entire contents of `tattooista-next/prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// ============ ENUMS ============

enum PlatformRole {
  USER
  PLATFORM_ADMIN
}

enum StudioRole {
  OWNER
  STAFF
}

enum Plan {
  FREE
  PRO
}

enum BookingStatus {
  PENDING
  CONTACTED
  COMPLETED
  CANCELLED
}

// ============ TENANT ============

model Studio {
  id                   String   @id @default(cuid())
  name                 String
  slug                 String   @unique
  logo                 String?
  customDomain         String?  @unique
  plan                 Plan     @default(FREE)
  stripeCustomerId     String?
  stripeSubscriptionId String?
  isActive             Boolean  @default(true)

  memberships StudioMembership[]
  clients     Client[]
  contacts    Contact[]
  clientGalleryItems ClientGalleryItem[]
  bookings    Booking[]
  reviews     Review[]
  reviewGalleryItems ReviewGalleryItem[]
  galleryItems GalleryItem[]
  galleryItemStyles GalleryItemStyle[]
  tattooStyles TattooStyle[]
  services    Service[]
  pages       Page[]
  faqItems    FaqItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model StudioMembership {
  id       String     @id @default(cuid())
  userId   String
  studioId String
  role     StudioRole

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)

  @@unique([userId, studioId])
  @@index([studioId])
}

// ============ AUTH ============

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  emailVerified DateTime?
  password      String
  displayName   String
  avatar        String?
  isActivated   Boolean      @default(false)
  platformRole  PlatformRole @default(USER)

  memberships StudioMembership[]
  reviews     Review[]
  accounts    Account[]
  sessions    Session[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())

  @@unique([email, token])
}

// ============ BUSINESS ============

model Client {
  id          String  @id @default(cuid())
  studioId    String
  fullName    String
  avatar      String?
  isFavourite Boolean @default(false)
  isArchived  Boolean @default(false)

  studio   Studio              @relation(fields: [studioId], references: [id], onDelete: Cascade)
  contacts Contact[]
  gallery  ClientGalleryItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studioId])
  @@index([studioId, createdAt])
  @@index([studioId, isArchived])
}

model Contact {
  id       String @id @default(cuid())
  studioId String
  type     String
  value    String
  clientId String

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)
  client Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([studioId])
}

model ClientGalleryItem {
  id       String @id @default(cuid())
  studioId String
  fileName String
  clientId String

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)
  client Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([studioId])
}

model Booking {
  id         String        @id @default(cuid())
  studioId   String
  fullName   String
  email      String?
  phone      String?
  instagram  String?
  message    String?       @db.Text
  status     BookingStatus @default(PENDING)
  isArchived Boolean       @default(false)

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studioId])
  @@index([studioId, createdAt])
  @@index([studioId, isArchived])
}

model Review {
  id         String  @id @default(cuid())
  studioId   String
  rate       Int
  content    String  @db.Text
  isArchived Boolean @default(false)

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)

  gallery ReviewGalleryItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studioId])
  @@index([studioId, createdAt])
  @@index([studioId, isArchived])
}

model ReviewGalleryItem {
  id       String @id @default(cuid())
  studioId String
  fileName String
  reviewId String

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)
  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@index([studioId])
}

// ============ PORTFOLIO ============

model TattooStyle {
  id          String  @id @default(cuid())
  studioId    String
  value       String
  description String? @db.Text
  wallPaper   String?
  nonStyle    Boolean @default(false)
  isArchived  Boolean @default(false)

  studio       Studio             @relation(fields: [studioId], references: [id], onDelete: Cascade)
  galleryItems GalleryItemStyle[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([studioId, value])
  @@index([studioId])
  @@index([studioId, isArchived])
}

model GalleryItem {
  id         String  @id @default(cuid())
  studioId   String
  fileName   String
  isArchived Boolean @default(false)

  studio Studio             @relation(fields: [studioId], references: [id], onDelete: Cascade)
  styles GalleryItemStyle[]

  createdAt DateTime @default(now())

  @@index([studioId])
  @@index([studioId, createdAt])
  @@index([studioId, isArchived])
}

model GalleryItemStyle {
  id            String @id @default(cuid())
  studioId      String
  galleryItemId String
  tattooStyleId String

  studio      Studio      @relation(fields: [studioId], references: [id], onDelete: Cascade)
  galleryItem GalleryItem @relation(fields: [galleryItemId], references: [id], onDelete: Cascade)
  tattooStyle TattooStyle @relation(fields: [tattooStyleId], references: [id], onDelete: Cascade)

  @@unique([galleryItemId, tattooStyleId])
  @@index([studioId])
}

// ============ CMS ============

model Service {
  id         String  @id @default(cuid())
  studioId   String
  title      String
  wallPaper  String?
  conditions String? @db.Text
  order      Int     @default(0)

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studioId])
}

model Page {
  id        String  @id @default(cuid())
  studioId  String
  name      String
  isActive  Boolean @default(true)
  title     String?
  wallPaper String?
  content   String? @db.Text

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([studioId, name])
  @@index([studioId])
}

model FaqItem {
  id       String @id @default(cuid())
  studioId String
  question String
  answer   String @db.Text
  order    Int    @default(0)

  studio Studio @relation(fields: [studioId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studioId])
}
```

- [ ] **Step 2: Validate the schema**

Run: `cd tattooista-next && npx prisma validate`
Expected: "The schema at `prisma/schema.prisma` is valid"

- [ ] **Step 3: Reset the dev database and apply**

Since this is a breaking schema change (not a migration), reset the dev DB:

Run: `cd tattooista-next && npx prisma db push --force-reset`
Expected: "Your database is now in sync with your Prisma schema"

Note: `--force-reset` drops all data. This is fine — we're rebuilding from scratch.

- [ ] **Step 4: Generate Prisma client**

Run: `cd tattooista-next && npx prisma generate`
Expected: "Generated Prisma Client"

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: multi-tenant schema with Studio, studioId FKs, and indexes"
```

---

## Task 4: Update TypeScript Types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Update types to match new schema**

Changes to `tattooista-next/src/types/index.ts`:

1. Replace `Role` type:
```typescript
export type PlatformRole = "USER" | "PLATFORM_ADMIN"
export type StudioRole = "OWNER" | "STAFF"
export type Plan = "FREE" | "PRO"
```

2. Add `Studio` type:
```typescript
export interface Studio {
  id: string
  name: string
  slug: string
  logo: string | null
  customDomain: string | null
  plan: Plan
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

3. Add `StudioMembership` type:
```typescript
export interface StudioMembership {
  id: string
  userId: string
  studioId: string
  role: StudioRole
}
```

4. Update `User` type — replace `roles: Role[]` with `platformRole: PlatformRole`, remove `isActivated` (keep for now — used in email verification)

5. Update `SessionUser` — replace `roles: Role[]` with `platformRole: PlatformRole`

6. Add `studioId: string` to every tenant-scoped interface: Client, Contact, ClientGalleryItem, Booking, Review, ReviewGalleryItem, TattooStyle, GalleryItem, Service, Page, FaqItem

7. Remove `Role` export, add `PlatformRole`, `StudioRole`, `Plan`, `Studio`, `StudioMembership` exports

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd tattooista-next && npx tsc --noEmit 2>&1 | head -30`
Expected: Type errors in files that still reference old `Role` type — that's expected, we'll fix those in the next tasks.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: update TypeScript types for multi-tenant schema"
```

---

## Task 5: Update Auth (NextAuth) for Multi-Tenancy

**Files:**
- Modify: `src/lib/auth.ts`

- [ ] **Step 1: Update NextAuth session and JWT types**

In `tattooista-next/src/lib/auth.ts`:

1. Replace `Role` import with `PlatformRole` from `@/types`
2. Update `Session.user` type: replace `roles: Role[]` with `platformRole: PlatformRole`
3. Update `User` type: replace `roles: Role[]` with `platformRole: PlatformRole`
4. Update `JWT` type: replace `roles: Role[]` with `platformRole: PlatformRole`

- [ ] **Step 2: Update the `authorize` function**

Replace the Credentials authorize function:
- Remove `include: { roles: { include: { role: true } } }` — no more `UserRole`/`Role` tables
- Return `platformRole: user.platformRole` instead of `roles`

```typescript
authorize: async (credentials) => {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required")
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email as string },
  })

  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password as string,
    user.password
  )

  if (!isPasswordValid) {
    throw new Error("Invalid email or password")
  }

  if (!user.isActivated) {
    throw new Error("Please verify your email before logging in")
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    platformRole: user.platformRole,
    isActivated: user.isActivated,
  }
},
```

- [ ] **Step 3: Update JWT and session callbacks**

Replace `token.roles` with `token.platformRole` in both callbacks.

- [ ] **Step 4: Replace helper functions**

Remove `hasRole`, `isAdmin`, `isSuperAdmin`. Replace with:

```typescript
export function isPlatformAdmin(platformRole: PlatformRole): boolean {
  return platformRole === "PLATFORM_ADMIN"
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: update NextAuth for platformRole, remove old role system"
```

---

## Task 6: Tenant-Scoped Prisma Extension

**Files:**
- Create: `src/lib/tenant-prisma.ts`
- Create: `tests/lib/tenant-prisma.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tattooista-next/tests/lib/tenant-prisma.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tattooista-next && npm test -- tests/lib/tenant-prisma.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement tenant-scoped Prisma extension**

Create `tattooista-next/src/lib/tenant-prisma.ts`:

```typescript
import { Prisma, PrismaClient } from "@prisma/client"
import { prisma } from "./prisma"

export const TENANT_SCOPED_MODELS = [
  "client", "contact", "clientGalleryItem",
  "booking", "review", "reviewGalleryItem",
  "galleryItem", "galleryItemStyle", "tattooStyle",
  "service", "page", "faqItem",
] as const

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number]

export function isTenantScopedModel(model: string): model is TenantScopedModel {
  return (TENANT_SCOPED_MODELS as readonly string[]).includes(model)
}

/**
 * Returns a Prisma client that automatically scopes all queries
 * to the given studioId for tenant-scoped models.
 *
 * - findMany, findFirst: adds WHERE studioId = ?
 * - findUnique: overridden to use findFirst with studioId condition
 * - create: auto-sets studioId in data
 * - update, delete: adds studioId to WHERE clause
 * - createMany: auto-sets studioId on each record
 */
export function tenantPrisma(studioId: string) {
  if (!studioId) {
    throw new Error("tenantPrisma requires a studioId")
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
        async findFirst({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
        async findUnique({ model, args, query }) {
          const modelName = model.charAt(0).toLowerCase() + model.slice(1)
          if (isTenantScopedModel(modelName)) {
            // findUnique only accepts unique fields in its where clause,
            // so we can't add studioId directly. Instead, we verify the
            // result belongs to this tenant after the query returns.
            const result = await query(args)
            if (result && (result as any).studioId !== studioId) {
              return null // Record exists but belongs to another tenant
            }
            return result
          }
          return query(args)
        },
        async create({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.data = { ...args.data, studioId }
          }
          return query(args)
        },
        async createMany({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            if (Array.isArray(args.data)) {
              args.data = args.data.map((d: any) => ({ ...d, studioId }))
            } else {
              args.data = { ...args.data, studioId }
            }
          }
          return query(args)
        },
        async update({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.where = { ...args.where, studioId } as any
          }
          return query(args)
        },
        async updateMany({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
        async delete({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.where = { ...args.where, studioId } as any
          }
          return query(args)
        },
        async deleteMany({ model, args, query }) {
          if (isTenantScopedModel(model.charAt(0).toLowerCase() + model.slice(1))) {
            args.where = { ...args.where, studioId }
          }
          return query(args)
        },
      },
    },
  })
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd tattooista-next && npm test -- tests/lib/tenant-prisma.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tenant-prisma.ts tests/lib/tenant-prisma.test.ts
git commit -m "feat: tenant-scoped Prisma extension with auto studioId injection"
```

---

## Task 7: Tenant Context Resolution

**Files:**
- Create: `src/lib/tenant.ts`
- Create: `tests/lib/tenant.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tattooista-next/tests/lib/tenant.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tattooista-next && npm test -- tests/lib/tenant.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement tenant context utilities**

Create `tattooista-next/src/lib/tenant.ts`:

```typescript
import { headers } from "next/headers"
import { prisma } from "./prisma"
import type { Studio, StudioRole } from "@/types"

const SPECIAL_SUBDOMAINS = ["www", "app"]

/**
 * Extract the studio slug from a hostname.
 * Returns null for the bare domain, www, app, or localhost.
 */
export function extractSubdomain(hostname: string): string | null {
  // Strip port
  const host = hostname.split(":")[0]

  // localhost = no subdomain
  if (host === "localhost" || host === "127.0.0.1") {
    return null
  }

  const parts = host.split(".")

  // bare domain (tattooista.com) or IP
  if (parts.length <= 2) {
    return null
  }

  const subdomain = parts[0]

  // Special subdomains aren't studios
  if (SPECIAL_SUBDOMAINS.includes(subdomain)) {
    return null
  }

  return subdomain
}

export const STUDIO_ID_HEADER = "x-studio-id"

/**
 * Read the current tenant context from the request headers.
 * Must be called from a Server Component or Server Action.
 * Returns null if no tenant context (landing page, platform admin).
 */
export async function getTenantContext(): Promise<Studio | null> {
  const headersList = await headers()
  const studioId = headersList.get(STUDIO_ID_HEADER)

  if (!studioId) return null

  const studio = await prisma.studio.findUnique({
    where: { id: studioId },
  })

  return studio as Studio | null
}

/**
 * Like getTenantContext but throws if no tenant.
 * Use in routes that require a studio context.
 */
export async function requireTenantContext(): Promise<Studio> {
  const studio = await getTenantContext()
  if (!studio) {
    throw new Error("This page requires a studio context")
  }
  return studio
}

/**
 * Check if the current user has the required role for the current studio.
 * Throws if unauthorized.
 */
export async function requireStudioRole(
  userId: string,
  studioId: string,
  requiredRole?: StudioRole
): Promise<StudioRole> {
  const membership = await prisma.studioMembership.findUnique({
    where: {
      userId_studioId: { userId, studioId },
    },
  })

  if (!membership) {
    throw new Error("You are not a member of this studio")
  }

  if (requiredRole && requiredRole === "OWNER" && membership.role !== "OWNER") {
    throw new Error("Only studio owners can perform this action")
  }

  return membership.role as StudioRole
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd tattooista-next && npm test -- tests/lib/tenant.test.ts`
Expected: All tests PASS (only `extractSubdomain` is tested — the async functions that depend on Next.js headers and Prisma are tested via integration in later layers)

- [ ] **Step 5: Commit**

```bash
git add src/lib/tenant.ts tests/lib/tenant.test.ts
git commit -m "feat: tenant context resolution with subdomain extraction"
```

---

## Task 8: Studio Creation Utility

**Files:**
- Create: `src/lib/studio.ts`
- Create: `tests/lib/studio.test.ts`

- [ ] **Step 1: Write failing tests for validation logic**

Create `tattooista-next/tests/lib/studio.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tattooista-next && npm test -- tests/lib/studio.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement studio creation**

Create `tattooista-next/src/lib/studio.ts`:

```typescript
import { prisma } from "./prisma"
import { validateSlug } from "./slug"

interface StudioCreationInput {
  name: string
  slug: string
  logo?: string
}

type StudioValidation =
  | { valid: true }
  | { valid: false; reason: string }

export function validateStudioCreation(
  input: Pick<StudioCreationInput, "name" | "slug">
): StudioValidation {
  if (!input.name || !input.name.trim()) {
    return { valid: false, reason: "Studio name is required" }
  }

  const slugValidation = validateSlug(input.slug)
  if (!slugValidation.valid) {
    return slugValidation
  }

  return { valid: true }
}

/**
 * Create a studio with default seed data (pages, default style)
 * and link the owner in a single transaction.
 */
export async function createStudioWithDefaults(
  ownerId: string,
  input: StudioCreationInput
) {
  return prisma.$transaction(async (tx) => {
    // Check slug uniqueness
    const existing = await tx.studio.findUnique({
      where: { slug: input.slug },
    })
    if (existing) {
      throw new Error(`Slug "${input.slug}" is already taken`)
    }

    // Create studio
    const studio = await tx.studio.create({
      data: {
        name: input.name.trim(),
        slug: input.slug,
        logo: input.logo ?? null,
      },
    })

    // Create owner membership
    await tx.studioMembership.create({
      data: {
        userId: ownerId,
        studioId: studio.id,
        role: "OWNER",
      },
    })

    // Seed default pages
    await tx.page.createMany({
      data: [
        { studioId: studio.id, name: "about", isActive: true },
        { studioId: studio.id, name: "contacts", isActive: true },
      ],
    })

    // Seed default "Other" style
    await tx.tattooStyle.create({
      data: {
        studioId: studio.id,
        value: "Other",
        nonStyle: true,
      },
    })

    return studio
  })
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd tattooista-next && npm test -- tests/lib/studio.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/studio.ts tests/lib/studio.test.ts
git commit -m "feat: studio creation with default seed data"
```

---

## Task 9: Update Middleware for Tenant Resolution

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Rewrite middleware with tenant resolution**

Replace `tattooista-next/src/middleware.ts` with:

```typescript
import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { NextResponse } from "next/server"
import { extractSubdomain, STUDIO_ID_HEADER } from "@/lib/tenant"
import { prisma } from "@/lib/prisma"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  // ---- SECURITY: Strip any client-sent x-studio-id header ----
  const requestHeaders = new Headers(req.headers)
  requestHeaders.delete(STUDIO_ID_HEADER)

  // ---- TENANT RESOLUTION ----
  const hostname = req.headers.get("host") || "localhost:3000"

  // Dev mode: support ?studio=slug query param
  let slug: string | null = null
  if (process.env.NODE_ENV === "development") {
    slug = nextUrl.searchParams.get("studio") || extractSubdomain(hostname)
  } else {
    slug = extractSubdomain(hostname)
  }

  // If we have a slug, resolve the studio
  if (slug) {
    const studio = await prisma.studio.findUnique({
      where: { slug },
      select: { id: true, isActive: true },
    })

    if (!studio) {
      return NextResponse.rewrite(new URL("/not-found", nextUrl))
    }

    if (!studio.isActive) {
      return NextResponse.rewrite(new URL("/studio-suspended", nextUrl))
    }

    // Inject studioId for downstream use
    requestHeaders.set(STUDIO_ID_HEADER, studio.id)
  }

  // ---- ROUTE PROTECTION ----
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register")
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/portfolio") ||
    nextUrl.pathname.startsWith("/reviews") ||
    nextUrl.pathname.startsWith("/contacts") ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/verify-email") ||
    nextUrl.pathname.startsWith("/reset-password")

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // Protect admin routes — require login + studio membership
  // (full role check happens in the admin layout, middleware just checks login)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
  }

  // Require login for non-public routes
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
})

// Force Node.js runtime — required because Prisma uses the pg driver
// (TCP sockets), which is incompatible with the default Edge Runtime.
export const runtime = "nodejs"

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
```

- [ ] **Step 2: Verify the app still starts**

Run: `cd tattooista-next && npm run build 2>&1 | tail -20`
Expected: Build may have type errors from other files still referencing old `Role` type — that's OK. The middleware itself should not cause build errors.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: middleware with subdomain tenant resolution and header injection"
```

---

## Task 10: Update Seed Script

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Check current seed script**

Read `tattooista-next/prisma/seed.ts` to understand what it currently seeds.

- [ ] **Step 2: Rewrite seed script**

Replace the entire contents of `tattooista-next/prisma/seed.ts` with:

```typescript
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Create platform admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@tattooista.com" },
    update: {},
    create: {
      email: "admin@tattooista.com",
      password: hashedPassword,
      displayName: "Admin",
      isActivated: true,
      emailVerified: new Date(),
      platformRole: "PLATFORM_ADMIN",
    },
  })

  console.log("Created admin user:", adminUser.email)

  // Create demo studio
  const demoStudio = await prisma.studio.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Tattoo Studio",
      slug: "demo",
    },
  })

  console.log("Created demo studio:", demoStudio.slug)

  // Link admin as studio owner
  await prisma.studioMembership.upsert({
    where: {
      userId_studioId: {
        userId: adminUser.id,
        studioId: demoStudio.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      studioId: demoStudio.id,
      role: "OWNER",
    },
  })

  console.log("Linked admin as studio owner")

  // Seed default pages (using compound unique)
  await prisma.page.upsert({
    where: {
      studioId_name: {
        studioId: demoStudio.id,
        name: "about",
      },
    },
    update: {},
    create: {
      studioId: demoStudio.id,
      name: "about",
      title: "About Us",
      content:
        "Welcome to our studio! We are dedicated to creating unique, personalized artwork.",
      isActive: true,
    },
  })

  await prisma.page.upsert({
    where: {
      studioId_name: {
        studioId: demoStudio.id,
        name: "contacts",
      },
    },
    update: {},
    create: {
      studioId: demoStudio.id,
      name: "contacts",
      title: "Get in Touch",
      content: "We'd love to hear from you!",
      isActive: true,
    },
  })

  console.log("Created default pages")

  // Seed tattoo styles (using compound unique)
  const styles = [
    {
      value: "Traditional",
      description: "Bold lines, limited color palette, and iconic imagery.",
    },
    {
      value: "Blackwork",
      description: "Using exclusively black ink for bold, graphic designs.",
    },
    {
      value: "Realism",
      description: "Highly detailed tattoos that look like photographs.",
    },
    {
      value: "Other",
      description: null,
      nonStyle: true,
    },
  ]

  for (const style of styles) {
    await prisma.tattooStyle.upsert({
      where: {
        studioId_value: {
          studioId: demoStudio.id,
          value: style.value,
        },
      },
      update: {},
      create: {
        studioId: demoStudio.id,
        value: style.value,
        description: style.description,
        nonStyle: style.nonStyle ?? false,
      },
    })
  }

  console.log("Created tattoo styles:", styles.map((s) => s.value))

  // Seed services
  const services = [
    {
      title: "Custom Tattoos",
      conditions: "Unique designs created specifically for you.",
      order: 0,
    },
    {
      title: "Cover-ups",
      conditions: "Transform existing tattoos into new pieces.",
      order: 1,
    },
    {
      title: "Consultations",
      conditions: "Free consultations to discuss your ideas.",
      order: 2,
    },
  ]

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { studioId: demoStudio.id, title: service.title },
    })
    if (!existing) {
      await prisma.service.create({
        data: { ...service, studioId: demoStudio.id },
      })
    }
  }

  console.log("Created services:", services.map((s) => s.title))

  // Seed FAQ items
  const faqItems = [
    {
      question: "How much does a tattoo cost?",
      answer: "Pricing depends on size, complexity, and time. Our minimum is $100.",
      order: 0,
    },
    {
      question: "How do I book an appointment?",
      answer: "Use our booking form or contact us directly.",
      order: 1,
    },
  ]

  for (const faq of faqItems) {
    const existing = await prisma.faqItem.findFirst({
      where: { studioId: demoStudio.id, question: faq.question },
    })
    if (!existing) {
      await prisma.faqItem.create({
        data: { ...faq, studioId: demoStudio.id },
      })
    }
  }

  console.log("Created FAQ items:", faqItems.length)

  console.log("Database seeded successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

- [ ] **Step 3: Run the seed**

Run: `cd tattooista-next && npm run db:seed`
Expected: Seed completes without errors

- [ ] **Step 4: Verify with Prisma Studio**

Run: `cd tattooista-next && npx prisma studio`
Check: Studio table has 1 record, StudioMembership has 1 record, User has platformRole field

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: update seed script for multi-tenant schema"
```

---

## Task 11: Fix Remaining Type Errors

At this point, many existing files reference the old `Role` type, `roles` array, `isAdmin()`, and `isSuperAdmin()`. This task fixes every affected file to compile with the new multi-tenant auth model.

**Strategy:** All server actions that previously used `isAdmin(session.user.roles)` or `isSuperAdmin(session.user.roles)` need to be changed to use `requireStudioRole()` from `@/lib/tenant` and `requireTenantContext()`. The pattern becomes:

```typescript
const session = await auth()
if (!session?.user) throw new Error("Unauthorized")
const studio = await requireTenantContext()
await requireStudioRole(session.user.id, studio.id)
```

**Files to modify (complete list):**
- `src/lib/actions/auth.ts` — remove old Role seeding in register
- `src/lib/actions/users.ts` — replace isSuperAdmin with isPlatformAdmin, remove Role/UserRole queries
- `src/lib/actions/services.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/bookings.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/clients.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/gallery.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/styles.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/pages.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/faq.ts` — replace isAdmin with requireStudioRole
- `src/lib/actions/reviews.ts` — replace isSuperAdmin with requireStudioRole
- `src/lib/validations/user.ts` — remove old role enum validation
- `src/app/admin/users/page.tsx` — replace isSuperAdmin with isPlatformAdmin
- `src/app/admin/users/users-manager.tsx` — remove Role type, update interface
- `src/app/admin/users/user-form.tsx` — remove Role checkboxes (roles no longer assigned here)
- `src/app/api/upload/route.ts` — replace isAdmin with requireStudioRole
- `src/components/shared/header.tsx` — replace roles-based admin check
- `src/components/admin/sidebar.tsx` — replace roles-based superadmin check
- `src/components/admin/mobile-nav.tsx` — replace roles-based superadmin check

- [ ] **Step 1: Fix `src/lib/actions/auth.ts`**

In the `register` function, replace the Role lookup and assignment block:

```typescript
// OLD: Get or create USER role + roles: { create: { roleId: ... } }
// NEW: Just create the user, no role assignment needed
await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    displayName,
    isActivated: false,
    // platformRole defaults to USER via schema
  },
})
```

Remove the `prisma.role.findUnique` / `prisma.role.create` block for the USER role.

- [ ] **Step 2: Fix `src/lib/actions/users.ts`**

Replace the entire auth pattern. Key changes:

1. Replace `import { auth, isSuperAdmin } from "@/lib/auth"` with `import { auth, isPlatformAdmin } from "@/lib/auth"`
2. Remove `import type { Role } from "@/types"`
3. Replace all `!isSuperAdmin(session.user.roles)` with `!isPlatformAdmin(session.user.platformRole)`
4. In `getUsers()`: remove `include: { roles: { include: { role: true } } }` and the `.map` that extracts roles. The response should include `platformRole` directly:
   ```typescript
   return users.map((user) => ({
     id: user.id,
     email: user.email,
     displayName: user.displayName,
     avatar: user.avatar,
     isActivated: user.isActivated,
     platformRole: user.platformRole,
     createdAt: user.createdAt,
     updatedAt: user.updatedAt,
   }))
   ```
5. In `createUser()`: remove the Role/UserRole creation logic. The user just gets `platformRole: "USER"` (default) or whatever the admin specifies.
6. In `updateUser()`: remove the `prisma.userRole.deleteMany` / `prisma.userRole.createMany` block. If updating platformRole, set it directly: `updateData.platformRole = data.platformRole`.
7. Remove the `getRoles()` function entirely.

- [ ] **Step 3: Fix all admin server actions**

For each of these files, apply the same pattern:
- `src/lib/actions/services.ts`
- `src/lib/actions/bookings.ts`
- `src/lib/actions/clients.ts`
- `src/lib/actions/gallery.ts`
- `src/lib/actions/styles.ts`
- `src/lib/actions/pages.ts`
- `src/lib/actions/faq.ts`
- `src/lib/actions/reviews.ts`

Replace:
```typescript
import { auth, isAdmin } from "@/lib/auth"
// ...
const session = await auth()
if (!session?.user || !isAdmin(session.user.roles)) {
  throw new Error("Unauthorized")
}
```

With:
```typescript
import { auth } from "@/lib/auth"
import { requireTenantContext, requireStudioRole } from "@/lib/tenant"
// ...
const session = await auth()
if (!session?.user) throw new Error("Unauthorized")
const studio = await requireTenantContext()
await requireStudioRole(session.user.id, studio.id)
```

For `reviews.ts` that used `isSuperAdmin`, use the same `requireStudioRole` pattern (studio owners manage reviews).

- [ ] **Step 4: Fix `src/lib/validations/user.ts`**

Replace role enum validation:
```typescript
// OLD
roles: z.array(z.enum(["USER", "ADMIN", "SUPERADMIN"])).min(1, ...)
// NEW — remove roles field entirely from both schemas
// Platform admin can set platformRole directly if needed:
// platformRole: z.enum(["USER", "PLATFORM_ADMIN"]).optional()
```

- [ ] **Step 5: Fix `src/app/admin/users/page.tsx`**

```typescript
import { auth, isPlatformAdmin } from "@/lib/auth"
// Remove: import type { Role } from "@/types"

// Replace getUsers query — remove include: { roles: ... }
async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatar: user.avatar,
    isActivated: user.isActivated,
    platformRole: user.platformRole,
    createdAt: user.createdAt,
  }))
}

// Replace auth check
if (!session?.user || !isPlatformAdmin(session.user.platformRole)) {
  redirect("/admin")
}
```

- [ ] **Step 6: Fix `src/app/admin/users/users-manager.tsx`**

Replace `Role` with `PlatformRole`:
```typescript
import type { PlatformRole } from "@/types"

interface User {
  id: string
  email: string
  displayName: string
  avatar: string | null
  isActivated: boolean
  platformRole: PlatformRole
  createdAt: Date
}

// Replace roleColors:
const roleColors: Record<PlatformRole, string> = {
  USER: "bg-gray-100 text-gray-800",
  PLATFORM_ADMIN: "bg-purple-100 text-purple-800",
}

// Replace roles badge rendering:
// OLD: {user.roles.map((role) => <Badge>...)}
// NEW: <Badge className={roleColors[user.platformRole]}>{user.platformRole}</Badge>
```

- [ ] **Step 7: Fix `src/app/admin/users/user-form.tsx`**

Remove the Role checkboxes section entirely. Replace with a single platformRole select (only shown to platform admins when editing). Remove `import type { Role } from "@/types"`.

- [ ] **Step 8: Fix `src/app/api/upload/route.ts`**

Replace `import { auth, isAdmin } from "@/lib/auth"` with `import { auth } from "@/lib/auth"` and `import { requireTenantContext, requireStudioRole } from "@/lib/tenant"`. Replace `isAdmin(session.user.roles)` check with `requireStudioRole`.

- [ ] **Step 9: Fix `src/components/shared/header.tsx`**

Replace the admin check. The current code checks `roles.includes("ADMIN")`. Replace with checking if the user has any studio membership via a server-fetched prop, or simplify to just checking if the user is logged in (the admin route itself will handle authorization):

```typescript
// OLD: const isAdmin = session?.user?.roles?.includes("ADMIN") || ...
// NEW: Check if user has any studio membership
// Simplest approach: just show the admin link to all logged-in users;
// the admin layout handles authorization
const showAdminLink = !!session?.user
```

- [ ] **Step 10: Fix `src/components/admin/sidebar.tsx` and `src/components/admin/mobile-nav.tsx`**

Replace `session?.user?.roles?.includes("SUPERADMIN")` with `session?.user?.platformRole === "PLATFORM_ADMIN"` to gate the "Users" nav item (only platform admins manage users across studios).

- [ ] **Step 11: Verify the project compiles**

Run: `cd tattooista-next && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 12: Verify the project builds**

Run: `cd tattooista-next && npm run build`
Expected: Build succeeds

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "fix: update all files to use new multi-tenant role system"
```

---

## Task 12: Verify End-to-End

Final verification that everything works together.

- [ ] **Step 1: Start Docker and reset DB**

```bash
docker start tattooista-postgres
cd tattooista-next && npx prisma db push --force-reset
```

- [ ] **Step 2: Seed the database**

```bash
cd tattooista-next && npm run db:seed
```

- [ ] **Step 3: Run all tests**

```bash
cd tattooista-next && npm test
```
Expected: All tests pass

- [ ] **Step 4: Start dev server and verify**

```bash
cd tattooista-next && npm run dev
```

Visit:
- `http://localhost:3000` — should show the public site (no tenant context)
- `http://localhost:3000?studio=demo` — should show the demo studio's public site
- `http://localhost:3000/admin?studio=demo` — should redirect to login

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: layer 0 multi-tenant foundation complete"
```
