export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PagesManager } from "./pages-manager"

export const metadata: Metadata = {
  title: "Pages",
}

async function getPages() {
  const pages = await prisma.page.findMany({
    orderBy: { name: "asc" },
  })

  return pages
}

export default async function PagesPage() {
  const pages = await getPages()

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
