import * as React from 'react'
import { Advertisement } from '../../components/Portfolio/Advertisement'
import { Gallery } from '../../components/Portfolio/Gallery'
import { TattooStyles } from '../../components/Portfolio/TattooStyles'
import { BookConsultationFormValues, GalleryItemType, TattooStyleType} from "../../types/Types";
import {useEffect, useState} from "react";
import {BookingApiError} from "../../components/common/BookindApiError";

type PropsType = {
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
  setPageSize: (pageSize: number) => void
  bookConsultation: (values: BookConsultationFormValues) => void
  updateGallery: (values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentPage: (page: number) => void
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (vid: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  archiveGalleryItem: (id: string) => void
  setIsSuccess: (bol: boolean) => void
  setBookingConsultationApiError: (error: string) => void
}

export const Portfolio: React.FC<PropsType> = ({
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
  setBookingConsultationApiError
}) => {

  useEffect(() => {
    if (bookingConsultationApiError) {
      setTimeout( () => {
        setBookingConsultationApiError('')
      }, 1500)
    }
  }, [bookingConsultationApiError])

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
        updateGallery={updateGallery}
        deleteGalleryItem={deleteGalleryItem}
        archiveGalleryItem={archiveGalleryItem}
        isDeletingInProcess={isDeletingInProcess}
        setIsSuccess={setIsSuccess}
      />

      { bookingConsultationApiError && bookingConsultationApiError !== '' &&
          <BookingApiError error={bookingConsultationApiError}/>
      }
    </div>
  )
}
