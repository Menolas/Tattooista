import {AppStateType} from '../redux-store'

//primitive selector
export const getBookedConsultationsSelector = (state: AppStateType) => {
  return state.bookedConsultations.bookedConsultations
}

export const getArchivedConsultationsSelector = (state: AppStateType) => {
  return state.bookedConsultations.archivedConsultations
}

//reselect library selector

export const getBookedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.bookedConsultations.bookedConsultationsPageSize
}

export const getArchivedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.bookedConsultations.archivedConsultationsPageSize
}

export const getTotalBookedConsultationsCountSelector = (state: AppStateType) => {
  return state.bookedConsultations.totalBookedConsultationsCount
}

export const getTotalArchivedConsultationsCountSelector = (state: AppStateType) => {
  return state.bookedConsultations.totalArchivedConsultationsCount
}

export const getCurrentBookedConsultationsPageSelector = (state: AppStateType) => {
  return state.bookedConsultations.currentBookedConsultationsPage
}

export const getCurrentArchivedConsultationsPageSelector = (state: AppStateType) => {
  return state.bookedConsultations.currentArchivedConsultationsPage
}

export const getIsStatusChangingSelector = (state: AppStateType) => {
  return state.bookedConsultations.isStatusChanging
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.bookedConsultations.isDeletingInProcess
}

export const getBookedConsultationsIsFetchingSelector = (state: AppStateType) => {
  return state.bookedConsultations.bookedConsultationsIsFetching
}

export const getBookedConsultationsFilterSelector = (state: AppStateType) => {
  return state.bookedConsultations.bookedConsultationsFilter
}

export const getArchivedConsultationsFilterSelector = (state: AppStateType) => {
  return state.bookedConsultations.archivedConsultationsFilter
}

export const getIsSuccessSelector = (state: AppStateType) => {
  return state.bookedConsultations.isSuccess
}

export const getAddBookingApiErrorSelector = (state: AppStateType) => {
  return state.bookedConsultations.addBookingApiError
}
