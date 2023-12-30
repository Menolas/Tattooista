import { AppStateType } from "../redux-store"

export const getFaqItemsSelector = (state: AppStateType) => {
  return state.general.faq
}

export const getServicesSelector = (state: AppStateType) => {
  return state.general.services
}

export const getPageAboutSelector = (state: AppStateType) => {
  return state.general.pageAbout
}

export const getIsGeneralFetchingSelector = (state: AppStateType) => {
  return state.general.isGeneralFetching
}

export const getIsSuccessSelector = (state: AppStateType) => {
  return state.general.isSuccess
}

export const getIsSuccessBookingSelector = (state: AppStateType) => {
  return state.general.isSuccessBooking
}

export const getBookingConsultationApiErrorSelector = (state: AppStateType) => {
  return state.general.bookingConsultationApiError
}

export const getUpdateFaqItemApiErrorSelector = (state: AppStateType) => {
  return state.general.updateFaqItemApiError
}

export const getIsBookingModalOpenSelector = (state: AppStateType) => {
  return state.general.isBookingModalOpen
}

export const getUpdateServiceApiErrorSelector = (state: AppStateType) => {
  return state.general.updateServiceApiError
}

export const getUpdatePageApiErrorSelector = (state: AppStateType) => {
  return state.general.updatePageApiError
}
