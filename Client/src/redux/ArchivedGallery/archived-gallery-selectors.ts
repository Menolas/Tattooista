import { AppStateType } from "../redux-store";

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.archivedGallery.isFetching;
}

export const getArchivedGallerySelector = (state: AppStateType) => {
  return state.archivedGallery.archivedGallery;
}

export const getArchivedGalleryPageSizeSelector = (state: AppStateType) => {
  return state.archivedGallery.archivedGalleryPageSize;
}

export const getCurrentArchivedGalleryPageSelector = (state: AppStateType) => {
  return state.archivedGallery.currentArchivedGalleryPage;
}

export const getTotalArchivedGalleryItemsCountSelector = (state: AppStateType) => {
  return state.archivedGallery.totalArchivedGalleryItemsCount;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.archivedGallery.isDeletingInProcess;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.archivedGallery.fakeApi;
}
