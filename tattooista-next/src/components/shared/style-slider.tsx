"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import type { Swiper as SwiperClass } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "@/styles/swiper-overrides.css"

type StyleItem = {
  id: string
  value: string
  nonStyle: boolean
}

type Props = {
  styles: StyleItem[]
  activeStyleId: string | null
}

const breakpoints = {
  0: {
    slidesPerView: 3,
  },
  900: {
    slidesPerView: 4,
  },
  1400: {
    slidesPerView: 6,
  },
}

export function StyleSlider({ styles, activeStyleId }: Props) {
  const swiperRef = useRef<SwiperClass | null>(null)

  const activeIndex = styles.findIndex((s) => s.id === activeStyleId)

  useEffect(() => {
    if (swiperRef.current && activeIndex >= 0) {
      swiperRef.current.slideTo(activeIndex)
    }
  }, [activeIndex])

  return (
    <div className="swiper-wrap mt-8">
      <Swiper
        spaceBetween={10}
        slidesPerView={6}
        navigation
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        breakpoints={breakpoints}
      >
        {styles.map((style) => (
          <SwiperSlide key={style.id}>
            <Link
              href={`/portfolio?style=${style.id}`}
              className={`flex items-center justify-center shrink-0 px-2 md:px-6 py-2 max-w-full text-lg md:text-[28px] font-semibold overflow-hidden border-2 cursor-pointer no-underline transition-all duration-300 ${
                activeStyleId === style.id
                  ? "bg-foreground text-background border-foreground hover:bg-foreground hover:text-background"
                  : "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize">
                {style.value}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
