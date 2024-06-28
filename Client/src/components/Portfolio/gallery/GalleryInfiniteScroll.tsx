import * as React from "react";
import {useEffect, useState} from "react";
import { Preloader } from "../../common/Preloader";
import {StyleType} from "../../../types/Types";
import {API_URL} from "../../../http";
import {NothingToShow} from "../../common/NothingToShow";
import {ImageFullView} from "../../common/ImageFullView";
import {getGallery} from "../../../redux/Gallery/gallery-reducer";
import {galleryApi} from "../../../redux/Gallery/GalleryApi";
import {useDispatch, useSelector} from "react-redux";
import {getGallerySelector, getTotalCountSelector} from "../../../redux/Gallery/gallery-selectors";

type PropsType = {
  fakeApi: boolean;
  activeStyle: StyleType;
  pageSize: number;
}

export const GalleryInfiniteScroll: React.FC<PropsType> = React.memo(({
  fakeApi,
  pageSize,
  activeStyle,
}) => {

  const gallery = useSelector(getGallerySelector);
  const totalCount = useSelector(getTotalCountSelector);
  const galleryRef = React.useRef(null);

  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {

    if (items.length >= totalCount) {
      return;
    }

    setIsLoading(true);
    setError(null);
    let nextPage = page + 1;

    try {
      const response = await galleryApi.getGalleryItems(activeStyle?._id, nextPage, pageSize);
      const data = response.gallery;

      setItems(prevItems => [...prevItems, ...data]);
      setPage(nextPage);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const rect = galleryRef.current.getBoundingClientRect();
    const isAtBottom = rect.bottom <= window.innerHeight;

    if (isAtBottom && !isLoading && items.length < totalCount) {
      fetchData();
    }
  };

  useEffect(() => {
    setItems([]);
    setPage(1);
    dispatch(getGallery(activeStyle?._id, 1, pageSize));
  }, [activeStyle, dispatch]);

  useEffect(() => {
    setItems(gallery);
  }, [gallery]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, items, totalCount]);

  const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});

  const GalleryItemsArray = items?.map((item, index) => {
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
      <section className="gallery page-block container" ref={galleryRef}>
        { items.length > 0
          ? (
              <>
                <ul className="gallery__list list">
                  { GalleryItemsArray }
                </ul>
                {isLoading && <Preloader/>}
                {error && <p>Error: {error.message}</p>}
              </>
            )
          : <NothingToShow/>
        }
        {  carouselData.isOpen &&
           <ImageFullView
              isOpen={carouselData.isOpen}
              gallery={items}
              activeIndex={carouselData.activeIndex}
              fakeApi={fakeApi}
              closeImg={()=>{setCarouselData({isOpen: false});}}
              imgUrl={`${API_URL}/gallery/`}
           />
        }
      </section>
  )
});
