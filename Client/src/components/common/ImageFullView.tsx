import {API_URL} from "../../http";
import * as React from "react";
import {GalleryItemType} from "../../types/Types";
import {MyCarousel} from "./MyCarousel";

type PropsType = {
    isOpen: boolean
    clientId?: string
    archive?: boolean
    gallery: Array<GalleryItemType> | Array<string>
    activeIndex?: number
    fakeApi?: boolean
    closeImg: () => void
}

const responsive = {
    0: { items: 1 },
    600: { items: 1 },
    900: { items: 1 },
    1400: { items: 1 },
}

export const ImageFullView: React.FC<PropsType> = ({
    isOpen,
    clientId,
    archive,
    gallery,
    activeIndex= 0,
    fakeApi,
    closeImg
}) => {

    const sliders = gallery.map(item => {
        let GalleryImgUrl;
        if (clientId) {
            GalleryImgUrl = !archive
                ? `${API_URL}/clients/${clientId}/doneTattooGallery/${item}`
                : `${API_URL}/archivedClients/${clientId}/doneTattooGallery/${item}`;
        } else {
            GalleryImgUrl = fakeApi
                ? `./uploads/gallery/${item.fileName}`
                : `${API_URL}/gallery/${item.fileName}`;
        }


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
    )
}

const Slider = ({GalleryImgUrl}) => {
    return (
        <div
            className={"image-full-view__img slider"}
            style={{backgroundImage: `url(${GalleryImgUrl})`}}
        >{''}</div>
    )
}
