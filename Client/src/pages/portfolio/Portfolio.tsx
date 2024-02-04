import * as React from "react"
import { Advertisement } from "../../components/Portfolio/Advertisement"
import { Gallery } from "../../components/Portfolio/Gallery"
import { TattooStyles } from "../../components/Portfolio/TattooStyles"
import { BookConsultationFormValues, GalleryItemType, TattooStyleType} from "../../types/Types"
import {ApiErrorMessage} from "../../components/common/ApiErrorMessage"

type PropsType = {
  fakeApi: boolean
  isAuth: boolean
  isFetching: boolean
  totalCount: number
  pageSize: number
  currentPage: number
  isDeletingInProcess: Array<string>
  tattooStyles: Array<TattooStyleType>
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  isSuccess: boolean
  bookingConsultationApiError: string
  updateTattooStyleApiError: string
  updateGalleryApiError: string
  setPageSize: (pageSize: number) => void
  bookConsultation: (values: BookConsultationFormValues) => void
  updateGallery: (style: string, values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentPage: (page: number) => void
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (vid: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  archiveGalleryItem: (id: string) => void
  setIsSuccess: (bol: boolean) => void
  setBookingConsultationApiError: (error: string) => void
  setUpdateTattooStyleApiError: (error: string) => void
  setUpdateGalleryApiError: (error:string) => void
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
  isSuccess,
  bookingConsultationApiError,
  updateTattooStyleApiError,
  updateGalleryApiError,
  setPageSize,
  bookConsultation,
  updateGallery,
  deleteGalleryItem,
  setCurrentPage,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  archiveGalleryItem,
  setIsSuccess,
  setBookingConsultationApiError,
  setUpdateTattooStyleApiError,
  setUpdateGalleryApiError,
  updateGalleryItem
}) => {

  return (
    <div>
      <TattooStyles
        isAuth={isAuth}
        isSuccess={isSuccess}
        tattooStyles={tattooStyles}
        activeStyle={activeStyle}
        resetActiveStyle={resetActiveStyle}
        addTattooStyle={addTattooStyle}
        editTattooStyle={editTattooStyle}
        deleteTattooStyle={deleteTattooStyle}
        setIsSuccess={setIsSuccess}
      />

      { !isAuth &&
          <Advertisement
              bookConsultation={bookConsultation}
          />
      }

      <Gallery
        fakeApi={fakeApi}
        isSuccess={isSuccess}
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
        setIsSuccess={setIsSuccess}
        updateGalleryItem={updateGalleryItem}
      />

      { bookingConsultationApiError && bookingConsultationApiError !== '' &&
          <ApiErrorMessage
              error={bookingConsultationApiError}
              closeModal={setBookingConsultationApiError}
          />
      }

      { updateTattooStyleApiError && updateTattooStyleApiError !== '' &&
          <ApiErrorMessage
              error={updateTattooStyleApiError}
              closeModal={setUpdateTattooStyleApiError}
          />
      }

      { updateGalleryApiError && updateGalleryApiError !== '' &&
          <ApiErrorMessage
              error={updateGalleryApiError}
              closeModal={setUpdateGalleryApiError}
          />
      }

    </div>
  )
}
