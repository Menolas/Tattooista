import * as React from "react";
import {useEffect, useRef} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
import { Swiper as SwiperClass } from 'swiper';
import { Navigation } from 'swiper/modules';

interface SwiperBreakpointOptions {
    slidesPerView?: number;
    spaceBetween?: number;
}

type Breakpoints = {
    [width: number]: SwiperBreakpointOptions;
};

type PropsType = {
    items: JSX.Element[];
    spaceBetween?: number;
    activeIndex?: number;
    breakpoints?: Breakpoints;
}
export const Slider: React.FC<PropsType> = ({
    items,
    spaceBetween= 10,
    activeIndex= 0,
    breakpoints,
 }) => {

    const swiperRef = useRef<SwiperCore | null>(null);

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
        );
    });

    return (
        <div className="swiper-wrap">
            <Swiper
                spaceBetween={spaceBetween}
                slidesPerView={6}
                navigation={true}
                modules={[Navigation]}
                pagination={{ clickable: true }}
                onSlideChange={() => {
                    //console.log('slide change');
                }}
                onSwiper={(swiper: SwiperClass) => swiperRef.current = swiper}
                breakpoints={breakpoints}
            >
                {slides}
            </Swiper>
        </div>
    );
};
