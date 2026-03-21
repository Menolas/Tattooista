"use server"

import { prisma } from "@/lib/prisma"
import { auth, isAdmin } from "@/lib/auth"
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
  if (!session?.user || !isAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  const item = await prisma.galleryItem.create({
    data: {
      fileName,
      styles: styleIds.length > 0 ? {
        create: styleIds.map((styleId) => ({
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

  revalidatePath("/admin/gallery")
  revalidatePath("/portfolio")
  return { success: true, data: item }
}

export async function createManyGalleryItems(
  items: Array<{ fileName: string; styleIds?: string[] }>
) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  const createdItems = []

  for (const item of items) {
    const created = await prisma.galleryItem.create({
      data: {
        fileName: item.fileName,
        styles: item.styleIds && item.styleIds.length > 0 ? {
          create: item.styleIds.map((styleId) => ({
            tattooStyleId: styleId,
          })),
        } : undefined,
      },
    })
    createdItems.push(created)
  }

  revalidatePath("/admin/gallery")
  revalidatePath("/portfolio")
  return { success: true, data: createdItems }
}

export async function updateGalleryItemStyles(id: string, styleIds: string[]) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  // Delete existing style associations
  await prisma.galleryItemStyle.deleteMany({
    where: { galleryItemId: id },
  })

  // Create new associations
  if (styleIds.length > 0) {
    await prisma.galleryItemStyle.createMany({
      data: styleIds.map((styleId) => ({
        galleryItemId: id,
        tattooStyleId: styleId,
      })),
    })
  }

  revalidatePath("/admin/gallery")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function archiveGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  await prisma.galleryItem.update({
    where: { id },
    data: { isArchived: true },
  })

  revalidatePath("/admin/gallery")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function restoreGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  await prisma.galleryItem.update({
    where: { id },
    data: { isArchived: false },
  })

  revalidatePath("/admin/gallery")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user || !isAdmin(session.user.roles)) {
    return { error: "Unauthorized" }
  }

  await prisma.galleryItem.delete({
    where: { id },
  })

  revalidatePath("/admin/gallery")
  revalidatePath("/portfolio")
  return { success: true }
}
