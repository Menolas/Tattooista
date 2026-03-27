export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BookingsTable } from "./bookings-table"

export const metadata: Metadata = {
  title: "Bookings",
}

async function getBookings(studioId: string) {
  const bookings = await prisma.booking.findMany({
    where: { studioId, isArchived: false },
    orderBy: { createdAt: "desc" },
  })

  return bookings
}

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const studio = await prisma.studio.findUnique({ where: { slug }, select: { id: true } })
  if (!studio) notFound()
  const bookings = await getBookings(studio.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">
          Manage consultation requests from potential clients.
        </p>
      </div>

      <BookingsTable bookings={bookings} />
    </div>
  )
}
