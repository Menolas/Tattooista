import { AppStateType } from "../redux-store";

export const getFaqItemsSelector = (state: AppStateType) => {
  return state.general.faq;
}

export const getServicesSelector = (state: AppStateType) => {
  return state.general.services;
}

export const getServiceSelector = (state: AppStateType) => {
  return state.general.service;
}

export const getPageAboutSelector = (state: AppStateType) => {
  return state.general.pageAbout;
}

export const getIsGeneralFetchingSelector = (state: AppStateType) => {
  return state.general.isGeneralFetching;
}

export const getBookingConsultationApiErrorSelector = (state: AppStateType) => {
  return state.general.bookingConsultationApiError;
}

export const getUpdateFaqItemApiErrorSelector = (state: AppStateType) => {
  return state.general.updateFaqItemApiError;
}

export const getUpdateServiceApiErrorSelector = (state: AppStateType) => {
  return state.general.updateServiceApiError;
}

export const getUpdatePageApiErrorSelector = (state: AppStateType) => {
  return state.general.updatePageApiError;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.general.successModal;
}
