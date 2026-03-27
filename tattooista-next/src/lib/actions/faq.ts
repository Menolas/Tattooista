"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { faqSchema, updateFaqSchema } from "@/lib/validations/faq"

export async function getFaqItems() {
  const studio = await requireSessionStudio()

  const items = await prisma.faqItem.findMany({
    where: { studioId: studio.id },
    orderBy: { order: "asc" },
  })

  return items
}

export async function getFaqItemById(id: string) {
  const studio = await requireSessionStudio()

  const item = await prisma.faqItem.findUnique({
    where: { id },
  })

  if (!item || item.studioId !== studio.id) {
    throw new Error("FAQ item not found")
  }

  return item
}

export async function createFaqItem(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    question: formData.get("question"),
    answer: formData.get("answer"),
    order: formData.has("order") ? parseInt(formData.get("order") as string, 10) : undefined,
  }

  const validationResult = faqSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const item = await prisma.faqItem.create({
    data: {
      studioId: studio.id,
      question: data.question,
      answer: data.answer,
      order: data.order ?? 0,
    },
  })

  revalidatePath("/[slug]/admin/faq", "page")
  revalidatePath("/")
  return { success: true, data: item }
}

export async function updateFaqItem(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    question: formData.get("question") || undefined,
    answer: formData.get("answer") || undefined,
    order: formData.has("order") ? parseInt(formData.get("order") as string, 10) : undefined,
  }

  const validationResult = updateFaqSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const item = await prisma.faqItem.update({
    where: { id },
    data: {
      ...(data.question && { question: data.question }),
      ...(data.answer && { answer: data.answer }),
      ...(data.order !== undefined && { order: data.order }),
    },
  })

  revalidatePath("/[slug]/admin/faq", "page")
  revalidatePath("/")
  return { success: true, data: item }
}

export async function deleteFaqItem(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.faqItem.delete({
    where: { id },
  })

  revalidatePath("/[slug]/admin/faq", "page")
  revalidatePath("/")
  return { success: true }
}

export async function reorderFaqItems(orderedIds: string[]) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.faqItem.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  revalidatePath("/[slug]/admin/faq", "page")
  revalidatePath("/")
  return { success: true }
}
