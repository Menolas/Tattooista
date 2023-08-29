import {AppStateType} from '../redux-store'

//primitive selector
export const getCustomersSelector = (state: AppStateType) => {
  return state.customers.customers
}

export const getArchivedCustomersSelector = (state: AppStateType) => {
  return state.customers.archivedCustomers
}

//reselect library selector

export const getCustomersPageSizeSelector = (state: AppStateType) => {
  return state.customers.customersPageSize
}

export const getArchivedCustomersPageSizeSelector = (state: AppStateType) => {
  return state.customers.archivedCustomersPageSize
}

export const getTotalCustomersCountSelector = (state: AppStateType) => {
  return state.customers.totalCustomersCount
}

export const getTotalArchivedCustomersCountSelector = (state: AppStateType) => {
  return state.customers.totalArchivedCustomersCount
}

export const getCurrentCustomersPageSelector = (state: AppStateType) => {
  return state.customers.currentCustomersPage
}

export const getCurrentArchivedCustomersPageSelector = (state: AppStateType) => {
  return state.customers.currentArchivedCustomersPage
}

export const getIsStatusChangingSelector = (state: AppStateType) => {
  return state.customers.isStatusChanging
}

export const getIsCustomerDeletingInProcessSelector = (state: AppStateType) => {
  return state.customers.isCustomerDeletingInProcess
}

export const getCustomersIsFetchingSelector = (state: AppStateType) => {
  return state.customers.customersIsFetching
}

export const getCustomersFilterSelector = (state: AppStateType) => {
  return state.customers.customersFilter
}

export const getArchivedCustomersFilterSelector = (state: AppStateType) => {
  return state.customers.archivedCustomersFilter
}

export const getIsSuccessSelector = (state: AppStateType) => {
  return state.customers.isSuccess
}
