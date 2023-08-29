import * as React from 'react'
import { Advertisement } from '../../components/Portfolio/Advertisement'
import { Gallery } from '../../components/Portfolio/Gallery'
import { TattooStyles } from '../../components/Portfolio/TattooStyles'
import { AddCustomerFormValues, GalleryItemType, TattooStyleType } from "../../types/Types";

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
  setPageLimit: (galleryPageSize: number) => void
  addCustomer: (values: AddCustomerFormValues) => void
  updateGallery: (values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentGalleryPage: (page: number) => void
  resetActiveStyle: (style: TattooStyleType) => void
  addTattooStyle: (values: FormData) => void
  editTattooStyle: (vid: string, values: FormData) => void
  deleteTattooStyle: (id: string) => void
  archiveGalleryItem: (id: string) => void
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
  setPageLimit,
  addCustomer,
  updateGallery,
  deleteGalleryItem,
  setCurrentGalleryPage,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  archiveGalleryItem
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

      { !isAuth && <Advertisement addCustomer={addCustomer}/>}

      <Gallery
        isAuth={isAuth}
        isFetching={isFetching}
        activeStyle={activeStyle}
        totalCount={totalGalleryItemsCount}
        pageSize={galleryPageSize}
        currentPage={currentGalleryPage}
        setCurrentGalleryPage={setCurrentGalleryPage}
        setPageLimit={setPageLimit}
        gallery={gallery}
        updateGallery={updateGallery}
        deleteGalleryItem={deleteGalleryItem}
        archiveGalleryItem={archiveGalleryItem}
        isGalleryItemDeletingInProcess={isGalleryItemDeletingInProcess}
      />
    </>
  )
}
