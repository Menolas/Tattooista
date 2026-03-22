/**
 * Migration script: Upload all local images to Vercel Blob and update DB records.
 *
 * Prerequisites:
 *   - BLOB_READ_WRITE_TOKEN set in .env.local
 *   - Docker postgres container running
 *   - Run from tattooista-next/: npx tsx scripts/migrate-images.ts
 *
 * What it does:
 *   1. Reads all image files from Server/uploads/
 *   2. Uploads each to Vercel Blob
 *   3. Updates the corresponding DB record with the Blob URL
 */

import { put } from "@vercel/blob"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"
import { config } from "dotenv"

// Load .env.local for BLOB_READ_WRITE_TOKEN, then .env for DATABASE_URL
config({ path: resolve(__dirname, "../.env.local") })
config({ path: resolve(__dirname, "../.env") })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const UPLOADS_DIR = resolve(__dirname, "../../Server/uploads")

function stripMgPrefix(id: string): string {
  return id.startsWith("mg_") ? id.slice(3) : id
}

async function uploadFile(localPath: string, blobPath: string): Promise<string> {
  const fileBuffer = readFileSync(localPath)
  const blob = await put(blobPath, fileBuffer, { access: "public" })
  return blob.url
}

function findFile(dir: string, fileName: string): string | null {
  const path = join(dir, fileName)
  if (existsSync(path)) return path
  return null
}

// ============ GALLERY ============
async function migrateGallery() {
  console.log("\n=== Migrating Gallery Items ===")
  const items = await prisma.galleryItem.findMany()
  let success = 0, skipped = 0, failed = 0

  for (const item of items) {
    if (item.fileName.startsWith("http")) {
      skipped++
      continue
    }

    const localPath = findFile(join(UPLOADS_DIR, "gallery"), item.fileName)
    if (!localPath) {
      console.warn(`  SKIP: File not found for GalleryItem ${item.id}: ${item.fileName}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `gallery/${item.fileName}`)
      await prisma.galleryItem.update({ where: { id: item.id }, data: { fileName: url } })
      success++
      if (success % 50 === 0) console.log(`  Progress: ${success}/${items.length}`)
    } catch (err) {
      console.error(`  FAIL: GalleryItem ${item.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Gallery: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ TATTOO STYLES ============
async function migrateStyleWallpapers() {
  console.log("\n=== Migrating Style Wallpapers ===")
  const styles = await prisma.tattooStyle.findMany({ where: { wallPaper: { not: null } } })
  let success = 0, skipped = 0, failed = 0

  for (const style of styles) {
    if (!style.wallPaper || style.wallPaper.startsWith("http")) {
      skipped++
      continue
    }

    const mongoId = stripMgPrefix(style.id)
    const localPath = findFile(join(UPLOADS_DIR, "styleWallpapers", mongoId), style.wallPaper)
    if (!localPath) {
      console.warn(`  SKIP: File not found for TattooStyle ${style.id}: ${style.wallPaper}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `styleWallpapers/${mongoId}/${style.wallPaper}`)
      await prisma.tattooStyle.update({ where: { id: style.id }, data: { wallPaper: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: TattooStyle ${style.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Styles: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ SERVICES ============
async function migrateServiceWallpapers() {
  console.log("\n=== Migrating Service Wallpapers ===")
  const services = await prisma.service.findMany({ where: { wallPaper: { not: null } } })
  let success = 0, skipped = 0, failed = 0

  for (const service of services) {
    if (!service.wallPaper || service.wallPaper.startsWith("http")) {
      skipped++
      continue
    }

    const mongoId = stripMgPrefix(service.id)
    const localPath = findFile(join(UPLOADS_DIR, "serviceWallpapers", mongoId), service.wallPaper)
    if (!localPath) {
      console.warn(`  SKIP: File not found for Service ${service.id}: ${service.wallPaper}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `serviceWallpapers/${mongoId}/${service.wallPaper}`)
      await prisma.service.update({ where: { id: service.id }, data: { wallPaper: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: Service ${service.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Services: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ PAGES ============
async function migratePageWallpapers() {
  console.log("\n=== Migrating Page Wallpapers ===")
  const pages = await prisma.page.findMany({ where: { wallPaper: { not: null } } })
  let success = 0, skipped = 0, failed = 0

  for (const page of pages) {
    if (!page.wallPaper || page.wallPaper.startsWith("http")) {
      skipped++
      continue
    }

    const mongoId = stripMgPrefix(page.id)
    const localPath = findFile(join(UPLOADS_DIR, "pageWallpapers", mongoId), page.wallPaper)
    if (!localPath) {
      console.warn(`  SKIP: File not found for Page ${page.id}: ${page.wallPaper}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `pageWallpapers/${mongoId}/${page.wallPaper}`)
      await prisma.page.update({ where: { id: page.id }, data: { wallPaper: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: Page ${page.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Pages: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ USER AVATARS ============
async function migrateUserAvatars() {
  console.log("\n=== Migrating User Avatars ===")
  const users = await prisma.user.findMany({ where: { avatar: { not: null } } })
  let success = 0, skipped = 0, failed = 0

  for (const user of users) {
    if (!user.avatar || user.avatar.startsWith("http")) {
      skipped++
      continue
    }

    const mongoId = stripMgPrefix(user.id)
    const localPath = findFile(join(UPLOADS_DIR, "users", mongoId, "avatar"), user.avatar)
    if (!localPath) {
      console.warn(`  SKIP: File not found for User ${user.id}: ${user.avatar}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `users/${mongoId}/avatar/${user.avatar}`)
      await prisma.user.update({ where: { id: user.id }, data: { avatar: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: User ${user.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Users: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ CLIENT AVATARS ============
async function migrateClientAvatars() {
  console.log("\n=== Migrating Client Avatars ===")
  const clients = await prisma.client.findMany({ where: { avatar: { not: null } } })
  let success = 0, skipped = 0, failed = 0

  for (const client of clients) {
    if (!client.avatar || client.avatar === "" || client.avatar.startsWith("http")) {
      skipped++
      continue
    }

    const mongoId = stripMgPrefix(client.id)
    const localPath = findFile(join(UPLOADS_DIR, "clients", mongoId, "avatar"), client.avatar)
    if (!localPath) {
      console.warn(`  SKIP: File not found for Client ${client.id}: ${client.avatar}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `clients/${mongoId}/avatar/${client.avatar}`)
      await prisma.client.update({ where: { id: client.id }, data: { avatar: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: Client ${client.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Client avatars: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ CLIENT GALLERY ============
async function migrateClientGallery() {
  console.log("\n=== Migrating Client Gallery Items ===")
  const items = await prisma.clientGalleryItem.findMany({ include: { client: true } })
  let success = 0, skipped = 0, failed = 0

  for (const item of items) {
    if (item.fileName.startsWith("http")) {
      skipped++
      continue
    }

    const clientMongoId = stripMgPrefix(item.clientId)
    // Client gallery files are in doneTattooGallery subdirectory
    let localPath = findFile(join(UPLOADS_DIR, "clients", clientMongoId, "doneTattooGallery"), item.fileName)
    // Fallback: check directly in client dir
    if (!localPath) {
      localPath = findFile(join(UPLOADS_DIR, "clients", clientMongoId), item.fileName)
    }
    if (!localPath) {
      console.warn(`  SKIP: File not found for ClientGalleryItem ${item.id}: ${item.fileName}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `clients/${clientMongoId}/gallery/${item.fileName}`)
      await prisma.clientGalleryItem.update({ where: { id: item.id }, data: { fileName: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: ClientGalleryItem ${item.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Client gallery: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ REVIEW GALLERY ============
async function migrateReviewGallery() {
  console.log("\n=== Migrating Review Gallery Items ===")
  const items = await prisma.reviewGalleryItem.findMany()
  let success = 0, skipped = 0, failed = 0

  for (const item of items) {
    if (item.fileName.startsWith("http")) {
      skipped++
      continue
    }

    const reviewMongoId = stripMgPrefix(item.reviewId)
    const localPath = findFile(join(UPLOADS_DIR, "reviews", reviewMongoId), item.fileName)
    if (!localPath) {
      console.warn(`  SKIP: File not found for ReviewGalleryItem ${item.id}: ${item.fileName}`)
      skipped++
      continue
    }

    try {
      const url = await uploadFile(localPath, `reviews/${reviewMongoId}/${item.fileName}`)
      await prisma.reviewGalleryItem.update({ where: { id: item.id }, data: { fileName: url } })
      success++
    } catch (err) {
      console.error(`  FAIL: ReviewGalleryItem ${item.id}: ${err}`)
      failed++
    }
  }
  console.log(`  Reviews: ${success} uploaded, ${skipped} skipped, ${failed} failed`)
}

// ============ MAIN ============
async function main() {
  console.log("Starting image migration to Vercel Blob...")
  console.log(`Uploads directory: ${UPLOADS_DIR}`)

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("ERROR: BLOB_READ_WRITE_TOKEN not set. Add it to .env.local")
    process.exit(1)
  }

  if (!existsSync(UPLOADS_DIR)) {
    console.error(`ERROR: Uploads directory not found: ${UPLOADS_DIR}`)
    process.exit(1)
  }

  await migrateGallery()
  await migrateStyleWallpapers()
  await migrateServiceWallpapers()
  await migratePageWallpapers()
  await migrateUserAvatars()
  await migrateClientAvatars()
  await migrateClientGallery()
  await migrateReviewGallery()

  console.log("\n=== Migration Complete ===")
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  prisma.$disconnect()
  process.exit(1)
})
