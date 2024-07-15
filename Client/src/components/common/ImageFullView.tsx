import * as React from "react";
import {GalleryItemType} from "../../types/Types";
import {MyCarousel} from "./MyCarousel";

type SliderProps = {
    GalleryImgUrl: string;
};

type PropsType = {
    isOpen: boolean;
    clientId?: string;
    gallery: Array<GalleryItemType> | Array<string>;
    activeIndex?: number;
    closeImg: () => void;
    imgUrl?: string | undefined;
};

const responsive = {
    0: { items: 1 },
    600: { items: 1 },
    900: { items: 1 },
    1400: { items: 1 },
};

export const ImageFullView: React.FC<PropsType> = React.memo(({
    isOpen,
    clientId,
    gallery,
    activeIndex= 0,
    closeImg,
    imgUrl,
}) => {

    const slides = gallery.map((item, index) => {
        let GalleryImgUrl = "";
        if (clientId && typeof item === 'string') GalleryImgUrl = `${imgUrl}${item}`;
        if (!clientId && typeof item !== 'string') GalleryImgUrl = `${imgUrl}${item.fileName}`;

        return (
            <Slide key={index} GalleryImgUrl={GalleryImgUrl}/>
        )
    });

    return (
        <div className={ !isOpen ? "image-full-view gallery__large-wrap modal-wrap" : "image-full-view gallery__large-wrap modal-wrap open" }
        >
            <button
                className="closing-btn image-full-view__closing-btn gallery__item-close-btn"
                onClick={() => { closeImg() }}
            >
                <span>{''}</span>
            </button>
            <div className="image-full-view__inner-wrap gallery__large">
                <MyCarousel
                    items={slides}
                    responsive={responsive}
                    activeIndex={activeIndex}
                    controlsStrategy={"default"}
                    mouseTracking={true}
                    disableDotsControls={true}
                />
            </div>
        </div>
    );
});

const Slide = ({GalleryImgUrl}: SliderProps) => {
    return (
        <div
            className={"image-full-view__img slider"}
            style={{backgroundImage: `url(${GalleryImgUrl})`}}
        >{''}</div>
    );
};

ImageFullView.displayName = 'ImageFullView';
