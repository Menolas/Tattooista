import * as React from "react";
import AliceCarousel, { Responsive } from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

interface MyCarouselProps {
    items: React.ReactNode[];
    responsive: Responsive;
    controlsStrategy?: string;
    mouseTracking?: boolean;
    activeIndex?: number;
    disableDotsControls?: boolean;
}

export const MyCarousel: React.FC<MyCarouselProps> = React.memo(({
    items,
    responsive,
    controlsStrategy= "default",
    mouseTracking= true,
    activeIndex= 0,
    disableDotsControls= false,
}) => {
    return (
        <AliceCarousel
            items={items}
            responsive={responsive}
            controlsStrategy={controlsStrategy}
            mouseTracking={mouseTracking}
            activeIndex={activeIndex}
            disableDotsControls={disableDotsControls}
        />
    )
});
