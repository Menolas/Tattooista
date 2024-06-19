import * as React from "react";
import { useState } from "react";
import { Preloader } from "../../common/Preloader";
import {GalleryItemType} from "../../../types/Types";
import {API_URL} from "../../../http";
import {NothingToShow} from "../../common/NothingToShow";
import {ImageFullView} from "../../common/ImageFullView";

type PropsType = {
  fakeApi: boolean;
  isFetching: boolean;
  totalCount: number;
  currentPage: number;
  gallery: Array<GalleryItemType>;
  apiError: null | string;
  setCurrentPage: (page: number) => void;
}

export const GalleryInfiniteScroll: React.FC<PropsType> = React.memo(({
  fakeApi,
  isFetching,
  totalCount,
  currentPage,
  gallery,
  apiError,
  setCurrentPage,
}) => {

  const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});

  const GalleryItemsArray = gallery?.map((item, index) => {
    const GalleryImgUrl = fakeApi
        ? `./uploads/gallery/${item.fileName}`
        : `${API_URL}/gallery/${item.fileName}`;

    return (
        <li
            key={item._id}
            className="gallery__item"
        >
          <div
            className={"gallery__img-wrap"}
            onClick={() => {
              setCarouselData({isOpen: true, activeIndex: index});
            }}
            style={{ backgroundImage: `url(${GalleryImgUrl})` }}
          >
            {''}
          </div>
        </li>
    );
  });

  return (
      <section className="gallery page-block container">
        { totalCount && totalCount > 0
          ? (
                <ul className="gallery__list list">
                  { isFetching ? <Preloader /> : GalleryItemsArray }
                </ul>
            )
          : <NothingToShow/>
        }
        {  carouselData.isOpen &&
           <ImageFullView
              isOpen={carouselData.isOpen}
              gallery={gallery}
              activeIndex={carouselData.activeIndex}
              fakeApi={fakeApi}
              closeImg={()=>{setCarouselData({isOpen: false});}}
              imgUrl={`${API_URL}/gallery/`}
           />
        }
      </section>
  )
});
