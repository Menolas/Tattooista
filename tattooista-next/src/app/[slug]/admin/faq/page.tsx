export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FaqManager } from "./faq-manager"

export const metadata: Metadata = {
  title: "FAQ",
}

async function getFaqItems(studioId: string) {
  const items = await prisma.faqItem.findMany({
    where: { studioId },
    orderBy: { order: "asc" },
  })

  return items
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const studio = await prisma.studio.findUnique({ where: { slug }, select: { id: true } })
  if (!studio) notFound()
  const faqItems = await getFaqItems(studio.id)

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
