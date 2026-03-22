import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

import "dotenv/config"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Create platform admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@tattooista.com" },
    update: {},
    create: {
      email: "admin@tattooista.com",
      password: hashedPassword,
      displayName: "Admin",
      isActivated: true,
      emailVerified: new Date(),
      platformRole: "PLATFORM_ADMIN",
    },
  })

  console.log("Created admin user:", adminUser.email)

  // Create demo studio
  const demoStudio = await prisma.studio.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Tattoo Studio",
      slug: "demo",
    },
  })

  console.log("Created demo studio:", demoStudio.slug)

  // Link admin as studio owner
  await prisma.studioMembership.upsert({
    where: {
      userId_studioId: {
        userId: adminUser.id,
        studioId: demoStudio.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      studioId: demoStudio.id,
      role: "OWNER",
    },
  })

  console.log("Linked admin as studio owner")

  // Seed default pages (using compound unique)
  await prisma.page.upsert({
    where: {
      studioId_name: {
        studioId: demoStudio.id,
        name: "about",
      },
    },
    update: {},
    create: {
      studioId: demoStudio.id,
      name: "about",
      title: "About Us",
      content:
        "Welcome to our studio! We are dedicated to creating unique, personalized artwork.",
      isActive: true,
    },
  })

  await prisma.page.upsert({
    where: {
      studioId_name: {
        studioId: demoStudio.id,
        name: "contacts",
      },
    },
    update: {},
    create: {
      studioId: demoStudio.id,
      name: "contacts",
      title: "Get in Touch",
      content: "We'd love to hear from you!",
      isActive: true,
    },
  })

  console.log("Created default pages")

  // Seed tattoo styles (using compound unique)
  const styles = [
    {
      value: "Traditional",
      description: "Bold lines, limited color palette, and iconic imagery.",
    },
    {
      value: "Blackwork",
      description: "Using exclusively black ink for bold, graphic designs.",
    },
    {
      value: "Realism",
      description: "Highly detailed tattoos that look like photographs.",
    },
    {
      value: "Other",
      description: null,
      nonStyle: true,
    },
  ]

  for (const style of styles) {
    await prisma.tattooStyle.upsert({
      where: {
        studioId_value: {
          studioId: demoStudio.id,
          value: style.value,
        },
      },
      update: {},
      create: {
        studioId: demoStudio.id,
        value: style.value,
        description: style.description,
        nonStyle: style.nonStyle ?? false,
      },
    })
  }

  console.log("Created tattoo styles:", styles.map((s) => s.value))

  // Seed services
  const services = [
    {
      title: "Custom Tattoos",
      conditions: "Unique designs created specifically for you.",
      order: 0,
    },
    {
      title: "Cover-ups",
      conditions: "Transform existing tattoos into new pieces.",
      order: 1,
    },
    {
      title: "Consultations",
      conditions: "Free consultations to discuss your ideas.",
      order: 2,
    },
  ]

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { studioId: demoStudio.id, title: service.title },
    })
    if (!existing) {
      await prisma.service.create({
        data: { ...service, studioId: demoStudio.id },
      })
    }
  }

  console.log("Created services:", services.map((s) => s.title))

  // Seed FAQ items
  const faqItems = [
    {
      question: "How much does a tattoo cost?",
      answer: "Pricing depends on size, complexity, and time. Our minimum is $100.",
      order: 0,
    },
    {
      question: "How do I book an appointment?",
      answer: "Use our booking form or contact us directly.",
      order: 1,
    },
  ]

  for (const faq of faqItems) {
    const existing = await prisma.faqItem.findFirst({
      where: { studioId: demoStudio.id, question: faq.question },
    })
    if (!existing) {
      await prisma.faqItem.create({
        data: { ...faq, studioId: demoStudio.id },
      })
    }
  }

  console.log("Created FAQ items:", faqItems.length)

  console.log("Database seeded successfully!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
