export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ServicesManager } from "./services-manager"

export const metadata: Metadata = {
  title: "Services",
}

async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  })

  return services
}

export default async function ServicesPage() {
  const services = await getServices()

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
