export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ClientsTable } from "./clients-table"

export const metadata: Metadata = {
  title: "Clients",
}

async function getClients(studioId: string) {
  const clients = await prisma.client.findMany({
    where: { studioId, isArchived: false },
    include: {
      contacts: true,
      gallery: true,
    },
    orderBy: [{ isFavourite: "desc" }, { createdAt: "desc" }],
  })

  return clients
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const studio = await prisma.studio.findUnique({ where: { slug }, select: { id: true } })
  if (!studio) notFound()
  const clients = await getClients(studio.id)

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
