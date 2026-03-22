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
        "Welcome to Tattooista! We are a professional tattoo studio dedicated to creating unique, personalized artwork that tells your story. Our experienced artists specialize in various styles and are committed to delivering exceptional results in a clean, comfortable environment.",
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
      content:
        "We'd love to hear from you! Whether you have questions about our services or want to book a consultation, don't hesitate to reach out.",
      isActive: true,
    },
  })

  console.log("Created default pages")

  // Seed tattoo styles (using compound unique)
  const styles = [
    {
      value: "Traditional",
      description:
        "Bold lines, limited color palette, and iconic imagery. Classic American tattoo style.",
    },
    {
      value: "Blackwork",
      description:
        "Using exclusively black ink to create bold, graphic designs and patterns.",
    },
    {
      value: "Realism",
      description:
        "Highly detailed tattoos that look like photographs or 3D images.",
    },
    {
      value: "Watercolor",
      description:
        "Soft, flowing designs that mimic watercolor paintings with splashes of color.",
    },
    {
      value: "Minimalist",
      description:
        "Simple, clean designs with fine lines and minimal detail.",
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
      conditions:
        "Unique designs created specifically for you based on your ideas and vision. Includes consultation and multiple revision rounds.",
      order: 0,
    },
    {
      title: "Cover-ups",
      conditions:
        "Transform existing tattoos you're no longer happy with into beautiful new pieces. Requires consultation to assess the existing tattoo.",
      order: 1,
    },
    {
      title: "Touch-ups",
      conditions:
        "Refresh and revitalize older tattoos that have faded over time. Free touch-ups within 3 months for tattoos done at our studio.",
      order: 2,
    },
    {
      title: "Consultations",
      conditions:
        "Free consultations to discuss your tattoo ideas, placement, sizing, and pricing. No commitment required.",
      order: 3,
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
      answer:
        "Tattoo pricing depends on size, complexity, placement, and time required. We offer free consultations where we can provide an accurate quote for your specific design. Our minimum is $100 for small pieces.",
      order: 0,
    },
    {
      question: "Does getting a tattoo hurt?",
      answer:
        "Pain levels vary depending on the location and your personal pain tolerance. Most people describe it as a scratching sensation. We can take breaks as needed and use numbing products for sensitive areas.",
      order: 1,
    },
    {
      question: "How do I care for my new tattoo?",
      answer:
        "After your session, we'll provide detailed aftercare instructions. Generally, keep the tattoo clean, moisturized, and out of direct sunlight. Avoid swimming and soaking for 2-3 weeks.",
      order: 2,
    },
    {
      question: "How do I book an appointment?",
      answer:
        "You can book a consultation through our website's booking form, or contact us directly via email or phone. We'll discuss your ideas and schedule your session.",
      order: 3,
    },
    {
      question: "What should I do before my appointment?",
      answer:
        "Get a good night's sleep, eat a meal before your appointment, stay hydrated, and avoid alcohol for 24 hours. Wear comfortable clothing that provides easy access to the tattoo area.",
      order: 4,
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
