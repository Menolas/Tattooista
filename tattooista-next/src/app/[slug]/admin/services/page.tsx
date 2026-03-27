export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ServicesManager } from "./services-manager"

export const metadata: Metadata = {
  title: "Services",
}

async function getServices(studioId: string) {
  const services = await prisma.service.findMany({
    where: { studioId },
    orderBy: { order: "asc" },
  })

  return services
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const studio = await prisma.studio.findUnique({ where: { slug }, select: { id: true } })
  if (!studio) notFound()
  const services = await getServices(studio.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">
          Manage the services displayed on your website.
        </p>
      </div>

      <ServicesManager services={services} />
    </div>
  )
}
