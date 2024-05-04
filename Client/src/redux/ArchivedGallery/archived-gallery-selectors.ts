import { AppStateType } from "../redux-store";

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.archivedGallery.isFetching;
}

export const getArchivedGallerySelector = (state: AppStateType) => {
  return state.archivedGallery.archivedGallery;
}

export const getArchivedGalleryPageSizeSelector = (state: AppStateType) => {
  return state.archivedGallery.pageSize;
}

export const getCurrentArchivedGalleryPageSelector = (state: AppStateType) => {
  return state.archivedGallery.currentPage;
}

export const getTotalArchivedGalleryItemsCountSelector = (state: AppStateType) => {
  return state.archivedGallery.totalCount;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.archivedGallery.isDeletingInProcess;
}
