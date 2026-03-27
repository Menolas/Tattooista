"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { updatePageSchema } from "@/lib/validations/page"

export async function getPageByName(name: string) {
  const studio = await requireSessionStudio()
  const page = await prisma.page.findUnique({
    where: { studioId_name: { studioId: studio.id, name } },
  })

  return page
}

export async function getPages() {
  const studio = await requireSessionStudio()

  const pages = await prisma.page.findMany({
    where: { studioId: studio.id },
    orderBy: { name: "asc" },
  })

  return pages
}

export async function updatePage(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    name: formData.get("name") || undefined,
    isActive: formData.has("isActive") ? formData.get("isActive") === "true" : undefined,
    title: formData.get("title") || undefined,
    wallPaper: formData.get("wallPaper") || undefined,
    content: formData.get("content") || undefined,
  }

  const validationResult = updatePageSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  // Check if another page has this name in this studio
  if (data.name) {
    const existing = await prisma.page.findFirst({
      where: {
        studioId: studio.id,
        name: data.name,
        NOT: { id },
      },
    })

    if (existing) {
      return { error: "A page with this name already exists" }
    }
  }

  const page = await prisma.page.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.title !== undefined && { title: data.title || null }),
      ...(data.wallPaper !== undefined && { wallPaper: data.wallPaper || null }),
      ...(data.content !== undefined && { content: data.content || null }),
    },
  })

  revalidatePath("/[slug]/admin/pages", "page")
  revalidatePath("/")
  revalidatePath("/contacts")
  return { success: true, data: page }
}

export async function createPage(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const name = formData.get("name") as string

  if (!name) {
    return { error: "Page name is required" }
  }

  // Check if page exists
  const existing = await prisma.page.findUnique({
    where: { studioId_name: { studioId: studio.id, name } },
  })

  if (existing) {
    return { error: "A page with this name already exists" }
  }

  const page = await prisma.page.create({
    data: {
      studioId: studio.id,
      name,
      title: (formData.get("title") as string) || null,
      wallPaper: (formData.get("wallPaper") as string) || null,
      content: (formData.get("content") as string) || null,
      isActive: formData.get("isActive") !== "false",
    },
  })

  revalidatePath("/[slug]/admin/pages", "page")
  return { success: true, data: page }
}

export async function deletePage(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.page.delete({
    where: { id },
  })

  revalidatePath("/[slug]/admin/pages", "page")
  return { success: true }
}
