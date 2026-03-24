"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireSessionStudio, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { clientSchema, updateClientSchema } from "@/lib/validations/client"

export async function getClients(includeArchived = false) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const clients = await prisma.client.findMany({
    where: includeArchived ? {} : { isArchived: false },
    include: {
      contacts: true,
      gallery: true,
    },
    orderBy: [
      { isFavourite: "desc" },
      { createdAt: "desc" },
    ],
  })

  return clients
}

export async function getClientById(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: true,
      gallery: true,
    },
  })

  if (!client) {
    throw new Error("Client not found")
  }

  return client
}

export async function createClient(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const contactsJson = formData.get("contacts")
  let contacts: Array<{ type: string; value: string }> = []

  if (contactsJson && typeof contactsJson === "string") {
    try {
      contacts = JSON.parse(contactsJson)
    } catch {
      return { error: "Invalid contacts data" }
    }
  }

  const rawData = {
    fullName: formData.get("fullName"),
    avatar: formData.get("avatar") || undefined,
    contacts,
  }

  const validationResult = clientSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const client = await prisma.client.create({
    data: {
      studioId: studio.id,
      fullName: data.fullName,
      avatar: data.avatar || null,
      contacts: data.contacts ? {
        create: data.contacts.map((c) => ({
          studioId: studio.id,
          type: c.type,
          value: c.value,
        })),
      } : undefined,
    },
    include: {
      contacts: true,
      gallery: true,
    },
  })

  revalidatePath("/[slug]/admin/clients", "page")
  return { success: true, data: client }
}

export async function updateClient(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const contactsJson = formData.get("contacts")
  let contacts: Array<{ type: string; value: string }> | undefined

  if (contactsJson && typeof contactsJson === "string") {
    try {
      contacts = JSON.parse(contactsJson)
    } catch {
      return { error: "Invalid contacts data" }
    }
  }

  const rawData = {
    fullName: formData.get("fullName") || undefined,
    avatar: formData.get("avatar") || undefined,
    contacts,
  }

  const validationResult = updateClientSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  // If contacts are being updated, delete existing and create new
  if (contacts) {
    await prisma.contact.deleteMany({
      where: { clientId: id },
    })
  }

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.avatar !== undefined && { avatar: data.avatar || null }),
      ...(contacts && {
        contacts: {
          create: contacts.map((c) => ({
            studioId: studio.id,
            type: c.type,
            value: c.value,
          })),
        },
      }),
    },
    include: {
      contacts: true,
      gallery: true,
    },
  })

  revalidatePath("/[slug]/admin/clients", "page")
  revalidatePath(`/[slug]/admin/clients/${id}`, "page")
  return { success: true, data: client }
}

export async function toggleClientFavourite(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const client = await prisma.client.findUnique({
    where: { id },
  })

  if (!client) {
    return { error: "Client not found" }
  }

  await prisma.client.update({
    where: { id },
    data: { isFavourite: !client.isFavourite },
  })

  revalidatePath("/[slug]/admin/clients", "page")
  return { success: true }
}

export async function archiveClient(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.client.update({
    where: { id },
    data: { isArchived: true },
  })

  revalidatePath("/[slug]/admin/clients", "page")
  return { success: true }
}

export async function restoreClient(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.client.update({
    where: { id },
    data: { isArchived: false },
  })

  revalidatePath("/[slug]/admin/clients", "page")
  return { success: true }
}

export async function deleteClient(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.client.delete({
    where: { id },
  })

  revalidatePath("/[slug]/admin/clients", "page")
  return { success: true }
}

export async function addClientGalleryItem(clientId: string, fileName: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.clientGalleryItem.create({
    data: {
      studioId: studio.id,
      fileName,
      clientId,
    },
  })

  revalidatePath(`/[slug]/admin/clients/${clientId}`, "page")
  return { success: true }
}

export async function removeClientGalleryItem(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireSessionStudio()
  await requireStudioRole(session.user.id, studio.id)

  const item = await prisma.clientGalleryItem.findUnique({
    where: { id },
  })

  if (!item) {
    return { error: "Gallery item not found" }
  }

  await prisma.clientGalleryItem.delete({
    where: { id },
  })

  revalidatePath(`/[slug]/admin/clients/${item.clientId}`, "page")
  return { success: true }
}
