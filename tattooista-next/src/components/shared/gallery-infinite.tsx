"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { galleryImageUrl } from "@/lib/image-utils"

type GalleryItem = {
  id: string
  fileName: string
}

type Props = {
  styleId: string
  initialItems: GalleryItem[]
  initialTotalCount: number
  pageSize?: number
}

export function GalleryInfinite({
  styleId,
  initialItems,
  initialTotalCount,
  pageSize = 20,
}: Props) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const galleryRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setItems(initialItems)
    setTotalCount(initialTotalCount)
    setPage(1)
  }, [styleId, initialItems, initialTotalCount])

  const fetchMore = useCallback(async () => {
    if (items.length >= totalCount || isLoading) return

    setIsLoading(true)
    const nextPage = page + 1

    try {
      const res = await fetch(
        `/api/gallery?styleId=${styleId}&page=${nextPage}&pageSize=${pageSize}`
      )
      const data = await res.json()
      setItems((prev) => [...prev, ...data.gallery])
      setPage(nextPage)
    } catch (err) {
      console.error("Failed to fetch gallery:", err)
    } finally {
      setIsLoading(false)
    }
  }, [styleId, items.length, totalCount, isLoading, page, pageSize])

  useEffect(() => {
    const handleScroll = () => {
      if (!galleryRef.current) return
      const rect = galleryRef.current.getBoundingClientRect()
      const isAtBottom = rect.bottom <= window.innerHeight

      if (isAtBottom && !isLoading && items.length < totalCount) {
        fetchMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoading, items.length, totalCount, fetchMore])

  const [fullViewIndex, setFullViewIndex] = useState<number | null>(null)

  return (
    <>
      <section
        className="relative pt-[30px] md:pt-[60px] container"
        ref={galleryRef}
      >
        {items.length > 0 ? (
          <ul className="relative flex flex-wrap gap-y-4 min-[768px]:gap-x-[2%] min-[990px]:gap-y-8 list-none m-0 p-0">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="flex flex-col w-full min-[768px]:w-[49%] min-[990px]:w-[23%] h-[320px] min-[1400px]:h-[440px]"
              >
                <div
                  className="h-full bg-cover bg-no-repeat bg-center overflow-hidden cursor-pointer grayscale hover:grayscale-0 shadow-[0_0_5px_3px_rgba(250,250,250,0.07)] min-[990px]:relative min-[990px]:transition-all min-[990px]:duration-300 min-[990px]:ease-in-out min-[990px]:hover:scale-[1.4] min-[990px]:hover:shadow-[0_0_10px_7px_rgba(0,0,0,0.8)] min-[990px]:hover:z-10"
                  onClick={() => setFullViewIndex(index)}
                  style={{
                    backgroundImage: `url(${galleryImageUrl(item.fileName)})`,
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No tattoos in this style yet.
          </p>
        )}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent animate-spin" />
          </div>
        )}
      </section>

      {/* Full view overlay */}
      {fullViewIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90"
          onClick={() => setFullViewIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-foreground text-3xl font-light"
            onClick={() => setFullViewIndex(null)}
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={galleryImageUrl(items[fullViewIndex].fileName)}
            alt="Tattoo artwork"
            className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain grayscale-0"
            style={{ filter: "none" }}
            onClick={(e) => e.stopPropagation()}
          />
          {fullViewIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground text-4xl font-light"
              onClick={(e) => {
                e.stopPropagation()
                setFullViewIndex(fullViewIndex - 1)
              }}
            >
              &#8249;
            </button>
          )}
          {fullViewIndex < items.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground text-4xl font-light"
              onClick={(e) => {
                e.stopPropagation()
                setFullViewIndex(fullViewIndex + 1)
              }}
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </>
  )
}
