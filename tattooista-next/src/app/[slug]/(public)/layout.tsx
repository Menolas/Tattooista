import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/shared/header"
import { Contacts } from "@/components/shared/contacts"
import { Footer } from "@/components/shared/footer"

export default async function StudioPublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Validate the studio exists and is active
  const studio = await prisma.studio.findUnique({
    where: { slug },
    select: { id: true, isActive: true, slug: true },
  })

  if (!studio || !studio.isActive) {
    notFound()
  }

  return (
    <>
      <Header studioSlug={slug} />
      <main>{children}</main>
      <Contacts />
      <Footer />
    </>
  )
}
