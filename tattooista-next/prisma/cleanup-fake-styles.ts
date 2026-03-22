import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const fakeStyles = ["Traditional", "Blackwork", "Realism", "Watercolor", "Minimalist", "Other"]
  for (const value of fakeStyles) {
    const deleted = await prisma.tattooStyle.deleteMany({ where: { value } })
    if (deleted.count > 0) console.log("Deleted fake style:", value)
  }
  console.log("Done")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
