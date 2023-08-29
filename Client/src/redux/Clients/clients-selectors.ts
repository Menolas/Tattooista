//import { createSelector } from 'reselect'
import {AppStateType} from '../redux-store'

//primitive selector

export const getClientsSelector = (state: AppStateType) => {
  return state.clients.clients
}

export const getArchivedClientsSelector = (state: AppStateType) => {
  return state.clients.archivedClients
}

//reselect library selector

export const getClientsPageSize = (state: AppStateType) => {
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

export const getCurrentArchivedClientsPage = (state: AppStateType) => {
  return state.clients.currentArchivedClientsPage
}

export const getClientsIsFetching = (state: AppStateType) => {
  return state.clients.clientsIsFetching
}

export const getIsClientDeletingInProcess = (state: AppStateType) => {
  return state.clients.isClientDeletingInProcess
}

export const getClientsFilter = (state: AppStateType) => {
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
