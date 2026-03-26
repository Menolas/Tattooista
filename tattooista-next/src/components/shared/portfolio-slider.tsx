"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import type { TattooStyle } from "@prisma/client"
import { styleWallpaperUrl } from "@/lib/image-utils"

type Props = {
  styles: TattooStyle[]
  slug: string
}

export function PortfolioSlider({ styles, slug }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const totalDots = styles.length

  const scrollTo = (direction: "prev" | "next") => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const slideWidth = container.querySelector<HTMLElement>("[data-slide]")?.offsetWidth ?? 300
    const gap = 10
    const scrollAmount = slideWidth + gap

    if (direction === "prev") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const slide = container.querySelector<HTMLElement>("[data-slide]")
    if (!slide) return
    const slideWidth = slide.offsetWidth + 10
    const newIndex = Math.round(container.scrollLeft / slideWidth)
    setActiveIndex(newIndex)
  }

  return (
    <div className="relative">
      {/* Slides container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[10px] overflow-x-auto snap-x snap-mandatory scrollbar-none h-[400px] sm:h-[380px] md:h-[489px] mx-auto md:mx-[75px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {styles.map((style) => (
          <div
            key={style.id}
            data-slide
            className="group flex-shrink-0 w-[calc(100%-10px)] sm:w-[275px] md:w-[325px] h-full snap-start p-[5px]"
          >
            <Link
              href={`/${slug}/portfolio?style=${style.id}`}
              className="flex justify-center items-end pb-[20px] w-full h-full bg-cover bg-no-repeat bg-center grayscale group-hover:grayscale-0 transition-all duration-300"
              style={{
                backgroundImage: style.wallPaper
                  ? `url(${styleWallpaperUrl(style.id, style.wallPaper)})`
                  : undefined,
              }}
            >
              <div className="w-full bg-[rgba(55,55,55,0.3)]">
                <h4 className="m-0 py-[13px] px-[16px] text-[28px] font-medium leading-[0.9] text-foreground shadow-[0_0_1rem_0_rgba(0,0,0,0.2)] backdrop-blur-[5px]">
                  {style.value}
                </h4>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Prev/Next arrows */}
      <button
        onClick={() => scrollTo("prev")}
        className="slider-arrow slider-arrow--prev hidden md:block"
      >
        <span />
      </button>
      <button
        onClick={() => scrollTo("next")}
        className="slider-arrow slider-arrow--next hidden md:block"
      >
        <span />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-[10px] md:gap-4 mt-[35px] md:mt-[60px]">
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!scrollRef.current) return
              const slide = scrollRef.current.querySelector<HTMLElement>("[data-slide]")
              if (!slide) return
              const slideWidth = slide.offsetWidth + 10
              scrollRef.current.scrollTo({ left: slideWidth * i, behavior: "smooth" })
            }}
            className={`bg-foreground transition-all duration-300 ${
              i === activeIndex
                ? "w-[18px] h-[18px] md:w-[23px] md:h-[23px]"
                : "w-[10px] h-[9px] md:w-[16px] md:h-[16px]"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
