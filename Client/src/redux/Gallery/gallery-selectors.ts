import { AppStateType } from "../redux-store";

export const getIsFetching = (state: AppStateType) => {
  return state.gallery.isFetching;
}

export const getGallerySelector = (state: AppStateType) => {
  return state.gallery.gallery;
}

export const getGalleryPageSize = (state: AppStateType) => {
  return state.gallery.galleryPageSize;
}

export const getCurrentGalleryPage = (state: AppStateType) => {
  return state.gallery.currentGalleryPage;
}

export const getTotalGalleryItemsCount = (state: AppStateType) => {
  return state.gallery.totalGalleryItemsCount;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.gallery.isDeletingInProcess;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.gallery.fakeApi;
}
