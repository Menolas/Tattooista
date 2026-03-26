export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PortfolioContent } from "./portfolio-content"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse our tattoo portfolio showcasing various styles and designs.",
}

interface PortfolioPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ style?: string }>
}

async function getPortfolioData(slug: string, requestedStyleId?: string) {
  const studio = await prisma.studio.findUnique({
    where: { slug },
    select: { id: true, isActive: true },
  })

  if (!studio || !studio.isActive) return null

  const styles = await prisma.tattooStyle.findMany({
    where: { studioId: studio.id, isArchived: false },
    orderBy: { value: "asc" },
  })

  const activeStyleId =
    (requestedStyleId && styles.some((s) => s.id === requestedStyleId)
      ? requestedStyleId
      : null) || styles[0]?.id || null
  const pageSize = 20

  const where = {
    studioId: studio.id,
    isArchived: false,
    ...(activeStyleId && {
      styles: {
        some: {
          tattooStyleId: activeStyleId,
        },
      },
    }),
  }

  const [galleryItems, totalCount] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryItem.count({ where }),
  ])

  return { styles, galleryItems, totalCount, pageSize, activeStyleId }
}

export default async function PortfolioPage({ params, searchParams }: PortfolioPageProps) {
  const { slug } = await params
  const { style } = await searchParams
  const data = await getPortfolioData(slug, style)

  if (!data) notFound()

  const { styles, galleryItems, totalCount, pageSize, activeStyleId } = data

  return (
    <PortfolioContent
      styles={styles.map((s) => ({
        id: s.id,
        value: s.value,
        description: s.description,
        nonStyle: s.nonStyle,
      }))}
      initialStyleId={activeStyleId}
      initialGalleryItems={galleryItems.map((item) => ({
        id: item.id,
        fileName: item.fileName,
      }))}
      initialTotalCount={totalCount}
      pageSize={pageSize}
    />
  )
}
