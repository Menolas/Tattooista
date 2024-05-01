import {AppStateType} from "../redux-store";

//primitive selector
export const getBookingsSelector = (state: AppStateType) => {
  return state.bookings.bookings;
}

//reselect library selector

export const getBookedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.bookings.pageSize;
}

export const getTotalBookingsCountSelector = (state: AppStateType) => {
  return state.bookings.total;
}

export const getCurrentBookedConsultationsPageSelector = (state: AppStateType) => {
  return state.bookings.currentPage;
}

export const getIsStatusChangingSelector = (state: AppStateType) => {
  return state.bookings.isStatusChanging;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.bookings.isDeletingInProcess;
}

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.bookings.isFetching;
}

export const getFilterSelector = (state: AppStateType) => {
  return state.bookings.filter;
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
