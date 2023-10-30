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
  updateTattooStyleApiError: string
  updateServiceApiError: string
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
  setUpdateTattooStyleApiError: (error: string) => void
  setUpdateServiceApiError: (error: string) => void
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
  updateTattooStyleApiError,
  updateServiceApiError,
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
  setUpdateServiceApiError
}) => {

  useEffect(() => {
    if (bookingConsultationApiError) {
      setTimeout( () => {
        setBookingConsultationApiError('')
      }, 1500)
    }
  }, [bookingConsultationApiError])

  useEffect(() => {
    if (updateTattooStyleApiError) {
      setTimeout( () => {
        setUpdateTattooStyleApiError('')
      }, 1500)
    }
  }, [updateTattooStyleApiError])

  useEffect(() => {
    if (updateServiceApiError) {
      setTimeout( () => {
        setUpdateServiceApiError('')
      }, 1500)
    }
  }, [updateServiceApiError])

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

      { updateTattooStyleApiError && updateTattooStyleApiError !== '' &&
          <BookingApiError error={updateTattooStyleApiError}/>
      }

      { updateServiceApiError && updateServiceApiError !== '' &&
          <BookingApiError error={updateServiceApiError}/>
      }
    </div>
  )
}
