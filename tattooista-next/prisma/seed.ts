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
      title: "Hey!! It is me",
      content:
        "gdfgsdfgiusto odio dignissimos ducimus qui blanditiis praesentium volusdgsdgsdgptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat",
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

  // Seed services (from original MERN app)
  const services = [
    {
      title: "TATTOO SESSION",
      conditions:
        "1000 kr -minimum cost up to one hour\n1000 kr/hour - no longer then 4 hours\n700 kr/hour cost for each next hour if session longer then 4 hours\nmax session 90 hours",
      order: 0,
    },
    {
      title: "CAVER UP",
      conditions:
        "1000 kr -minimum cost up to one hour\n1000 kr/hour - no longer then 4 hours\n700 kr/hour cost for each next hour if session longer then 4 hours\nmax session 6 hours",
      order: 1,
    },
    {
      title: "INDIVIDUAL DESIGN",
      conditions:
        "1000 kr -minimum cost up to one hour\n1000 kr/hour - no longer then 4 hours\n700 kr/hour cost for each next hour if session longer then 4 hours\nmax session 6 hours",
      order: 2,
    },
    {
      title: "CONSULTATION",
      conditions:
        "1000 kr -minimum cost up to one hour\n1000 kr/hour - no longer then 4 hours\n700 kr/hour cost for each next hour if session longer then 4 hours\nmax session 6 hours",
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

  // Seed FAQ items (from original MERN app)
  const faqItems = [
    {
      question: "IS IT SAFE TO GET A TATTOO?",
      answer:
        "Tattoos breach the skin, which means that skin infections and other complications are possible, including: allergic reactions, skin infections and other skin problems. From my side I can guarantee that your tattoo will be done by all hygienic standards and if you will follow my tips and look after your fresh tattoo together we can minimize that risk.",
      order: 0,
    },
    {
      question: "HOW TO LOOK AFTER YOU FRESH TATTOO?",
      answer:
        "Stay away from dust, dirt, direct sun rays, pools, saunas etc - especially for the first week after it is done, also first 2-3 days it is very important to wash your fresh tattoo every 4-5 hours with a soft soap, dry it and grease.",
      order: 1,
    },
    {
      question: "RECOMMENDATION BEFORE SESSION?",
      answer:
        "Before session have a good meal, get shower, change your cloth. If you getting late - write a message, if you going to cancel - do it beforehand, let respect each other.",
      order: 2,
    },
    {
      question: "CAN I GET A TATTOO IF I AM UNDER 18?",
      answer:
        "If you are under 18 then you gonna need your parents permission, your mom or dad need to say me personally, that they do not mind you having a tattoo.",
      order: 3,
    },
    {
      question: "DO YOU PROVIDE ANT ANESTHESIA WHILE TATTOOING?",
      answer: "In some cases I do, but you'll need to preorder it.",
      order: 4,
    },
    {
      question: "HOW LONG CAN BE A ONE TATTOO SESSION?",
      answer:
        "Up to 6 hours, in this case we gonna have few brakes. Bring your snacks!))",
      order: 5,
    },
    {
      question: "DO YOU REMOVE TATTOO?",
      answer: "Long story - short - I don't.",
      order: 6,
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
