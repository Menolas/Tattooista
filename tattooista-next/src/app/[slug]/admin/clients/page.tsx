export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ClientsTable } from "./clients-table"

export const metadata: Metadata = {
  title: "Clients",
}

async function getClients() {
  const clients = await prisma.client.findMany({
    where: { isArchived: false },
    include: {
      contacts: true,
      gallery: true,
    },
    orderBy: [{ isFavourite: "desc" }, { createdAt: "desc" }],
  })

  return clients
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          Manage your client records and galleries.
        </p>
      </div>

      <ClientsTable clients={clients} />
    </div>
  )
}
