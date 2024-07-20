import {AppStateType} from "../redux-store";

//primitive selector
export const getBookingsSelector = (state: AppStateType) => {
  return state.bookings.bookings;
};

//reselect library selector

export const getPageSizeSelector = (state: AppStateType) => {
  return state.bookings.pageSize;
};

export const getTotalSelector = (state: AppStateType) => {
  return state.bookings.total;
};

export const getCurrentPageSelector = (state: AppStateType) => {
  return state.bookings.currentPage;
};

export const getIsStatusChangingSelector = (state: AppStateType) => {
  return state.bookings.isStatusChanging;
};

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.bookings.isDeletingInProcess;
};

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.bookings.isFetching;
};

export const getFilterSelector = (state: AppStateType) => {
  return state.bookings.filter;
};

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.bookings.accessError;
};

export const getBookingApiErrorSelector = (state: AppStateType) => {
  return state.bookings.bookingApiError;
};
