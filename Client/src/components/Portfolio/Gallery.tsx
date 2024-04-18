import * as React from "react";
import { useState } from "react";
import { Preloader } from "../common/Preloader";
import {GalleryItemType, TattooStyleType} from "../../types/Types";
import { ModalPopUp } from "../common/ModalPopUp";
import {API_URL} from "../../http";
import {Tooltip} from "react-tooltip";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {Paginator} from "../common/Paginator";
import {UpdateGalleryItemForm} from "../Forms/UpdateGalleryItemForm";
import {NothingToShow} from "../common/NothingToShow";
import {GalleryUploadForm} from "../Forms/GalleryUploadForm";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {ImageFullView} from "../common/ImageFullView";
import {Confirmation} from "../common/Confirmation";

type PropsType = {
  fakeApi: boolean
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
  updateGalleryItem: (id: string, values: object) => void
}

export const Gallery: React.FC<PropsType> = React.memo(({
  fakeApi,
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
  updateGalleryItem
}) => {

  const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});
  const [ editGalleryMode, setEditGalleryMode ] = useState(false);
  const [ editGalleryItem, setEditGalleryItem ] = useState(null);
  const [confirmationData, setConfirmationData] = useState<{needConfirmation: boolean, itemId?: string}>({
    needConfirmation: false,
  });
  const [confirmationForArchivingData, setConfirmationForArchivingData] = useState<{needConfirmation: boolean, itemId?: string}>({
    needConfirmation: false,
  });

  const openEditGalleryForm = () => {
    setEditGalleryMode(true);
  }

  const closeEditGalleryForm = () => {
    setEditGalleryMode(false);
  }

  const closeGalleryItemEditModal = () => {
    setEditGalleryItem(null);
    setEditGalleryMode(false);
  }

  const closeConfirmationModalCallBack = () => {
    setConfirmationData({ needConfirmation: false });
    setConfirmationForArchivingData({needConfirmation: false});
  }

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
                  onClick={() => {
                    setConfirmationForArchivingData({needConfirmation: true, itemId: item._id});
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
                    setConfirmationData({ needConfirmation: true, itemId: item._id });
                  }}
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
        {  carouselData.isOpen &&
           <ImageFullView
              isOpen={carouselData.isOpen}
              gallery={gallery}
              activeIndex={carouselData.activeIndex}
              fakeApi={fakeApi}
              closeImg={()=>{setCarouselData({isOpen: false});}}
           />
        }
        <ModalPopUp
            isOpen={editGalleryItem || editGalleryMode}
            closeModal={closeGalleryItemEditModal}
            modalTitle={ editGalleryItem
                         ? 'Update tattoo styles for this image'
                         : `Update you gallery for ${activeStyle?.value}`
            }
        >
          {  editGalleryItem &&
              <UpdateGalleryItemForm
                  folder={'gallery'}
                  galleryItem={editGalleryItem}
                  styles={tattooStyles}
                  updateGalleryItem={updateGalleryItem}
                  closeModal={closeGalleryItemEditModal}
              />
          }
          {  editGalleryMode &&
              <GalleryUploadForm
                  updateId={activeStyle?._id}
                  updateGallery={updateGallery}
                  closeModal={closeEditGalleryForm}
              />
          }
        </ModalPopUp>
        <ModalPopUp
            isOpen={confirmationData.needConfirmation || confirmationForArchivingData.needConfirmation}
            modalTitle={''}
            closeModal={closeConfirmationModalCallBack}
        >
          { confirmationData.needConfirmation &&
              <Confirmation
                  content={'Are you sure? You about to delete this gallery image FOREVER...'}
                  confirm={() => {deleteGalleryItem(confirmationData.itemId)}}
                  cancel={closeConfirmationModalCallBack}
              />
          }
          { confirmationForArchivingData.needConfirmation &&
              <Confirmation
                  content={'Are you sure? You about to move this gallery image to archive.'}
                  confirm={() => {archiveGalleryItem(confirmationForArchivingData.itemId)}}
                  cancel={closeConfirmationModalCallBack}
              />
          }
        </ModalPopUp>
        <Tooltip id="my-tooltip" />
      </section>
  )
})
