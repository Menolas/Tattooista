"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireTenantContext, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { serviceSchema, updateServiceSchema } from "@/lib/validations/service"

export async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  })

  return services
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  })

  if (!service) {
    throw new Error("Service not found")
  }

  return service
}

export async function createService(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    title: formData.get("title"),
    wallPaper: formData.get("wallPaper") || undefined,
    conditions: formData.get("conditions") || undefined,
    order: formData.has("order") ? parseInt(formData.get("order") as string, 10) : undefined,
  }

  const validationResult = serviceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const service = await prisma.service.create({
    data: {
      studioId: studio.id,
      title: data.title,
      wallPaper: data.wallPaper || null,
      conditions: data.conditions || null,
      order: data.order ?? 0,
    },
  })

  revalidatePath("/admin/services")
  revalidatePath("/")
  return { success: true, data: service }
}

export async function updateService(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  const rawData = {
    title: formData.get("title") || undefined,
    wallPaper: formData.get("wallPaper") || undefined,
    conditions: formData.get("conditions") || undefined,
    order: formData.has("order") ? parseInt(formData.get("order") as string, 10) : undefined,
  }

  const validationResult = updateServiceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const service = await prisma.service.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.wallPaper !== undefined && { wallPaper: data.wallPaper || null }),
      ...(data.conditions !== undefined && { conditions: data.conditions || null }),
      ...(data.order !== undefined && { order: data.order }),
    },
  })

  revalidatePath("/admin/services")
  revalidatePath("/")
  return { success: true, data: service }
}

export async function deleteService(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.service.delete({
    where: { id },
  })

  revalidatePath("/admin/services")
  revalidatePath("/")
  return { success: true }
}

export async function reorderServices(orderedIds: string[]) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.service.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  revalidatePath("/admin/services")
  revalidatePath("/")
  return { success: true }
}
