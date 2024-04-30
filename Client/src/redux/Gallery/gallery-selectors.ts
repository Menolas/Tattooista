import { AppStateType } from "../redux-store";

export const getIsFetching = (state: AppStateType) => {
  return state.gallery.isFetching;
}

export const getGallerySelector = (state: AppStateType) => {
  return state.gallery.gallery;
}

export const getArchivedGallerySelector = (state: AppStateType) => {
  return state.gallery.archivedGallery;
}

export const getGalleryPageSize = (state: AppStateType) => {
  return state.gallery.galleryPageSize;
}

export const getArchivedGalleryPageSizeSelector = (state: AppStateType) => {
  return state.gallery.archivedGalleryPageSize;
}

export const getCurrentGalleryPage = (state: AppStateType) => {
  return state.gallery.currentGalleryPage;
}

export const getCurrentArchivedGalleryPageSelector = (state: AppStateType) => {
  return state.gallery.currentArchivedGalleryPage;
}

export const getTotalGalleryItemsCount = (state: AppStateType) => {
  return state.gallery.totalGalleryItemsCount;
}

export const getTotalArchivedGalleryItemsCountSelector = (state: AppStateType) => {
  return state.gallery.totalArchivedGalleryItemsCount;
}

export const getIsGalleryItemDeletingInProcessSelector = (state: AppStateType) => {
  return state.gallery.isDeletingInProcess;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.gallery.fakeApi;
}
