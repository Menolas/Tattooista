export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BookingsTable } from "./bookings-table"

export const metadata: Metadata = {
  title: "Bookings",
}

async function getBookings() {
  const bookings = await prisma.booking.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
  })

  return bookings
}

export default async function BookingsPage() {
  const bookings = await getBookings()

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
