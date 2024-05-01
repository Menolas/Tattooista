import { AppStateType } from "../redux-store";

export const getFaqItemsSelector = (state: AppStateType) => {
  return state.faq.faq;
}

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.faq.isFetching;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.faq.isDeletingInProcess;
}
