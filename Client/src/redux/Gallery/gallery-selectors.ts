import { AppStateType } from "../redux-store";

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.gallery.isFetching;
};

export const getGallerySelector = (state: AppStateType) => {
  return state.gallery.gallery;
};

export const getPageSizeSelector = (state: AppStateType) => {
  return state.gallery.pageSize;
};

export const getCurrentPageSelector = (state: AppStateType) => {
  return state.gallery.currentPage;
};

export const getTotalCountSelector = (state: AppStateType) => {
  return state.gallery.totalCount;
};

export const getIsGalleryItemDeletingInProcessSelector = (state: AppStateType) => {
  return state.gallery.isDeletingInProcess;
};

export const getGalleryApiErrorSelector = (state: AppStateType) => {
  return state.gallery.galleryApiError;
}
