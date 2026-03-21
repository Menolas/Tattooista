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

# Project Setup

## Starting the project

1. Start PostgreSQL: `docker start tattooista-postgres`
2. Verify DB: `cd tattooista-next && npx prisma db push` (should say "already in sync")
3. Start dev server: `cd tattooista-next && npm run dev`

The Docker container (`postgres:16-alpine`) stops on machine restart. Without it, all Prisma queries fail with `P1001: Can't reach database server`.

- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/tattooista`
- Config: `tattooista-next/.env`
- Schema: `tattooista-next/prisma/schema.prisma`
