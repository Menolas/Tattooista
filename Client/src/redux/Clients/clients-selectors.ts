import {AppStateType} from "../redux-store";

//primitive selector

export const getClientsSelector = (state: AppStateType) => {
  return state.clients.clients;
}

//reselect library selector

export const getClientsPageSizeSelector = (state: AppStateType) => {
  return state.clients.pageSize;
}

export const getTotalClientsCount = (state: AppStateType) => {
  return state.clients.total;
}

export const getCurrentClientsPage = (state: AppStateType) => {
  return state.clients.clientsCurrentPage;
}

export const getClientsIsFetching = (state: AppStateType) => {
  return state.clients.isFetching;
}

export const getIsClientDeletingInProcessSelector = (state: AppStateType) => {
  return state.clients.isDeletingInProcess;
}

export const getIsDeletingPicturesInProcessSelector = (state: AppStateType) => {
  return state.clients.isDeletingPicturesInProcess;
}

export const getClientsFilterSelector = (state: AppStateType) => {
  return state.clients.filter;
}

export const getClientProfileSelector = (state: AppStateType) => {
  return state.clients.profile;
}

export const getIsDeletingPicturesInProcess = (state: AppStateType) => {
  return state.clients.isDeletingPicturesInProcess;
}

export const getClientsApiErrorSelector = (state: AppStateType) => {
    return state.clients.clientsApiError;
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.clients.accessError;
}
