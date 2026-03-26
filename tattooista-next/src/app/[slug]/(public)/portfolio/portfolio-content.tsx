"use client"

import { useState, useCallback } from "react"
import { Advertisement } from "@/components/shared/advertisement"
import { StyleSlider } from "@/components/shared/style-slider"
import { GalleryInfinite } from "@/components/shared/gallery-infinite"

type StyleData = {
  id: string
  value: string
  description: string | null
  nonStyle: boolean
}

type GalleryItem = {
  id: string
  fileName: string
}

type Props = {
  styles: StyleData[]
  initialStyleId: string | null
  initialGalleryItems: GalleryItem[]
  initialTotalCount: number
  pageSize: number
}

export function PortfolioContent({
  styles,
  initialStyleId,
  initialGalleryItems,
  initialTotalCount,
  pageSize,
}: Props) {
  const [activeStyleId, setActiveStyleId] = useState<string | null>(initialStyleId)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [isLoadingStyle, setIsLoadingStyle] = useState(false)

  const activeStyle = styles.find((s) => s.id === activeStyleId) || null

  const handleStyleSelect = useCallback(async (styleId: string) => {
    if (styleId === activeStyleId) return

    setActiveStyleId(styleId)
    setIsLoadingStyle(true)

    try {
      const res = await fetch(`/api/gallery?styleId=${styleId}&page=1&pageSize=${pageSize}`)
      const data = await res.json()
      setGalleryItems(data.gallery)
      setTotalCount(data.totalCount)
    } catch (err) {
      console.error("Failed to fetch gallery:", err)
    } finally {
      setIsLoadingStyle(false)
    }
  }, [activeStyleId, pageSize])

  return (
    <>
      {/* Styles Section */}
      <section className="tattoo-style-section relative pt-[118px] md:pt-[220px] md:pb-[28px] md:mb-0 bg-[url('/images/body-bg.jpg')] bg-no-repeat bg-cover">
        <div className="container overflow-visible">
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
            activeStyleId={activeStyleId}
            onStyleSelect={handleStyleSelect}
          />
        </div>
      </section>

      {/* Gallery Section */}
      {activeStyle && (
        isLoadingStyle ? (
          <section className="relative pt-[30px] md:pt-[60px] container">
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-foreground border-t-transparent animate-spin" />
            </div>
          </section>
        ) : (
          <GalleryInfinite
            key={activeStyleId}
            styleId={activeStyle.id}
            initialItems={galleryItems}
            initialTotalCount={totalCount}
            pageSize={pageSize}
          />
        )
      )}
    </>
  )
}
