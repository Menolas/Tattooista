/**
 * MongoDB to PostgreSQL Data Migration Script
 *
 * Reads exported JSON files from ./scripts/data/ and migrates them
 * to the PostgreSQL database via Prisma.
 *
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-data.ts
 */

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import * as fs from "fs"
import * as path from "path"

import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const DATA_DIR = path.join(__dirname, "data")

// Map old MongoDB _id → new Prisma id
const idMap: Record<string, string> = {}

function readJsonFile<T>(filename: string): T[] {
  const filepath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filepath)) {
    console.log(`  [SKIP] ${filename} — file not found`)
    return []
  }
  const content = fs.readFileSync(filepath, "utf-8")
  const parsed = JSON.parse(content)
  return Array.isArray(parsed) ? parsed : []
}

function getMongoId(val: string | { $oid: string }): string {
  return typeof val === "object" && val.$oid ? val.$oid : String(val)
}

function getDate(val: unknown): Date {
  if (!val) return new Date()
  if (typeof val === "object" && val !== null && "$date" in val) return new Date((val as { $date: string }).$date)
  return new Date(String(val))
}

function mapId(oldId: string | { $oid: string }): string {
  const id = getMongoId(oldId)
  if (!idMap[id]) {
    idMap[id] = `mg_${id}`
  }
  return idMap[id]
}

// ---- Interfaces for MongoDB documents ----

interface MongoRole {
  _id: string
  value: string
}

interface MongoUser {
  _id: string
  email: string
  password: string
  displayName: string
  avatar?: string
  roles: string[]
  isActivated: boolean
  createdAt?: string
}

interface MongoStyle {
  _id: string
  value: string
  description?: string
  wallPaper?: string
  nonStyle?: boolean
  createdAt?: string
}

interface MongoGalleryItem {
  _id: string
  fileName: string
  tattooStyles?: string[]
  createdAt?: string
}

interface MongoClient {
  _id: string
  fullName: string
  avatar?: string
  isFavourite?: boolean
  contacts?: {
    email?: string
    phone?: string
    whatsapp?: string
    messenger?: string
    insta?: string
  }
  gallery?: string[]
  createdAt?: string
}

interface MongoBooking {
  _id: string
  fullName: string
  message?: string
  status?: boolean
  contacts?: {
    email?: string
    phone?: string
    insta?: string
    whatsapp?: string
    messenger?: string
  }
  createdAt?: string
}

interface MongoReview {
  _id: string
  rate: number
  content: string
  user: string
  gallery?: string[]
  createdAt?: string
}

interface MongoService {
  _id: string
  title: string
  wallPaper?: string
  conditions?: string[]
}

interface MongoFaqItem {
  _id: string
  question: string
  answer: string
}

interface MongoPage {
  _id: string
  name: string
  isActive?: boolean
  title?: string
  wallPaper?: string
  content?: string
}

// ---- Migration functions ----

async function clearDatabase() {
  console.log("Clearing existing data...")
  // Delete in order to respect foreign keys
  await prisma.reviewGalleryItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.galleryItemStyle.deleteMany()
  await prisma.galleryItem.deleteMany()
  await prisma.clientGalleryItem.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.client.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.service.deleteMany()
  await prisma.faqItem.deleteMany()
  await prisma.page.deleteMany()
  await prisma.tattooStyle.deleteMany()
  await prisma.userRole.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  console.log("  Done.\n")
}

async function migrateRoles() {
  console.log("Migrating roles...")
  const roles = readJsonFile<MongoRole>("roles.json")

  const roleMap: Record<string, string> = {}
  for (const role of roles) {
    // Normalize: MongoDB has "SUPER_ADMIN", Prisma uses "SUPERADMIN"
    let value = role.value
    if (value === "SUPER_ADMIN") value = "SUPERADMIN"

    const created = await prisma.role.create({
      data: { id: mapId(role._id), value },
    })
    roleMap[getMongoId(role._id)] = created.id
  }

  // Ensure all default roles exist
  for (const v of ["USER", "ADMIN", "SUPERADMIN"]) {
    const exists = await prisma.role.findUnique({ where: { value: v } })
    if (!exists) {
      await prisma.role.create({ data: { value: v } })
    }
  }

  console.log(`  Migrated ${roles.length} roles\n`)
}

async function migrateUsers() {
  console.log("Migrating users...")
  const users = readJsonFile<MongoUser>("users.json")
  const roles = readJsonFile<MongoRole>("roles.json")

  for (const user of users) {
    const newId = mapId(user._id)

    await prisma.user.create({
      data: {
        id: newId,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        avatar: user.avatar || null,
        isActivated: user.isActivated ?? false,
        emailVerified: user.isActivated ? new Date() : null,
        createdAt: getDate(user.createdAt),
      },
    })

    // Assign roles
    for (const roleRef of user.roles) {
      const roleId = getMongoId(roleRef)
      const mongoRole = roles.find((r) => getMongoId(r._id) === roleId)
      if (mongoRole) {
        let roleValue = mongoRole.value
        if (roleValue === "SUPER_ADMIN") roleValue = "SUPERADMIN"

        const dbRole = await prisma.role.findUnique({ where: { value: roleValue } })
        if (dbRole) {
          await prisma.userRole.create({
            data: { userId: newId, roleId: dbRole.id },
          })
        }
      }
    }

    console.log(`  User: ${user.displayName} (${user.email})`)
  }
  console.log(`  Migrated ${users.length} users\n`)
}

async function migrateStyles() {
  console.log("Migrating tattoo styles...")
  const styles = readJsonFile<MongoStyle>("tattoostyles.json")

  for (const style of styles) {
    const newId = mapId(style._id)
    await prisma.tattooStyle.create({
      data: {
        id: newId,
        value: style.value,
        description: style.description || null,
        wallPaper: style.wallPaper || null,
        nonStyle: style.nonStyle ?? false,
        isArchived: false,
        createdAt: getDate(style.createdAt),
      },
    })
    console.log(`  Style: ${style.value}`)
  }
  console.log(`  Migrated ${styles.length} styles\n`)
}

async function migrateGalleryItems() {
  console.log("Migrating gallery items...")
  const items = readJsonFile<MongoGalleryItem>("galleryitems.json")
  const archivedItems = readJsonFile<MongoGalleryItem>("archivedgalleryitems.json")

  for (const item of items) {
    const newId = mapId(item._id)
    await prisma.galleryItem.create({
      data: {
        id: newId,
        fileName: item.fileName,
        isArchived: false,
        createdAt: getDate(item.createdAt),
      },
    })

    // Link to styles
    if (item.tattooStyles) {
      for (const styleRef of item.tattooStyles) {
        const styleId = mapId(styleRef)
        const style = await prisma.tattooStyle.findUnique({ where: { id: styleId } })
        if (style) {
          await prisma.galleryItemStyle.create({
            data: { galleryItemId: newId, tattooStyleId: style.id },
          })
        }
      }
    }
  }

  for (const item of archivedItems) {
    const newId = mapId(item._id)
    await prisma.galleryItem.create({
      data: {
        id: newId,
        fileName: item.fileName,
        isArchived: true,
        createdAt: getDate(item.createdAt),
      },
    })

    if (item.tattooStyles) {
      for (const styleRef of item.tattooStyles) {
        const styleId = mapId(styleRef)
        const style = await prisma.tattooStyle.findUnique({ where: { id: styleId } })
        if (style) {
          await prisma.galleryItemStyle.create({
            data: { galleryItemId: newId, tattooStyleId: style.id },
          })
        }
      }
    }
  }

  console.log(`  Migrated ${items.length} active + ${archivedItems.length} archived gallery items\n`)
}

async function migrateClients() {
  console.log("Migrating clients...")
  const clients = readJsonFile<MongoClient>("clients.json")
  const archivedClients = readJsonFile<MongoClient>("archivedclients.json")

  async function insertClient(client: MongoClient, isArchived: boolean) {
    const newId = mapId(client._id)
    await prisma.client.create({
      data: {
        id: newId,
        fullName: client.fullName,
        avatar: client.avatar || null,
        isFavourite: client.isFavourite ?? false,
        isArchived,
        createdAt: getDate(client.createdAt),
      },
    })

    // Contacts
    if (client.contacts) {
      const contacts: Array<{ type: string; value: string }> = []
      if (client.contacts.email) contacts.push({ type: "email", value: client.contacts.email })
      if (client.contacts.phone) contacts.push({ type: "phone", value: client.contacts.phone })
      if (client.contacts.whatsapp) contacts.push({ type: "whatsapp", value: client.contacts.whatsapp })
      if (client.contacts.messenger) contacts.push({ type: "messenger", value: client.contacts.messenger })
      if (client.contacts.insta) contacts.push({ type: "instagram", value: client.contacts.insta })

      for (const c of contacts) {
        await prisma.contact.create({ data: { type: c.type, value: c.value, clientId: newId } })
      }
    }

    // Gallery
    if (client.gallery) {
      for (const fileName of client.gallery) {
        await prisma.clientGalleryItem.create({ data: { fileName, clientId: newId } })
      }
    }

    console.log(`  Client: ${client.fullName}${isArchived ? " (archived)" : ""}`)
  }

  for (const c of clients) await insertClient(c, false)
  for (const c of archivedClients) await insertClient(c, true)

  console.log(`  Migrated ${clients.length} active + ${archivedClients.length} archived clients\n`)
}

async function migrateBookings() {
  console.log("Migrating bookings...")
  const bookings = readJsonFile<MongoBooking>("bookings.json")
  const archivedBookings = readJsonFile<MongoBooking>("archivedbookings.json")

  async function insertBooking(booking: MongoBooking, isArchived: boolean) {
    const newId = mapId(booking._id)
    await prisma.booking.create({
      data: {
        id: newId,
        fullName: booking.fullName,
        email: booking.contacts?.email || null,
        phone: booking.contacts?.phone || null,
        instagram: booking.contacts?.insta || null,
        message: booking.message || null,
        status: booking.status ? "CONTACTED" : "PENDING",
        isArchived,
        createdAt: getDate(booking.createdAt),
      },
    })
  }

  for (const b of bookings) await insertBooking(b, false)
  for (const b of archivedBookings) await insertBooking(b, true)

  console.log(`  Migrated ${bookings.length} active + ${archivedBookings.length} archived bookings\n`)
}

async function migrateReviews() {
  console.log("Migrating reviews...")
  const reviews = readJsonFile<MongoReview>("reviews.json")

  for (const review of reviews) {
    const newId = mapId(review._id)
    const userId = mapId(review.user)

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      console.log(`  [SKIP] Review ${newId} — user not found (${userId})`)
      continue
    }

    await prisma.review.create({
      data: {
        id: newId,
        rate: review.rate,
        content: review.content,
        userId: user.id,
        isArchived: false,
        createdAt: getDate(review.createdAt),
      },
    })

    if (review.gallery) {
      for (const fileName of review.gallery) {
        await prisma.reviewGalleryItem.create({ data: { fileName, reviewId: newId } })
      }
    }

    console.log(`  Review by user ${user.displayName}: ${review.rate} stars`)
  }
  console.log(`  Migrated ${reviews.length} reviews\n`)
}

async function migrateServices() {
  console.log("Migrating services...")
  const services = readJsonFile<MongoService>("services.json")

  let order = 0
  for (const service of services) {
    const newId = mapId(service._id)
    await prisma.service.create({
      data: {
        id: newId,
        title: service.title,
        wallPaper: service.wallPaper || null,
        conditions: service.conditions?.join("\n") || null,
        order: order++,
      },
    })
    console.log(`  Service: ${service.title}`)
  }
  console.log(`  Migrated ${services.length} services\n`)
}

async function migrateFaq() {
  console.log("Migrating FAQ items...")
  const items = readJsonFile<MongoFaqItem>("faqitems.json")

  let order = 0
  for (const item of items) {
    const newId = mapId(item._id)
    await prisma.faqItem.create({
      data: {
        id: newId,
        question: item.question,
        answer: item.answer,
        order: order++,
      },
    })
  }
  console.log(`  Migrated ${items.length} FAQ items\n`)
}

async function migratePages() {
  console.log("Migrating pages...")
  const pages = readJsonFile<MongoPage>("pages.json")

  for (const page of pages) {
    const newId = mapId(page._id)
    await prisma.page.create({
      data: {
        id: newId,
        name: page.name,
        isActive: page.isActive ?? true,
        title: page.title || null,
        wallPaper: page.wallPaper || null,
        content: page.content || null,
      },
    })
    console.log(`  Page: ${page.name}`)
  }
  console.log(`  Migrated ${pages.length} pages\n`)
}

async function main() {
  console.log("=== MongoDB → PostgreSQL Migration ===\n")

  try {
    await clearDatabase()
    await migrateRoles()
    await migrateUsers()
    await migrateStyles()
    await migrateGalleryItems()
    await migrateClients()
    await migrateBookings()
    await migrateReviews()
    await migrateServices()
    await migrateFaq()
    await migratePages()

    console.log("=== Migration complete! ===")
    console.log(`Total ID mappings: ${Object.keys(idMap).length}`)
  } catch (err) {
    console.error("Migration failed:", err)
    throw err
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
