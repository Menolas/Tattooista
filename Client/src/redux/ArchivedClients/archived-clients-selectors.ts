import {AppStateType} from "../redux-store";

//primitive selector

export const getArchivedClientsSelector = (state: AppStateType) => {
  return state.archivedClients.archivedClients;
}

//reselect library selector

export const getArchivedClientsPageSize = (state: AppStateType) => {
  return state.archivedClients.pageSize;
}

export const getTotalArchivedClientsCount = (state: AppStateType) => {
  return state.archivedClients.total;
}

export const getCurrentArchivedClientsPageSelector = (state: AppStateType) => {
  return state.archivedClients.currentPage;
}

export const getClientsIsFetching = (state: AppStateType) => {
  return state.archivedClients.isFetching;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.archivedClients.isDeletingInProcess;
}

export const getArchivedClientsFilter = (state: AppStateType) => {
  return state.archivedClients.filter;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.archivedClients.successModal;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.archivedClients.apiError;
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.archivedClients.accessError;
}
