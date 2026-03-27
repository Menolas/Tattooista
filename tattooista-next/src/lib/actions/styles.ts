"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { styleSchema, updateStyleSchema } from "@/lib/validations/style"

export async function getStyles(includeArchived = false) {
  const studio = await requireSessionStudio()

  const styles = await prisma.tattooStyle.findMany({
    where: { studioId: studio.id, ...(includeArchived ? {} : { isArchived: false }) },
    include: {
      _count: {
        select: {
          galleryItems: true,
        },
      },
    },
    orderBy: { value: "asc" },
  })

  return styles.map((style) => ({
    ...style,
    galleryCount: style._count.galleryItems,
  }))
}

export async function getStyleById(id: string) {
  const studio = await requireSessionStudio()

  const style = await prisma.tattooStyle.findUnique({
    where: { id },
    include: {
      galleryItems: {
        include: {
          galleryItem: true,
        },
      },
    },
  })

  if (!style || style.studioId !== studio.id) {
    throw new Error("Style not found")
  }

  return {
    ...style,
    galleryItems: style.galleryItems.map((gi) => gi.galleryItem),
  }
}

export async function createStyle(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    value: formData.get("value"),
    description: formData.get("description") || undefined,
    wallPaper: formData.get("wallPaper") || undefined,
    nonStyle: formData.get("nonStyle") === "true",
  }

  const validationResult = styleSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  // Check if style with same name exists
  const existing = await prisma.tattooStyle.findUnique({
    where: { studioId_value: { studioId: studio.id, value: data.value } },
  })

  if (existing) {
    return { error: "A style with this name already exists" }
  }

  try {
    const style = await prisma.tattooStyle.create({
      data: {
        studioId: studio.id,
        value: data.value,
        description: data.description || null,
        wallPaper: data.wallPaper || null,
        nonStyle: data.nonStyle || false,
      },
    })

    revalidatePath("/[slug]/admin/styles", "page")
    revalidatePath("/portfolio")
    return { success: true, data: style }
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint")
    ) {
      return { error: "A style with this name already exists" }
    }
    throw err
  }
}

export async function updateStyle(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    value: formData.get("value") || undefined,
    description: formData.get("description") || undefined,
    wallPaper: formData.get("wallPaper") || undefined,
    nonStyle: formData.has("nonStyle") ? formData.get("nonStyle") === "true" : undefined,
  }

  const validationResult = updateStyleSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  // Check if another style with same name exists in this studio
  if (data.value) {
    const existing = await prisma.tattooStyle.findFirst({
      where: {
        studioId: studio.id,
        value: data.value,
        NOT: { id },
      },
    })

    if (existing) {
      return { error: "A style with this name already exists" }
    }
  }

  const style = await prisma.tattooStyle.update({
    where: { id },
    data: {
      ...(data.value && { value: data.value }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.wallPaper !== undefined && { wallPaper: data.wallPaper || null }),
      ...(data.nonStyle !== undefined && { nonStyle: data.nonStyle }),
    },
  })

  revalidatePath("/[slug]/admin/styles", "page")
  revalidatePath("/portfolio")
  return { success: true, data: style }
}

export async function archiveStyle(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.tattooStyle.update({
    where: { id },
    data: { isArchived: true },
  })

  revalidatePath("/[slug]/admin/styles", "page")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function restoreStyle(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.tattooStyle.update({
    where: { id },
    data: { isArchived: false },
  })

  revalidatePath("/[slug]/admin/styles", "page")
  revalidatePath("/portfolio")
  return { success: true }
}

export async function deleteStyle(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.tattooStyle.delete({
    where: { id },
  })

  revalidatePath("/[slug]/admin/styles", "page")
  revalidatePath("/portfolio")
  return { success: true }
}
