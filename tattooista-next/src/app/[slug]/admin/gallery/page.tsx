export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { GalleryManager } from "./gallery-manager"

export const metadata: Metadata = {
  title: "Gallery",
}

async function getGalleryData() {
  const [galleryItems, styles] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { isArchived: false },
      include: {
        styles: {
          include: {
            tattooStyle: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tattooStyle.findMany({
      where: { isArchived: false },
      orderBy: { value: "asc" },
    }),
  ])

  return {
    galleryItems: galleryItems.map((item) => ({
      ...item,
      styles: item.styles.map((s) => s.tattooStyle),
    })),
    styles,
  }
}

export default async function GalleryPage() {
  const { galleryItems, styles } = await getGalleryData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="text-muted-foreground">
          Manage your portfolio gallery images.
        </p>
      </div>

      <GalleryManager galleryItems={galleryItems} styles={styles} />
    </div>
  )
}
