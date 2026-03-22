# Tattooista — SaaS Transformation Plan

## Context

Tattooista started as a single-tenant tattoo studio management app (MERN stack). The migration to Next.js is ~10% complete. Rather than finishing the migration and retrofitting multi-tenancy later, we're designing the SaaS architecture first so every feature is built correctly once.

## Execution Order

### Layer 0 — Architecture Design (NOT STARTED)

Design decisions needed before writing any more feature code:

- **Multi-tenant model**: subdomain per studio (`studio1.tattooista.com`) vs path-based (`tattooista.com/studio1`)
- **Database strategy**: shared DB with `tenantId` on every table vs DB-per-tenant
- **Auth model**: platform admin (you) vs tenant admin (studio owner) vs public visitors (studio clients)
- **Storage**: isolated Vercel Blob paths per tenant
- **Billing**: Stripe subscriptions per studio
- **Onboarding**: how a new studio signs up and gets their instance

### Layer 1 — Rebuild with SaaS Bones

- New Prisma schema with tenancy baked into every model
- Auth flow that handles tenant context throughout the app
- Migrate features FROM original MERN app into the multi-tenant structure
- Each feature built once, correctly

### Layer 2 — Feature Completion

- Migrate remaining features from MERN app (Client/ and Server/ directories)
- Add improvements that were missing in the original
- Admin panel, client management, gallery, bookings, reviews — all tenant-scoped

### Layer 3 — Polish

- Styling, UX, portfolio-quality code
- Landing page / marketing site for the SaaS
- Documentation

## What's Done (2026-03-22)

- [x] Image storage migrated from local symlinks → Vercel Blob
- [x] Upload infrastructure switched from Uploadthing → Vercel Blob
- [x] Image helpers detect full URLs vs local paths
- [x] Migration script: `scripts/migrate-images.ts`
- [x] Basic pages: home, portfolio, reviews, booking form
- [x] Admin pages: gallery, clients, users, bookings, styles, services, pages, FAQ
- [x] Auth: NextAuth with email/password

## How to Start Next Session

Tell Claude:

> Let's work on Layer 0 of the SaaS plan. Read SAAS-PLAN.md and the original MERN app structure to design the multi-tenant architecture.

Claude has the plan saved in project memory and will pick up where we left off.
