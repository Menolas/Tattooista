import * as React from "react";
import {useEffect, useState} from "react";
import { Preloader } from "../../common/Preloader";
import {GalleryItemType, StyleType} from "../../../types/Types";
import {API_URL} from "../../../http";
import {NothingToShow} from "../../common/NothingToShow";
import {ImageFullView} from "../../common/ImageFullView";
import {getGallery} from "../../../redux/Gallery/gallery-reducer";
import {galleryApi} from "../../../redux/Gallery/GalleryApi";

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

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await galleryApi.getGalleryItems(activeStyle?._id, page, pageSize);
      const data = response.gallery;

      setItems(prevItems => [...prevItems, ...data]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
      return;
    }
    fetchData();
  };

  useEffect(() => {
    setItems([]);
    fetchData();
  }, [activeStyle]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

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
      <section className="gallery page-block container">
        { items.length > 0
          ? (
              <>
                <ul className="gallery__list list">
                  { GalleryItemsArray }
                </ul>
                {isLoading && <p>Loading...</p>}
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
