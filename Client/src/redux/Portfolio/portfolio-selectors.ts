import {AppStateType} from '../redux-store'

export const getIsFetching = (state: AppStateType) => {
  return state.portfolio.isFetching
}

export const getTattooStylesSelector = (state: AppStateType) => {
  return state.portfolio.tattooStyles
}

export const getActiveStyleSelector = (state: AppStateType) => {
  return state.portfolio.activeStyle
}

// export const getActiveStyleValue = (state: AppStateType) => {
//   return state.portfolio.activeStyleValue
// }

export const getGallery = (state: AppStateType) => {
  return state.portfolio.gallery
}

export const getArchivedGallerySelector = (state: AppStateType) => {
  return state.portfolio.archivedGallery
}

export const getGalleryPageSize = (state: AppStateType) => {
  return state.portfolio.galleryPageSize
}

export const getArchivedGalleryPageSizeSelector = (state: AppStateType) => {
  return state.portfolio.archivedGalleryPageSize
}

export const getCurrentGalleryPage = (state: AppStateType) => {
  return state.portfolio.currentGalleryPage
}

export const getCurrentArchivedGalleryPageSelector = (state: AppStateType) => {
  return state.portfolio.currentArchivedGalleryPage
}

export const getTotalGalleryItemsCount = (state: AppStateType) => {
  return state.portfolio.totalGalleryItemsCount
}

export const getTotalArchivedGalleryItemsCountSelector = (state: AppStateType) => {
  return state.portfolio.totalArchivedGalleryItemsCount
}

export const getIsGalleryItemDeletingInProcessSelector = (state: AppStateType) => {
  return state.portfolio.isDeletingInProcess
}

export const getUpdateTattooStyleApiErrorSelector = (state: AppStateType) => {
  return state.portfolio.updateTattooStyleError
}

export const getUpdateGalleryApiErrorSelector = (state: AppStateType) => {
  return state.portfolio.updateGalleryApiError
}
