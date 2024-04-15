import {API_URL} from "../../http";
import * as React from "react";
import AliceCarousel from "react-alice-carousel";
import {GalleryItemType} from "../../types/Types";

type PropsType = {
    isOpen: boolean
    clientId?: string
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
    gallery,
    activeIndex= 0,
    fakeApi,
    closeImg
}) => {

    const sliders = gallery.map(item => {
        let GalleryImgUrl;
        if (clientId) {
            GalleryImgUrl = `${API_URL}/clients/${clientId}/doneTattooGallery/${item}`;
        } else {
            GalleryImgUrl = fakeApi
                ? `./uploads/gallery/${item.fileName}`
                : `${API_URL}/gallery/${item.fileName}`;
        }


        return (
            <div
                className={"image-full-view__img slider"}
                style={{backgroundImage: `url(${GalleryImgUrl})`}}
            >{''}</div>
        )
    })
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
                <AliceCarousel
                    items={sliders}
                    activeIndex={activeIndex}
                    responsive={responsive}
                    controlsStrategy={"default"}
                    mouseTracking
                    disableDotsControls={true}
                />
            </div>
        </div>
    )
}
