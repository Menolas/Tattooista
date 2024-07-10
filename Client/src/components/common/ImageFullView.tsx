import {API_URL} from "../../http";
import * as React from "react";
import {GalleryItemType} from "../../types/Types";
import {MyCarousel} from "./MyCarousel";

type PropsType = {
    isOpen: boolean;
    clientId?: string;
    gallery: Array<GalleryItemType> | Array<string>;
    activeIndex?: number;
    fakeApi?: boolean;
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
    fakeApi,
    closeImg,
    imgUrl,
}) => {

    const sliders = gallery.map(item => {
        let GalleryImgUrl = !fakeApi
            ? clientId
                ? `${imgUrl}${item}`
                : `${imgUrl}${item.fileName}`
            : `./uploads/gallery/${item.fileName}`;

        return (
            <Slider  GalleryImgUrl={ GalleryImgUrl}/>
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
                    items={sliders}
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

const Slider = ({GalleryImgUrl}) => {
    return (
        <div
            className={"image-full-view__img slider"}
            style={{backgroundImage: `url(${GalleryImgUrl})`}}
        >{''}</div>
    );
};
