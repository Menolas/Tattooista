import * as React from "react";
import { useEffect, useState } from "react";
import { Preloader } from "../common/Preloader";
import {GalleryItemType, TattooStyleType} from "../../types/Types";
import { ModalPopUp } from "../common/ModalPopUp";
import {API_URL} from "../../http";
import {Tooltip} from "react-tooltip";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {Paginator} from "../common/Paginator";
import {SuccessPopUp} from "../common/SuccessPopUp";
import {setIsSuccessAC} from "../../redux/Portfolio/portfolio-reducer";
import {useDispatch} from "react-redux";
import {UpdateGalleryItemForm} from "../Forms/UpdateGalleryItemForm";
import {NothingToShow} from "../common/NothingToShow";
import {GalleryUploadForm} from "../Forms/GalleryUploadForm";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {ImageFullView} from "../common/ImageFullView";

type PropsType = {
  fakeApi: boolean
  isSuccess: boolean
  isAuth: string
  isFetching: boolean
  totalCount: number
  pageSize: number
  currentPage: number
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  isDeletingInProcess: Array<string>
  tattooStyles: Array<TattooStyleType>
  updateGallery: (style: string, values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentPage: (page: number) => void
  setPageSize: (limit: number) => void
  archiveGalleryItem: (id: string) => void
  setIsSuccess: (bol: boolean) => void
  updateGalleryItem: (id: string, values: object) => void
}

export const Gallery: React.FC<PropsType> = React.memo(({
  fakeApi,
  isSuccess,
  isAuth,
  isFetching,
  activeStyle,
  totalCount,
  pageSize,
  currentPage,
  gallery,
  isDeletingInProcess,
  tattooStyles,
  setCurrentPage,
  setPageSize,
  updateGallery,
  deleteGalleryItem,
  archiveGalleryItem,
  setIsSuccess,
  updateGalleryItem
}) => {
  //debugger

  const [bigImg, setBigImg] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ editGalleryMode, setEditGalleryMode] = useState(false);
  const [ editGalleryItem, setEditGalleryItem ] = useState(null);
  const successPopUpContent = `You successfully added images to ${activeStyle?.value} style gallery`;


  const dispatch = useDispatch();

  const showBigImg = (fileName) => {
      setBigImg(fileName);
  }

  const closeBigImg = () => {
    setBigImg('');
  }

  const openEditGalleryForm = () => {
    setEditGalleryMode(true);
  }

  const closeEditGalleryForm = () => {
    setEditGalleryMode(false);
  }

  const closeGalleryItemEditModal = () => {
    setEditGalleryItem(null);
  }

  const closeSuccessModalCallBack = () => {
    setIsSuccess(false);
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout( () => {
        dispatch(setIsSuccessAC(false));
      }, 2000);
    }
  }, [isSuccess]);

  const modalTitle = `Update you gallery for ${activeStyle?.value}`;

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
              console.log("click on gallery element!!!!!!!!!")
              showBigImg(item.fileName);
              setActiveIndex(index);
            }}
            style={{ backgroundImage: `url(${GalleryImgUrl})` }}
          >
            {''}
          </div>
          {(isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
            <div className={"gallery__item-actions"}>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Edit gallery item"
                  className={"btn btn--icon"}
                  onClick={() => { setEditGalleryItem(item); }}
              >
                  <svg><use href={`${Sprite}#edit`}/></svg>
              </button>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Move gallery item to archive"
                  className={"btn btn--icon"}
                  disabled={isDeletingInProcess?.some(id => id === item._id)}
                  onClick={() => { archiveGalleryItem(item._id); }}
              >
                  <svg><use href={`${Sprite}#archive`}/></svg>
              </button>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Delete gallery item"
                  className={"btn btn--icon"}
                  disabled={isDeletingInProcess?.some(id => id === item._id)}
                  onClick={() => {deleteGalleryItem(item._id)}}
              >
                  <svg><use href={`${Sprite}#trash`}/></svg>
              </button>
            </div>
          }

        </li>
    );
  });

  return (
      <section className="gallery page-block container">
        <div className={"gallery__header"}>
          <Paginator
            totalCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChanged={setCurrentPage}
            setPageLimit={setPageSize}
          />
          { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
              <button
                  className={"btn btn--light-bg btn--sm add-btn"}
                  onClick={openEditGalleryForm}
              >
                  Add Tattoos
              </button>
          }
        </div>
        {  isFetching
            ? <Preloader />
            : totalCount && totalCount > 0
              ? (
                    <ul className="gallery__list list">
                      { GalleryItemsArray }
                    </ul>
                )
              : <NothingToShow/>
        }
        {  bigImg &&
           <ImageFullView
              isOpen={bigImg}
              gallery={gallery}
              activeIndex={activeIndex}
              fakeApi={fakeApi}
              imgUrl={bigImg}
              imgAlt={activeStyle.value}
              closeImg={closeBigImg}
           />
        }
        <ModalPopUp
            isOpen={editGalleryItem}
            closeModal={closeGalleryItemEditModal}
            modalTitle={'Update tattoo styles for this image'}
        >
          <UpdateGalleryItemForm
              folder={'gallery'}
              galleryItem={editGalleryItem}
              styles={tattooStyles}
              updateGalleryItem={updateGalleryItem}
              closeModal={closeGalleryItemEditModal}
          />
        </ModalPopUp>
        <ModalPopUp
            isOpen={editGalleryMode}
            closeModal={closeEditGalleryForm}
            modalTitle={modalTitle}
        >
          <GalleryUploadForm
              updateId={activeStyle?._id}
              updateGallery={updateGallery}
              closeModal={closeEditGalleryForm}
          />
        </ModalPopUp>
        {  isSuccess &&
            <SuccessPopUp
                isOpen={isSuccess}
                closeModal={closeSuccessModalCallBack}
                content={successPopUpContent}
            />
        }
        <Tooltip id="my-tooltip" />
      </section>
  )
})
