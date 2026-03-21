export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { StylesManager } from "./styles-manager"

export const metadata: Metadata = {
  title: "Tattoo Styles",
}

async function getStyles() {
  const styles = await prisma.tattooStyle.findMany({
    where: { isArchived: false },
    include: {
      _count: {
        select: { galleryItems: true },
      },
    },
    orderBy: { value: "asc" },
  })

  return styles.map((style) => ({
    ...style,
    galleryCount: style._count.galleryItems,
  }))
}

export default async function StylesPage() {
  const styles = await getStyles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tattoo Styles</h1>
        <p className="text-muted-foreground">
          Manage tattoo style categories for the portfolio.
        </p>
      </div>

      <StylesManager styles={styles} />
    </div>
  )
}
