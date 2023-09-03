import {AppStateType} from '../redux-store'

export const getFaqItemsSelector = (state: AppStateType) => {
  return state.general.faq
}

export const getServicesSelector = (state: AppStateType) => {
  return state.general.services
}

export const getPagesSelector = (state: AppStateType) => {
  return state.general.pages
}

export const getIsSuccessSelector = (state: AppStateType) => {
  return state.general.isSuccess
}
