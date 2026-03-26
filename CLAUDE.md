# Rules

## MANDATORY: Ask before acting

NEVER run commands, install packages, create/modify files, or take ANY action without asking permission first.
Always: describe what you want to do → wait for approval → then act.
No exceptions.

## FORBIDDEN: External accounts

NEVER touch, modify, create, or delete anything on external accounts (Vercel, GitHub, npm, databases, any third-party service).
No creating databases, no adding integrations, no installing marketplace products, no modifying account settings.
If the user needs something done on an external account, explain what they need to do and where to find it. Let them do it themselves.

## Migration: Always reproduce from original first

When migrating components/features from the old MERN app (Client/Server directories) to tattooista-next:
1. Read the original component code FIRST
2. Read the original SCSS/styles FIRST
3. Reproduce the exact same logic, structure, and styling
4. Do NOT "improve", "simplify", or "reinvent" — copy the approach from the original
5. Only adapt what is necessary for the React/Next.js/Tailwind differences

## NEVER hallucinate data

NEVER invent seed data, style names, descriptions, FAQ content, or any other content.
Always read the actual data from:
- `tattooista-next/scripts/data/` — MongoDB JSON exports (tattoostyles.json, etc.)
- `Client/src/data/` — JS data files (FaqData.js, etc.)
If data exists there, copy it exactly.

## Think before pushing

Before every `git push`, mentally verify:
1. Will this work on Vercel (not just localhost)?
2. Are all required env vars set on Vercel?
3. Does the production DB have the right schema/data?
4. Do file paths resolve correctly (no local-only files)?
5. Does the hostname/URL pattern work on vercel.app?

## FORBIDDEN: Git and deployment

NEVER commit, push, or deploy. User handles all git operations and deployments themselves.

## Ask about choices, not execution

Ask permission for decisions (which service, tool, approach) but never for executing what the user already asked for. If something should match the original MERN project, just fix it — don't ask.

## When user says "md"

They mean CLAUDE.md, not memory files.

## When user says "how do I start"

They mean "what do we work on next", not project setup instructions.

---

# Coding Patterns & Gotchas

## Tenant resolution in public pages

Pages under `[slug]/(public)/` MUST use `params.slug` to query the studio directly — NOT `getTenantContext()`. The latter reads the `x-studio-id` header which may not be present. Follow the home page pattern: `const { slug } = await params` → `prisma.studio.findUnique({ where: { slug } })`.

## Images from DB: use `<img>`, not `next/image`

`next/image` requires paths starting with `/` or full URLs. Seed data has relative paths like `styles/mg_xxx/file.jpg` (no leading slash), user uploads return various formats. Use plain `<img>` with eslint-disable for any image src from DB. Reserve `next/image` for static known images only.

## CSS `url()` must have quotes

Always: `url('${path}')` — never `url(${path})`. Filenames with spaces or parens (e.g. `image (1).jpg`) break silently without quotes — element renders but no background, no console error.

## FileReader + input reset race condition

`e.target.files` is a live FileList. Resetting `input.value = ""` clears it before async `onloadend` callbacks fire. Always `Array.from()` the FileList and capture length BEFORE resetting the input.

## Portfolio style switching is client-side

Style carousel clicks use `<button onClick>` + useState, not `<Link>` navigation. URL should not change when switching styles. The `?style=` param is only for initial deep-linking (e.g. from home page carousel).

## SCSS → Tailwind: grep first, never guess

Always grep for SCSS variable values (`$color-xxx`, `$border-xxx`) before writing Tailwind classes. Never guess colors, borders, or sizes.

## Tailwind only, no raw CSS

Never write raw CSS class systems in `globals.css`. Use Tailwind utilities and CSS variables. Never hardcode hex values.

---

# Tech Stack

## Next.js App (`tattooista-next/`)

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript
- **ORM**: Prisma 7 with `@prisma/adapter-pg` (raw `pg` Pool)
- **Auth**: NextAuth v5 beta (`next-auth@5.0.0-beta.30`)
- **Styling**: Tailwind CSS with CSS variables, dark theme
- **UI**: Custom components (no shadcn/ui currently)
- **Fonts**: Custom setup in layout

## Original MERN App (reference only)

- `Client/` — React + Redux + SCSS (the source of truth for migration)
- `Server/` — Express + MongoDB (not used in new app)
- Original data exports in `tattooista-next/scripts/data/`

---

# Architecture

## Multi-Tenant (Studio-based)

Every data model has a `studioId` field. Tenant resolution flow:

1. **`proxy.ts`** (runs on every request, Node.js runtime):
   - Extracts studio slug from subdomain OR `?studio=slug` query param
   - Skips `.vercel.app` and `.vercel.sh` domains for subdomain extraction
   - Queries DB for studio → sets `x-studio-id` header
   - Also handles auth route protection (admin routes require login)

2. **`getTenantContext()`** (`src/lib/tenant.ts`):
   - Reads `x-studio-id` header set by proxy
   - Returns the Studio object for use in Server Components
   - If no header → returns null → landing page renders

## Key Files

```
tattooista-next/
├── src/
│   ├── proxy.ts                    # Request interceptor (auth + tenant resolution)
│   ├── app/
│   │   ├── (public)/page.tsx       # Home page (studio landing)
│   │   ├── (public)/portfolio/     # Portfolio page
│   │   ├── (public)/reviews/       # Reviews page
│   │   ├── (public)/contacts/      # Contacts page
│   │   ├── (auth)/                 # Login, register, reset-password, verify-email
│   │   └── admin/                  # Admin dashboard and management pages
│   ├── components/
│   │   ├── forms/                  # Form components
│   │   └── shared/                 # Shared UI components
│   └── lib/
│       ├── prisma.ts               # Prisma client singleton (pg Pool adapter)
│       ├── tenant.ts               # Tenant resolution helpers
│       ├── auth.ts                 # Full NextAuth config
│       ├── auth.config.ts          # Edge-compatible auth config (proxy only)
│       └── image-utils.ts          # URL helpers for wallpapers/avatars/gallery
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── seed.ts                     # Seed script (real data from MERN app)
│   └── migrate-to-multitenant.ts   # One-time migration script
├── public/
│   ├── images/                     # Static images (hero, backgrounds, avatar)
│   └── styles/mg_*/                # Style wallpapers (committed, from MERN app)
└── scripts/data/                   # MongoDB JSON exports (source of truth for seed)
```

## Image URL Conventions

URL helpers in `src/lib/image-utils.ts` handle three formats:
- **External URLs** (`https://...`) — returned as-is (e.g. from Uploadthing)
- **Relative paths** (contains `/`) — returned as `/{path}` (seed data, committed files)
- **Filenames only** — resolved as `/{type}/{entityId}/{filename}` (admin uploads)

---

# Local Development

## Starting the project

1. Start PostgreSQL: `docker start tattooista-postgres`
2. Verify DB: `cd tattooista-next && npx prisma db push` (should say "already in sync")
3. Start dev server: `cd tattooista-next && npm run dev`

The Docker container (`postgres:16-alpine`) stops on machine restart. Without it, all Prisma queries fail with `P1001: Can't reach database server`.

- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/tattooista`
- Config: `tattooista-next/.env`
- Schema: `tattooista-next/prisma/schema.prisma`

## Seeding

```bash
cd tattooista-next && npx tsx prisma/seed.ts
```

---

# Production (Vercel)

- **URL**: `tattooista-next.vercel.app` (use `?studio=demo` to see demo studio)
- **Database**: Neon PostgreSQL via Vercel Marketplace (auto-provisioned env vars)
- **Auth**: Requires `AUTH_SECRET` env var on Vercel
- **Proxy**: `proxy.ts` (NOT `middleware.ts`) — Next.js 16 convention, Node.js runtime
- **Git branch**: pushes to `main` auto-deploy to production

## Seeding production

```bash
cd tattooista-next
npx vercel env pull .env.production.local
DATABASE_URL=$(grep DATABASE_URL .env.production.local | head -1 | cut -d'"' -f2) npx tsx prisma/seed.ts
```

## Schema changes on production

```bash
DATABASE_URL=$(grep DATABASE_URL .env.production.local | head -1 | cut -d'"' -f2) npx prisma db push
```

## NEVER commit .env files

`.env.production.local`, `.env.local.bak`, and any file with credentials must NEVER be committed. The `.gitignore` covers `.env.*` and `*.bak`.
