import {AppStateType} from "../redux-store";

//primitive selector

export const getArchivedBookingsSelector = (state: AppStateType) => {
  return state.archivedBookings.archivedBookings;
}

//reselect library selector

export const getPageSizeSelector = (state: AppStateType) => {
  return state.archivedBookings.pageSize;
}

export const getTotalCountSelector = (state: AppStateType) => {
  return state.archivedBookings.totalCount;
}

export const getCurrentPageSelector = (state: AppStateType) => {
  return state.archivedBookings.archivedBookingsCurrentPage;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.archivedBookings.isDeletingInProcess;
}

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.archivedBookings.isFetching;
}

export const getFilterSelector = (state: AppStateType) => {
  return state.archivedBookings.filter;
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.archivedBookings.accessError;
}

export const getArchivedBookingApiErrorSelector = (state: AppStateType) => {
  return state.archivedBookings.bookingApiError;
}
