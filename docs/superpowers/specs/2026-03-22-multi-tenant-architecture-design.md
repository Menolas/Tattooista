# Tattooista Multi-Tenant SaaS Architecture — Layer 0 Design

## Summary

Transform Tattooista from a single-tenant tattoo studio app into a multi-tenant SaaS platform where tattoo studios self-serve: sign up, pick a subdomain, and manage their studio site independently.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tenancy model | Subdomain per studio | Studios care about brand identity; `studio.tattooista.com` feels like "my site" |
| Database strategy | Shared DB + `studioId` | One schema, one migration path, simpler ops; data isn't high-sensitivity |
| Auth model | Platform Admin / Studio Owner / Studio Staff / Public Visitor | Clean separation of platform-level and studio-level concerns |
| Billing model | Flat tiers (FREE / PRO) | Studio owners want predictable pricing, not usage metering |
| Storage isolation | Blob path prefix per tenant (`studios/{studioId}/...`) | Logical separation, easy bulk deletion |
| Onboarding | Self-service, minimal friction | Sign up → name studio → pick subdomain → start customizing |
| Architecture approach | Tenant-first rewrite | Only ~10% migrated; cheaper to rebuild with tenancy baked in than to retrofit |

---

## 1. Tenant Model & Schema

### Studio (tenant anchor)

```
Studio
  id            String   @id @default(cuid())
  name          String   ("Ink Master Studio")
  slug          String   @unique — used as subdomain
  logo          String?  (Vercel Blob URL)
  customDomain  String?  @unique — future Pro feature
  plan          Plan     @default(FREE) — enum FREE / PRO
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  isActive      Boolean  @default(true) — kill switch for non-payment
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
```

### StudioMembership (links Users to Studios)

```
StudioMembership
  id       String     @id @default(cuid())
  userId   String     → User
  studioId String     → Studio
  role     StudioRole — enum OWNER / STAFF
  @@unique([userId, studioId])
```

### User changes

- Drop `UserRole` and `Role` tables entirely
- Add `platformRole` field on User: enum `USER` / `PLATFORM_ADMIN` (default USER)
- Platform-level role (PLATFORM_ADMIN) is for you only
- Studio-level role is determined by `StudioMembership.role`
- A single User can belong to multiple Studios (freelance artists working at multiple shops)

### Tenant-scoped models

Every business model gets a `studioId` foreign key:

- Client, Contact, ClientGalleryItem
- Booking
- Review, ReviewGalleryItem
- GalleryItem, GalleryItemStyle, TattooStyle
- Service, Page, FaqItem

### Platform-level models (no studioId)

- User, Account, Session, VerificationToken, PasswordResetToken
- Studio, StudioMembership

---

## 2. Subdomain Routing & Tenant Resolution

### Request flow

`proxy.ts` (or `middleware.ts`) intercepts every request:

1. Extract subdomain from hostname (`ink-master.tattooista.com` → `ink-master`)
2. Look up `Studio` by slug
3. If found and active: inject `studioId` into `x-studio-id` request header, continue
4. If not found: 404 page
5. If not active (suspended): "studio suspended" page

### Special subdomains

- `www.tattooista.com` / `tattooista.com` — marketing/landing page + sign-up
- `app.tattooista.com` — platform admin dashboard

### Tenant context utility

`getTenantContext()` — server-side utility that reads `x-studio-id` header, returns the current studio. All data-fetching calls this first.

### Local development

Use `localhost:3000` as landing site. Tenant resolution in dev mode via `?studio=ink-master` query param to avoid needing local DNS/hosts file config for subdomains.

---

## 3. Auth Flow

### Sign-up paths

- **Studio owner**: `tattooista.com/register` → creates User + Studio + StudioMembership(OWNER) in one transaction → redirects to `{slug}.tattooista.com/admin`
- **Staff invite**: owner invites via email from admin panel → recipient creates User (or links existing) → gets StudioMembership(STAFF)
- **Public visitor**: `{slug}.tattooista.com/register` → creates User with no membership → can submit bookings and reviews on that studio

### Sign-in

- On a studio subdomain: signs in, lands in that studio's context
- On the main site: signs in, sees studio picker if multiple memberships, otherwise redirects to their studio

### Session

Session contains `userId` and `platformRole` only. Studio role is resolved per-request from subdomain + StudioMembership lookup — no studio context stored in the session.

### Authorization

Utility `requireStudioRole('OWNER')`:
1. Read tenant context (from subdomain)
2. Read user session
3. Query StudioMembership for this user + studio
4. Throw if unauthorized

---

## 4. Data Access Layer & Tenant Scoping

### Prisma extension for automatic tenant scoping

`tenantPrisma(studioId)` returns a Prisma client that:
- Automatically injects `WHERE studioId = ?` on every `findMany`, `findFirst`, `findUnique`, `update`, `delete` for tenant-scoped models
- Automatically sets `studioId` on every `create` call
- Prevents creating records without a tenant

### Usage pattern

```typescript
const studio = await getTenantContext()
const db = tenantPrisma(studio.id)
const clients = await db.client.findMany() // automatically filtered by studioId
```

### Platform admin queries

Use the raw Prisma client without tenant scoping for cross-studio dashboards and analytics.

### Tenant-scoped models

Client, Contact, ClientGalleryItem, Booking, Review, ReviewGalleryItem, GalleryItem, GalleryItemStyle, TattooStyle, Service, Page, FaqItem

### Platform-level models

User, Account, Session, VerificationToken, PasswordResetToken, Studio, StudioMembership

---

## 5. Storage Isolation

### Path structure

```
studios/{studioId}/gallery/{fileId}.jpg
studios/{studioId}/clients/{fileId}.jpg
studios/{studioId}/reviews/{fileId}.jpg
studios/{studioId}/logo.png
users/{userId}/avatar.png          ← not studio-scoped
```

### Upload flow

Upload route handler reads tenant context, constructs path prefix, passes to Vercel Blob `put()`. No upload without valid tenant context.

### Deletion

Studio deletion or cancellation → bulk-delete all blobs under `studios/{studioId}/`.

### User avatars

Stored under `users/{userId}/` since a user can belong to multiple studios.

---

## 6. Billing

### Plan tiers

| Feature | FREE | PRO |
|---------|------|-----|
| Gallery items | 50 | Unlimited |
| Staff accounts | 1 (owner only) | Multiple |
| Custom domain | No | Yes |
| Footer branding | "Powered by Tattooista" | None |

### Stripe integration (design only — implementation in later layer)

- "Upgrade to Pro" → Stripe Checkout session with `studioId` in metadata
- `checkout.session.completed` webhook → set `stripeCustomerId`, `stripeSubscriptionId`, plan = PRO
- `customer.subscription.deleted` webhook → downgrade to FREE
- `invoice.payment_failed` webhook → grace period → `isActive = false`

### Schema fields

`plan`, `stripeCustomerId`, `stripeSubscriptionId`, `isActive` on Studio model. Studios start on FREE.

---

## 7. Onboarding Flow

### Steps

1. Visitor on `tattooista.com` clicks "Create Your Studio"
2. **Account step**: email, password, display name → creates User
3. **Studio step**: studio name, subdomain slug (auto-generated from name, editable), optional logo upload → creates Studio + StudioMembership(OWNER) in one transaction
4. Redirect to `{slug}.tattooista.com/admin`

### Default data seeded on studio creation

- Default Page records for "about" and "contacts" (empty content)
- Default TattooStyle "Other" with `nonStyle: true`
- No services, FAQ, gallery, or clients — owner adds from admin

### Slug validation

- Lowercase alphanumeric + hyphens only
- Must be unique
- Reserved slugs blocked: `www`, `app`, `api`, `admin`, `static`, `assets`
