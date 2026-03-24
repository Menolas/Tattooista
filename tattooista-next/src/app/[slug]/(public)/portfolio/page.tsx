export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Advertisement } from "@/components/shared/advertisement"
import { StyleSlider } from "@/components/shared/style-slider"
import { GalleryInfinite } from "@/components/shared/gallery-infinite"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse our tattoo portfolio showcasing various styles and designs.",
}

interface PortfolioPageProps {
  searchParams: Promise<{ style?: string }>
}

async function getPortfolioData(styleId?: string) {
  const styles = await prisma.tattooStyle.findMany({
    where: { isArchived: false },
    orderBy: { value: "asc" },
  })

  const activeStyleId = styleId || styles[0]?.id || null
  const activeStyle = styles.find((s) => s.id === activeStyleId) || null

  const pageSize = 20

  const where = {
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

  return { styles, activeStyle, galleryItems, totalCount, pageSize }
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams
  const { styles, activeStyle, galleryItems, totalCount, pageSize } =
    await getPortfolioData(params.style)

  return (
    <>
      {/* Styles Section */}
      <section className="tattoo-style-section relative pt-[118px] md:pt-[220px] md:pb-[28px] md:mb-0 bg-[url('/images/body-bg.jpg')] bg-no-repeat bg-cover">
        <div className="container overflow-visible">
          {/* Style title + description */}
          <div className="flex flex-col leading-[1.4] md:flex-row md:gap-[60px] md:mx-auto md:max-w-[1317px]">
            <div>
              <h1 className="relative mt-0 mb-4 md:mb-6 max-w-full overflow-hidden text-ellipsis text-[36px] md:text-[80px] text-center font-bold uppercase tracking-wider">
                {activeStyle?.value || "Portfolio"}
              </h1>
              <div className="text-center">
                {activeStyle?.description || "---"}
              </div>
            </div>
          </div>

          <Advertisement />

          <StyleSlider
            styles={styles.map((s) => ({
              id: s.id,
              value: s.value,
              nonStyle: s.nonStyle,
            }))}
            activeStyleId={activeStyle?.id || null}
          />
        </div>
      </section>

      {/* Gallery Section */}
      {activeStyle && (
        <GalleryInfinite
          styleId={activeStyle.id}
          initialItems={galleryItems.map((item) => ({
            id: item.id,
            fileName: item.fileName,
          }))}
          initialTotalCount={totalCount}
          pageSize={pageSize}
        />
      )}
    </>
  )
}
