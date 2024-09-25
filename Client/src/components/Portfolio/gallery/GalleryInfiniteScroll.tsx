import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import { Preloader } from "../../common/Preloader";
import {GalleryItemType, StyleType} from "../../../types/Types";
import {API_URL} from "../../../http";
import {NothingToShow} from "../../common/NothingToShow";
import {ImageFullView} from "../../common/ImageFullView";
import {getGallery} from "../../../redux/Gallery/gallery-reducer";
import {galleryApi} from "../../../redux/Gallery/GalleryApi";
import {useDispatch, useSelector} from "react-redux";
import {getGallerySelector, getTotalCountSelector} from "../../../redux/Gallery/gallery-selectors";
import {ApiError} from "../../common/ApiError";

type PropsType = {
  activeStyle: StyleType;
  pageSize: number;
  apiError: null | string;
}

type ErrorType = {
  message: string;
};

export const GalleryInfiniteScroll: React.FC<PropsType> = React.memo(({
  pageSize,
  activeStyle,
  apiError,
}) => {


  const gallery = useSelector(getGallerySelector);
  const totalCount = useSelector(getTotalCountSelector);
  const galleryRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const [items, setItems] = useState<GalleryItemType[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  const fetchData = useCallback(async () => {

    if (items.length >= totalCount) {
      return;
    }

    setIsLoading(true);
    setError(null);
    const nextPage = page + 1;

    try {
      const response = await galleryApi.getGalleryItems(activeStyle?._id, nextPage, pageSize);
      const data = response.gallery;

      setItems(prevItems => [...prevItems, ...data]);
      setPage(nextPage);
    } catch (error) {
      setError({ message: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  }, [activeStyle, items, totalCount, page, pageSize]);

  const handleScroll = useCallback(() => {
    if (galleryRef.current) {
      const rect = galleryRef.current.getBoundingClientRect();
      const isAtBottom = rect.bottom <= window.innerHeight;

      if (isAtBottom && !isLoading && items.length < totalCount) {
        fetchData();
      }
    }
  }, [isLoading, items, totalCount, fetchData]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    dispatch(getGallery(activeStyle?._id, 1, pageSize));
  }, [activeStyle, dispatch, pageSize]);

  useEffect(() => {
    setItems(gallery);
  }, [gallery]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, items, totalCount, handleScroll]);

  const [carouselData, setCarouselData] = useState<{
    isOpen: boolean,
    activeIndex?: number
  }>({isOpen: false});

  const GalleryItemsArray = items?.map((item, index) => {
    const GalleryImgUrl = `${API_URL}/gallery/${item.fileName}`;

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
      <section className="gallery page-block container" ref={galleryRef}>
        { items && items.length > 0
          ? (
              <>
                <ul className="gallery__list list">
                  { GalleryItemsArray }
                </ul>
                {isLoading && <Preloader/>}
                {error && <p>Error: {error.message}</p>}
              </>
            )
          : apiError
            ? <ApiError />
            : <NothingToShow/>
        }
        {carouselData.isOpen &&
            <ImageFullView
              isOpen={carouselData.isOpen}
              gallery={items}
              activeIndex={carouselData.activeIndex}
              closeImg={()=>{setCarouselData({isOpen: false});}}
              imgUrl={`${API_URL}/gallery/`}
           />
        }
      </section>
  );
});

GalleryInfiniteScroll.displayName = 'GalleryInfiniteScroll';
