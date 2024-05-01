import {AppStateType} from "../redux-store";

//primitive selector
export const getBookingsSelector = (state: AppStateType) => {
  return state.bookings.bookings;
}

//reselect library selector

export const getBookedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.bookings.bookedConsultationsPageSize;
}

export const getTotalBookingsCountSelector = (state: AppStateType) => {
  return state.bookings.totalBookingsCount;
}

export const getCurrentBookedConsultationsPageSelector = (state: AppStateType) => {
  return state.bookings.currentBookedConsultationsPage;
}

export const getIsStatusChangingSelector = (state: AppStateType) => {
  return state.bookings.isStatusChanging;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.bookings.isDeletingInProcess;
}

export const getBookedConsultationsIsFetchingSelector = (state: AppStateType) => {
  return state.bookings.bookedConsultationsIsFetching;
}

export const getBookedConsultationsFilterSelector = (state: AppStateType) => {
  return state.bookings.bookedConsultationsFilter;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.bookings.successModal;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.bookings.apiError;
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.bookings.accessError;
}
