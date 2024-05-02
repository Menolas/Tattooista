import {AppStateType} from "../redux-store";

//primitive selector

export const getClientsSelector = (state: AppStateType) => {
  return state.clients.clients;
}

//reselect library selector

export const getClientsPageSizeSelector = (state: AppStateType) => {
  return state.clients.clientsPageSize;
}

export const getTotalClientsCount = (state: AppStateType) => {
  return state.clients.totalClientsCount;
}

export const getCurrentClientsPage = (state: AppStateType) => {
  return state.clients.currentClientsPage;
}

export const getClientsIsFetching = (state: AppStateType) => {
  return state.clients.clientsIsFetching;
}

export const getIsClientDeletingInProcessSelector = (state: AppStateType) => {
  return state.clients.isDeletingInProcess;
}

export const getIsDeletingPicturesInProcessSelector = (state: AppStateType) => {
  return state.clients.isDeletingPicturesInProcess;
}

export const getClientsFilterSelector = (state: AppStateType) => {
  return state.clients.clientsFilter;
}

export const getClientProfileSelector = (state: AppStateType) => {
  return state.clients.profile;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.clients.successModal;
}

export const getIsDeletingPicturesInProcess = (state: AppStateType) => {
  return state.clients.isDeletingPicturesInProcess;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.clients.apiError;
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.clients.accessError;
}
