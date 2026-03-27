export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PagesManager } from "./pages-manager"

export const metadata: Metadata = {
  title: "Pages",
}

async function getPages(studioId: string) {
  const pages = await prisma.page.findMany({
    where: { studioId },
    orderBy: { name: "asc" },
  })

  return pages
}

export default async function PagesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const studio = await prisma.studio.findUnique({ where: { slug }, select: { id: true } })
  if (!studio) notFound()
  const pages = await getPages(studio.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pages</h1>
        <p className="text-muted-foreground">
          Manage content pages on your website.
        </p>
      </div>

      <PagesManager pages={pages} />
    </div>
  )
}
