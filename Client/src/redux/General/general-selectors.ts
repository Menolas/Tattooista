import { AppStateType } from "../redux-store";

export const getFaqItemsSelector = (state: AppStateType) => {
  return state.general.faq;
}

export const getServicesSelector = (state: AppStateType) => {
  return state.general.services;
}

export const getPageAboutSelector = (state: AppStateType) => {
  return state.general.pageAbout;
}

export const getIsGeneralFetchingSelector = (state: AppStateType) => {
  return state.general.isGeneralFetching;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.general.apiError;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.general.successModal;
}
