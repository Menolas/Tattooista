export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { FaqManager } from "./faq-manager"

export const metadata: Metadata = {
  title: "FAQ",
}

async function getFaqItems() {
  const items = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  })

  return items
}

export default async function FaqPage() {
  const faqItems = await getFaqItems()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FAQ</h1>
        <p className="text-muted-foreground">
          Manage frequently asked questions displayed on the website.
        </p>
      </div>

      <FaqManager faqItems={faqItems} />
    </div>
  )
}
