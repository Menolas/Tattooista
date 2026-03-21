/**
 * Export all collections from MongoDB Atlas to JSON files
 * for use with the migration script.
 *
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/export-mongodb.ts
 */

import { MongoClient } from "mongodb"
import * as fs from "fs"
import * as path from "path"

const MONGO_URI =
  "mongodb+srv://Menolas:r512lock@cluster0.ervcqqm.mongodb.net/Tattooista"

const DATA_DIR = path.join(__dirname, "data")

const COLLECTIONS = [
  "users",
  "roles",
  "tokens",
  "clients",
  "archivedclients",
  "favouriteclients",
  "bookings",
  "archivedbookings",
  "reviews",
  "tattoostyles",
  "archivedtattoostyles",
  "galleryitems",
  "archivedgalleryitems",
  "services",
  "faqitems",
  "pages",
]

async function main() {
  console.log("Connecting to MongoDB Atlas...")
  const client = new MongoClient(MONGO_URI)

  try {
    await client.connect()
    const db = client.db("Tattooista")

    // List all actual collections
    const existingCollections = await db.listCollections().toArray()
    console.log(
      "Collections in database:",
      existingCollections.map((c) => c.name)
    )
    console.log("")

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    for (const collName of COLLECTIONS) {
      const exists = existingCollections.some((c) => c.name === collName)
      if (!exists) {
        console.log(`  [SKIP] ${collName} — not found in database`)
        continue
      }

      const docs = await db.collection(collName).find({}).toArray()
      const filePath = path.join(DATA_DIR, `${collName}.json`)
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2))
      console.log(`  [OK]   ${collName} — ${docs.length} documents → ${collName}.json`)
    }

    console.log("")
    console.log("Export complete! Files saved to:", DATA_DIR)
  } catch (err) {
    console.error("Export failed:", err)
    throw err
  } finally {
    await client.close()
  }
}

main()
