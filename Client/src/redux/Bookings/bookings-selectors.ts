import {AppStateType} from "../redux-store";

//primitive selector
export const getBookingsSelector = (state: AppStateType) => {
  return state.bookings.bookings;
}

export const getArchivedBookingsSelector = (state: AppStateType) => {
  return state.bookings.archivedBookings;
}

//reselect library selector

export const getBookedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.bookings.bookedConsultationsPageSize;
}

export const getArchivedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.bookings.archivedConsultationsPageSize;
}

export const getTotalBookingsCountSelector = (state: AppStateType) => {
  return state.bookings.totalBookingsCount;
}

export const getTotalArchivedConsultationsCountSelector = (state: AppStateType) => {
  return state.bookings.totalArchivedConsultationsCount;
}

export const getCurrentBookedConsultationsPageSelector = (state: AppStateType) => {
  return state.bookings.currentBookedConsultationsPage;
}

export const getCurrentArchivedConsultationsPageSelector = (state: AppStateType) => {
  return state.bookings.currentArchivedConsultationsPage;
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

export const getArchivedConsultationsFilterSelector = (state: AppStateType) => {
  return state.bookings.archivedConsultationsFilter;
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
