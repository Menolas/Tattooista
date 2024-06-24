import * as React from "react";
import {useEffect, useState} from "react";
import { Preloader } from "../../common/Preloader";
import {GalleryItemType, StyleType} from "../../../types/Types";
import { ModalPopUp } from "../../common/ModalPopUp";
import {API_URL} from "../../../http";
import {Tooltip} from "react-tooltip";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {Paginator} from "../../common/Paginator";
import {UpdateGalleryItemForm} from "../../Forms/UpdateGalleryItemForm";
import {NothingToShow} from "../../common/NothingToShow";
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";
import {ImageFullView} from "../../common/ImageFullView";
import {Confirmation} from "../../common/Confirmation";
import {useDispatch} from "react-redux";

type PropsType = {
  isFetching: boolean;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  activeStyle: StyleType;
  gallery: Array<GalleryItemType>;
  isDeletingInProcess: Array<string>;
  styles: Array<StyleType>;
  apiError: null | string;
  remove: (itemId: string) => void;
  setPage: (page: number) => void;
  setPageSize: (limit: number) => void;
  archive: (id: string) => void;
}

export const Gallery: React.FC<PropsType> = React.memo(({
  isFetching,
  activeStyle,
  totalCount,
  pageSize,
  currentPage,
  gallery,
  isDeletingInProcess,
  styles,
  apiError,
  setPage,
  setPageSize,
  remove,
  archive,
}) => {

  const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});
  const [galleryItem, setGalleryItem] = useState(null);
  const [editGalleryMode, setEditGalleryMode] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    needConfirmation: boolean,
    itemId?: string,
    cb?: () => void,
    context: string
  }>({needConfirmation: false, context: ''});

  const openEditGalleryForm = () => {
    setEditGalleryMode(true);
  }

  const closeEditGalleryForm = () => {
    setEditGalleryMode(false);
  }

  const closeGalleryItemEditModal = () => {
    setGalleryItem(null);
    setEditGalleryMode(false);
  }

  const closeModal = () => {
    setConfirmationData({needConfirmation: false, context: ''});
  }

  const GalleryItemsArray = gallery?.map((item, index) => {
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
          <div className={"gallery__item-actions"}>
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Edit gallery item"
                className={"btn btn--icon"}
                onClick={() => { setGalleryItem(item); }}
            >
                <svg><use href={`${Sprite}#edit`}/></svg>
            </button>
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Move gallery item to archive"
                className={"btn btn--icon"}
                disabled={isDeletingInProcess?.some(id => id === item._id)}
                onClick={() => {
                  setConfirmationData({
                    needConfirmation: true,
                    itemId: item._id,
                    context: 'Are you sure? You about to archive this image.',
                    cb: () => archive(item._id)
                  });
                }}
            >
                <svg><use href={`${Sprite}#archive`}/></svg>
            </button>
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Delete gallery item"
                className={"btn btn--icon"}
                disabled={isDeletingInProcess?.some(id => id === item._id)}
                onClick={() => {
                  setConfirmationData({
                    needConfirmation: true,
                    itemId: item._id,
                    context: 'Are you sure? You about to delete this image.',
                    cb: () => remove(item._id)
                  });
                }}
            >
                <svg><use href={`${Sprite}#trash`}/></svg>
            </button>
          </div>
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
            onPageChanged={setPage}
            setPageLimit={setPageSize}
          />
          <button
              className={"btn btn--light-bg btn--sm add-btn"}
              onClick={openEditGalleryForm}
          >
              Add Tattoos
          </button>
        </div>
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
              closeImg={()=>{setCarouselData({isOpen: false});}}
              imgUrl={`${API_URL}/gallery/`}
           />
        }
        <ModalPopUp
            isOpen={galleryItem || editGalleryMode}
            closeModal={closeGalleryItemEditModal}
            modalTitle={ galleryItem
                         ? 'Update tattoo styles for this image'
                         : `Update you gallery for ${activeStyle?.value}`
            }
        >
          {  galleryItem &&
              <UpdateGalleryItemForm
                  folder={'gallery'}
                  galleryItem={galleryItem}
                  styles={styles}
                  activeStyleId={activeStyle._id}
                  closeModal={closeGalleryItemEditModal}
              />
          }
          {  editGalleryMode &&
              <GalleryUploadForm
                  styleID={activeStyle._id}
                  isEditPortfolio={true}
                  closeModal={closeEditGalleryForm}
              />
          }
        </ModalPopUp>
        <Confirmation
            isOpen={confirmationData.needConfirmation}
            content={confirmationData.context}
            confirm={() => confirmationData.cb()}
            cancel={closeModal}
        />
        <Tooltip id="my-tooltip" />
      </section>
  )
});
