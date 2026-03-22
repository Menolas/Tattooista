# Tattooista — SaaS Transformation Plan

## Context

Tattooista started as a single-tenant tattoo studio management app (MERN stack). The migration to Next.js is ~10% complete — basic pages exist but many modals, forms, and admin features are broken or missing content compared to the original MERN app.

## Current State (2026-03-22)

### Branch: `multi-tenant-layer-0`

Layer 0 architecture code is written but NOT fully usable yet.

**What's done (code exists):**
- [x] Prisma schema rewritten with Studio, StudioMembership, studioId on all models
- [x] Enums: PlatformRole (USER/PLATFORM_ADMIN), StudioRole (OWNER/STAFF), Plan (FREE/PRO)
- [x] Middleware: subdomain extraction, x-studio-id header injection, dev mode ?studio= param
- [x] tenantPrisma(studioId) — auto-scopes all queries by studioId
- [x] getTenantContext() / requireStudioRole() — tenant context utilities
- [x] createStudioWithDefaults() — studio creation with seed data
- [x] Slug validation utilities
- [x] Auth updated: platformRole replaces old Role/UserRole tables
- [x] All server actions updated to use tenant-scoped auth
- [x] Seed script with original MERN app content (7 FAQ items, 4 services, etc.)
- [x] Tests: 25 passing across 5 test files
- [x] Build succeeds

**What's NOT done (no UI exists):**
- [ ] Studio registration page — no way to create a studio through the UI
- [ ] Studio onboarding flow — createStudioWithDefaults() exists but nothing calls it
- [ ] Landing page — just a placeholder "Create Your Studio" link
- [ ] Studio picker — no UI for users with multiple studios
- [ ] Staff invite flow — no UI
- [ ] Images not re-uploaded — DB was reset, wallpaper/gallery images need re-uploading via admin panel (files still exist in Server/uploads/ and tattooista-next/public/)

**What's BROKEN compared to original MERN app (existed before this session, still broken):**
- [ ] Many admin modals not working
- [ ] Forms missing content/functionality
- [ ] Header/footer incomplete (icons, links missing — some were fixed in prior sessions)
- [ ] Portfolio section on home page — conditional on style wallPaper images existing in DB
- [ ] About section image — needs wallPaper reference in DB

### Branch: `main`

The deployed Vercel site. Has the basic pages but with the same broken modals/forms issues.

### Local dev setup

- `.env` has local Docker Postgres: `postgresql://postgres:postgres@localhost:5432/tattooista`
- `.env.local.bak` has Neon remote DB (renamed to avoid overriding local DB)
- To run locally: `docker start tattooista-postgres && cd tattooista-next && npm run dev`
- Demo studio: visit `http://localhost:3000?studio=demo`
- Login: `admin@tattooista.com` / `admin123`

## Architecture Decisions (Layer 0)

- **Multi-tenant model**: subdomain per studio (studio.tattooista.com)
- **Database**: shared DB with studioId FK on every business model
- **Auth**: PlatformRole (USER/PLATFORM_ADMIN) + StudioMembership (OWNER/STAFF)
- **Storage**: Vercel Blob with path prefix per tenant (studios/{studioId}/...)
- **Billing**: flat tiers (FREE/PRO), Stripe (not implemented yet)
- **Onboarding**: self-service sign-up with email verification

Full spec: `docs/superpowers/specs/2026-03-22-multi-tenant-architecture-design.md`
Full implementation plan: `docs/superpowers/plans/2026-03-22-multi-tenant-layer-0.md`

## What to Do Next Session

Priority: **Fix the actual app so it works.** No more infrastructure.

1. Merge `multi-tenant-layer-0` to `main`
2. Go through original MERN app (Client/ directory) screen by screen
3. Fix broken modals, forms, missing content — everything that doesn't match the original
4. Re-upload images through admin panel (files are in Server/uploads/)
5. Build studio registration page so the multi-tenant flow is actually usable
6. All work should reference original MERN code in Client/src/ and Server/ — never invent content

## How to Start Next Session

Tell Claude:

> Read SAAS-PLAN.md. Let's fix the broken app — go through the original MERN app screen by screen and fix what's missing.

## Original MERN App Reference Data

Seed data lives in: `Client/src/data/` (FaqData.js, ServicesData.js, PagesData.js, GalleryData.js)
Image files live in: `Server/uploads/` (gallery, serviceWallpapers, pageWallpapers, styleWallpapers)
