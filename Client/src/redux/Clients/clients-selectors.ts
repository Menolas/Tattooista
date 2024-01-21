import {AppStateType} from "../redux-store"

//primitive selector

export const getClientsSelector = (state: AppStateType) => {
  return state.clients.clients
}

export const getArchivedClientsSelector = (state: AppStateType) => {
  return state.clients.archivedClients
}

//reselect library selector

export const getClientsPageSizeSelector = (state: AppStateType) => {
  return state.clients.clientsPageSize
}

export const getArchivedClientsPageSize = (state: AppStateType) => {
  return state.clients.archivedClientsPageSize
}

export const getTotalClientsCount = (state: AppStateType) => {
  return state.clients.totalClientsCount
}

export const getTotalArchivedClientsCount = (state: AppStateType) => {
  return state.clients.totalArchivedClientsCount
}

export const getCurrentClientsPage = (state: AppStateType) => {
  return state.clients.currentClientsPage
}

export const getCurrentArchivedClientsPageSelector = (state: AppStateType) => {
  return state.clients.currentArchivedClientsPage
}

export const getClientsIsFetching = (state: AppStateType) => {
  return state.clients.clientsIsFetching
}

export const getIsClientDeletingInProcessSelector = (state: AppStateType) => {
  return state.clients.isDeletingInProcess
}

export const getIsDeletingPicturesInProcessSelector = (state: AppStateType) => {
  return state.clients.isDeletingPicturesInProcess
}

export const getClientsFilterSelector = (state: AppStateType) => {
  return state.clients.clientsFilter
}

export const getArchivedClientsFilter = (state: AppStateType) => {
  return state.clients.archivedClientsFilter
}

export const getClientProfileSelector = (state: AppStateType) => {
  return state.clients.profile
}

export const getIsSuccessSelector = (state: AppStateType) => {
  return state.clients.isSuccess
}

export const getIsDeletingPicturesInProcess = (state: AppStateType) => {
  return state.clients.isDeletingPicturesInProcess
}

export const getAddClientApiErrorSelector = (state: AppStateType) => {
  return state.clients.addClientApiError
}

export const getUpdateClientGalleryApiErrorSelector = (state: AppStateType) => {
  return state.clients.updateClientGalleryApiError
}

export const getAccessErrorSelector = (state: AppStateType) => {
  return state.clients.accessError
}
