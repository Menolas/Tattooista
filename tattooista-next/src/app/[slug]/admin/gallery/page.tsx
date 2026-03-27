export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { GalleryManager } from "./gallery-manager"

export const metadata: Metadata = {
  title: "Gallery",
}

async function getGalleryData(studioId: string) {
  const [galleryItems, styles] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { studioId, isArchived: false },
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
      where: { studioId, isArchived: false },
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

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const studio = await prisma.studio.findUnique({ where: { slug }, select: { id: true } })
  if (!studio) notFound()
  const { galleryItems, styles } = await getGalleryData(studio.id)

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
