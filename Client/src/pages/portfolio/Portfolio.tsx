import * as React from "react";
import { Gallery } from "../../components/Portfolio/Gallery";
import { TattooStyles } from "../../components/Portfolio/TattooStyles";
import { GalleryItemType, TattooStyleType} from "../../types/Types";
import {ApiErrorMessage} from "../../components/common/ApiErrorMessage";
import {SuccessModalType} from "../../redux/Portfolio/portfolio-reducer";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useEffect} from "react";

type PropsType = {
  fakeApi: boolean
  isAuth: string
  isFetching: boolean
  totalCount: number
  pageSize: number
  currentPage: number
  isDeletingInProcess: Array<string>
  tattooStyles: Array<TattooStyleType>
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  successModal: SuccessModalType
  apiError: string
  setPageSize: (pageSize: number) => void
  updateGallery: (values: FormData) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentPage: (page: number) => void
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (vid: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  archiveGalleryItem: (id: string) => void
  setSuccessModal: () => void
  setApiError: () => void
  updateGalleryItem: (id: string, values: object) => void
}

export const Portfolio: React.FC<PropsType> = ({
  fakeApi,
  isAuth,
  isFetching,
  totalCount,
  pageSize,
  currentPage,
  isDeletingInProcess,
  tattooStyles,
  activeStyle,
  gallery,
  successModal,
  apiError,
  setPageSize,
  updateGallery,
  deleteGalleryItem,
  setCurrentPage,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  archiveGalleryItem,
  setSuccessModal,
  setApiError,
  updateGalleryItem
}) => {

  useEffect(() => {
    if (successModal.isSuccess) {
      setTimeout( () => {
        setSuccessModal();
      }, 3000);
    }
  }, [successModal]);

  return (
    <div>
      <TattooStyles
        isAuth={isAuth}
        tattooStyles={tattooStyles}
        activeStyle={activeStyle}
        resetActiveStyle={resetActiveStyle}
        addTattooStyle={addTattooStyle}
        editTattooStyle={editTattooStyle}
        deleteTattooStyle={deleteTattooStyle}
      />

      <Gallery
        fakeApi={fakeApi}
        isAuth={isAuth}
        isFetching={isFetching}
        activeStyle={activeStyle}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        gallery={gallery}
        tattooStyles={tattooStyles}
        updateGallery={updateGallery}
        deleteGalleryItem={deleteGalleryItem}
        archiveGalleryItem={archiveGalleryItem}
        isDeletingInProcess={isDeletingInProcess}
        updateGalleryItem={updateGalleryItem}
      />
      <SuccessPopUp
          isOpen={successModal.isSuccess}
          closeModal={setSuccessModal}
          content={successModal.successText}
      />
      <ApiErrorMessage
          isOpen={!!apiError}
          error={apiError}
          closeModal={setApiError}
      />
    </div>
  );
}
