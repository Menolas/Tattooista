"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireTenantContext, requireStudioRole } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { bookingSchema, updateBookingStatusSchema } from "@/lib/validations/booking"
import { sendBookingNotification } from "@/lib/email"
import type { BookingStatus } from "@prisma/client"

export async function createBooking(formData: FormData) {
  const studio = await requireTenantContext()

  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    instagram: formData.get("instagram") || undefined,
    message: formData.get("message") || undefined,
  }

  const validationResult = bookingSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const data = validationResult.data

  const booking = await prisma.booking.create({
    data: {
      studioId: studio.id,
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone || null,
      instagram: data.instagram || null,
      message: data.message || null,
    },
  })

  // Send notification email
  await sendBookingNotification(booking)

  return { success: true, data: booking }
}

export async function getBookings(includeArchived = false) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  const bookings = await prisma.booking.findMany({
    where: includeArchived ? {} : { isArchived: false },
    orderBy: { createdAt: "desc" },
  })

  return bookings
}

export async function getBookingById(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  const booking = await prisma.booking.findUnique({
    where: { id },
  })

  if (!booking) {
    throw new Error("Booking not found")
  }

  return booking
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  const validationResult = updateBookingStatusSchema.safeParse({ status })
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  await prisma.booking.update({
    where: { id },
    data: { status },
  })

  revalidatePath("/admin/bookings")
  return { success: true }
}

export async function archiveBooking(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.booking.update({
    where: { id },
    data: { isArchived: true },
  })

  revalidatePath("/admin/bookings")
  return { success: true }
}

export async function restoreBooking(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.booking.update({
    where: { id },
    data: { isArchived: false },
  })

  revalidatePath("/admin/bookings")
  return { success: true }
}

export async function deleteBooking(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  await prisma.booking.delete({
    where: { id },
  })

  revalidatePath("/admin/bookings")
  return { success: true }
}

export async function convertBookingToClient(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  const studio = await requireTenantContext()
  await requireStudioRole(session.user.id, studio.id)

  const booking = await prisma.booking.findUnique({
    where: { id },
  })

  if (!booking) {
    return { error: "Booking not found" }
  }

  // Create client with contacts from booking
  const contacts = []
  if (booking.email) {
    contacts.push({ type: "email", value: booking.email, studioId: studio.id })
  }
  if (booking.phone) {
    contacts.push({ type: "phone", value: booking.phone, studioId: studio.id })
  }
  if (booking.instagram) {
    contacts.push({ type: "instagram", value: booking.instagram, studioId: studio.id })
  }

  const client = await prisma.client.create({
    data: {
      studioId: studio.id,
      fullName: booking.fullName,
      contacts: {
        create: contacts,
      },
    },
    include: {
      contacts: true,
    },
  })

  // Mark booking as completed
  await prisma.booking.update({
    where: { id },
    data: { status: "COMPLETED" },
  })

  revalidatePath("/admin/bookings")
  revalidatePath("/admin/clients")
  return { success: true, data: client }
}
