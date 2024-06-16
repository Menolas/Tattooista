import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import * as React from "react";
import {useEffect, useRef} from "react";

type PropsType = {
    items: JSX.Element[];
    spaceBetween?: number;
    activeIndex?: number;
    breakpoints?: any;
}
export const Slider: React.FC<PropsType> = ({
    items,
    spaceBetween= 10,
    activeIndex= 0,
    breakpoints,
 }) => {

    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(activeIndex);
        }
    }, [activeIndex]);

    const slides = items?.map((slide, index) => {
        return (
            <SwiperSlide key={index}>
                {slide}
            </SwiperSlide>
        )
    });

    return (
        <Swiper
            spaceBetween={spaceBetween}
            slidesPerView={6}
            onSlideChange={() => {
                //console.log('slide change');
            }}
            onSwiper={(swiper) => swiperRef.current = swiper}
            breakpoints={breakpoints}
        >
            {slides}
        </Swiper>
    )
}
