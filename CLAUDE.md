# Project Setup

## Starting the project

1. Start PostgreSQL: `docker start tattooista-postgres`
2. Verify DB: `cd tattooista-next && npx prisma db push` (should say "already in sync")
3. Start dev server: `cd tattooista-next && npm run dev`

The Docker container (`postgres:16-alpine`) stops on machine restart. Without it, all Prisma queries fail with `P1001: Can't reach database server`.

- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/tattooista`
- Config: `tattooista-next/.env`
- Schema: `tattooista-next/prisma/schema.prisma`
