"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"

export async function getGalleryItems(includeArchived = false) {
  const items = await prisma.galleryItem.findMany({
    where: includeArchived ? {} : { isArchived: false },
    include: {
      styles: {
        include: {
          tattooStyle: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Transform to simpler structure
  return items.map((item) => ({
    ...item,
    styles: item.styles.map((s) => s.tattooStyle),
  }))
}

export async function getGalleryItemsByStyle(styleId: string) {
  const items = await prisma.galleryItem.findMany({
    where: {
      isArchived: false,
      styles: {
        some: {
          tattooStyleId: styleId,
        },
      },
    },
    include: {
      styles: {
        include: {
          tattooStyle: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return items.map((item) => ({
    ...item,
    styles: item.styles.map((s) => s.tattooStyle),
  }))
}

export async function createGalleryItem(fileName: string, styleIds: string[] = []) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const item = await prisma.galleryItem.create({
    data: {
      studioId: studio.id,
      fileName,
      styles: styleIds.length > 0 ? {
        create: styleIds.map((styleId) => ({
          studioId: studio.id,
          tattooStyleId: styleId,
        })),
      } : undefined,
    },
    include: {
      styles: {
        include: {
          tattooStyle: true,
        },
      },
    },
  })

  revalidatePath("/[slug]/admin/gallery", "page")
  revalidatePath("/portfolio")
  return { success: true, data: item }
}

export async function createManyGalleryItems(
  items: Array<{ fileName: string; styleIds?: string[] }>
) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const createdItems = []

  for (const item of items) {
    const created = await prisma.galleryItem.create({
      data: {
        studioId: studio.id,
        fileName: item.fileName,
        styles: item.styleIds && item.styleIds.length > 0 ? {
          create: item.styleIds.map((styleId) => ({
            studioId: studio.id,
            tattooStyleId: styleId,
          })),
        } : undefined,
      },
    })
    createdItems.push(created)
  }

  revalidatePath("/[slug]/admin/gallery", "page")
  revalidatePath("/portfolio")
  return { success: true, data: createdItems }
}

export async function updateGalleryItemStyles(id: string, styleIds: string[]) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  // Delete existing style associations
  await prisma.galleryItemStyle.deleteMany({
    where: { galleryItemId: id },
  })

  // Create new associations
  if (styleIds.length > 0) {
    await prisma.galleryItemStyle.createMany({
      data: styleIds.map((styleId) => ({
        studioId: studio.id,
        galleryItemId: id,
        tattooStyleId: styleId,
      })),
    })
  }

  revalidatePath("/[slug]/admin/gallery", "page")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function archiveGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.galleryItem.update({
    where: { id },
    data: { isArchived: true },
  })

  revalidatePath("/[slug]/admin/gallery", "page")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function restoreGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.galleryItem.update({
    where: { id },
    data: { isArchived: false },
  })

  revalidatePath("/[slug]/admin/gallery", "page")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.galleryItem.delete({
    where: { id },
  })

  revalidatePath("/[slug]/admin/gallery", "page")
  revalidatePath("/portfolio")
  return { success: true }
}
