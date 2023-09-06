import * as React from 'react'
import { Advertisement } from '../../components/Portfolio/Advertisement'
import { Gallery } from '../../components/Portfolio/Gallery'
import { TattooStyles } from '../../components/Portfolio/TattooStyles'
import { BookConsultationFormValues, GalleryItemType, TattooStyleType} from "../../types/Types";

type PropsType = {
  isAuth: boolean
  isFetching: boolean
  totalGalleryItemsCount: number
  galleryPageSize: number
  currentGalleryPage: number
  isGalleryItemDeletingInProcess: Array<string>
  tattooStyles: Array<TattooStyleType>
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  isSuccess: boolean
  setGalleryPageSize: (galleryPageSize: number) => void
  bookConsultation: (values: BookConsultationFormValues) => void
  updateGallery: (values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentGalleryPage: (page: number) => void
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (vid: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  archiveGalleryItem: (id: string) => void
  setIsSuccess: (bol: boolean) => void
}

export const Portfolio: React.FC<PropsType> = ({
  isAuth,
  isFetching,
  totalGalleryItemsCount,
  galleryPageSize,
  currentGalleryPage,
  isGalleryItemDeletingInProcess,
  tattooStyles,
  activeStyle,
  gallery,
  isSuccess,
  setGalleryPageSize,
  bookConsultation,
  updateGallery,
  deleteGalleryItem,
  setCurrentGalleryPage,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  archiveGalleryItem,
  setIsSuccess
}) => {

  return (
    <>
      <TattooStyles
        isAuth={isAuth}
        tattooStyles={tattooStyles}
        activeStyle={activeStyle}
        resetActiveStyle={resetActiveStyle}
        addTattooStyle={addTattooStyle}
        editTattooStyle={editTattooStyle}
        deleteTattooStyle={deleteTattooStyle}
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
        totalCount={totalGalleryItemsCount}
        pageSize={galleryPageSize}
        currentPage={currentGalleryPage}
        setCurrentGalleryPage={setCurrentGalleryPage}
        setGalleryPageSize={setGalleryPageSize}
        gallery={gallery}
        updateGallery={updateGallery}
        deleteGalleryItem={deleteGalleryItem}
        archiveGalleryItem={archiveGalleryItem}
        isGalleryItemDeletingInProcess={isGalleryItemDeletingInProcess}
        setIsSuccess={setIsSuccess}
      />
    </>
  )
}
