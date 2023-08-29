import {AppStateType} from '../redux-store'

export const getFaqItemsSelector = (state: AppStateType) => {
  return state.mainPage.faq
}

export const getServicesSelector = (state: AppStateType) => {
  return state.mainPage.services
}

export const getPagesSelector = (state: AppStateType) => {
  return state.mainPage.pages
}
