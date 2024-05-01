import {AppStateType} from "../redux-store";

//primitive selector

export const getArchivedBookingsSelector = (state: AppStateType) => {
  return state.archivedBookings.archivedBookings;
}

//reselect library selector

export const getArchivedConsultationsPageSizeSelector = (state: AppStateType) => {
  return state.archivedBookings.archivedConsultationsPageSize;
}

export const getTotalArchivedConsultationsCountSelector = (state: AppStateType) => {
  return state.archivedBookings.totalArchivedConsultationsCount;
}

export const getCurrentArchivedConsultationsPageSelector = (state: AppStateType) => {
  return state.archivedBookings.currentArchivedConsultationsPage;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.archivedBookings.isDeletingInProcess;
}

export const getBookedConsultationsIsFetchingSelector = (state: AppStateType) => {
  return state.archivedBookings.bookedConsultationsIsFetching;
}

export const getArchivedConsultationsFilterSelector = (state: AppStateType) => {
  return state.archivedBookings.archivedConsultationsFilter;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.archivedBookings.successModal;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.archivedBookings.apiError;
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.archivedBookings.accessError;
}
