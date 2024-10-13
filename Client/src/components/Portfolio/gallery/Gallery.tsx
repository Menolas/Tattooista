import * as React from "react";
import {useEffect, useState} from "react";
import { Preloader } from "../../common/Preloader";
import {GalleryItemType, StyleType} from "../../../types/Types";
import { ModalPopUp } from "../../common/ModalPopUp";
import {API_URL} from "../../../http";
import {Tooltip} from "react-tooltip";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as ArchiveIcon} from "../../../assets/svg/archive.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {Paginator} from "../../common/Paginator";
import {UpdateGalleryItemForm} from "../../Forms/UpdateGalleryItemForm";
import {NothingToShow} from "../../common/NothingToShow";
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";
import {ImageFullView} from "../../common/ImageFullView";
import {Confirmation} from "../../common/Confirmation";
import {useDispatch, useSelector} from "react-redux";
import {archiveGalleryItem, deleteGalleryItem, getGallery} from "../../../redux/Gallery/gallery-reducer";
import {getGallerySelector} from "../../../redux/Gallery/gallery-selectors";
import {ApiError} from "../../common/ApiError";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";

type PropsType = {
  isFetching: boolean;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  activeStyle: StyleType;
  isDeletingInProcess: Array<string>;
  styles: Array<StyleType>;
  apiError: null | string;
  setPage: (page: number) => void;
  setPageSize: (limit: number) => void;
  setApiError: () => void;
}

export const Gallery: React.FC<PropsType> = React.memo(({
  isFetching,
  activeStyle,
  totalCount,
  pageSize,
  currentPage,
  isDeletingInProcess,
  styles,
  apiError,
  setPage,
  setPageSize,
  setApiError,
}) => {
  const token = useSelector(getTokenSelector);
  const gallery = useSelector(getGallerySelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGallery(activeStyle?._id, currentPage, pageSize));
  }, [activeStyle?._id, currentPage, pageSize, dispatch]);

  const deleteGalleryItemCallBack = (itemId: string) => {
    dispatch(deleteGalleryItem(token, itemId, gallery, currentPage, pageSize, activeStyle));
  };

  const archiveGalleryItemCallBack = (itemId: string) => {
    dispatch(archiveGalleryItem(token, itemId, gallery, currentPage, pageSize, activeStyle));
  }

  const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});
  const [galleryItem, setGalleryItem] = useState<GalleryItemType | null>(null);
  const [editGalleryMode, setEditGalleryMode] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    needConfirmation: boolean,
    itemId?: string,
    cb?: () => void,
    context: string
  }>({needConfirmation: false, context: ''});

  const closeEditGalleryForm = () => {
    setEditGalleryMode(false);
    setApiError();
  };

  const closeGalleryItemEditModal = () => {
    setGalleryItem(null);
    setEditGalleryMode(false);
    setApiError();
  };

  const closeModal = () => {
    setConfirmationData({needConfirmation: false, context: ''});
  };

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
                onClick={() => {
                    setGalleryItem(item);
                }}
            >
                <EditIcon/>
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
                    cb: () => archiveGalleryItemCallBack(item._id)
                  });
                }}
            >
                <ArchiveIcon/>
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
                    cb: () => deleteGalleryItemCallBack(item._id)
                  });
                }}
            >
                <TrashIcon/>
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
              onClick={() => setEditGalleryMode(true)}
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
          : apiError
                ? <ApiError message={apiError} />
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
            isOpen={!!galleryItem || editGalleryMode}
            modalTitle={ galleryItem
                ? 'Update tattoo styles for this image'
                : `Update you gallery for ${activeStyle?.value}`
            }
            closeModal={() => {
                closeGalleryItemEditModal();
                closeEditGalleryForm();
            }}
        >
          {  galleryItem &&
              <UpdateGalleryItemForm
                  apiError={apiError}
                  folder={'gallery'}
                  galleryItem={galleryItem}
                  styles={styles}
                  activeStyleId={activeStyle._id}
                  closeModal={closeGalleryItemEditModal}
              />
          }
          {  editGalleryMode &&
              <GalleryUploadForm
                  apiError={apiError}
                  styleID={activeStyle._id}
                  isEditPortfolio={true}
                  closeModal={closeEditGalleryForm}
              />
          }
        </ModalPopUp>
        <Confirmation
            isOpen={confirmationData.needConfirmation}
            content={confirmationData.context}
            confirm={() => {
                if (confirmationData.cb) {
                    confirmationData.cb();
                } else {
                    console.error("Item ID is undefined or callback function is not provided.");
                }
            }}
            cancel={closeModal}
        />
        <Tooltip id="my-tooltip" />
      </section>
  );
});

Gallery.displayName = 'Gallery';
