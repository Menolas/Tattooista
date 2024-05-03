import { AppStateType } from "../redux-store";

export const getPageSelector = (state: AppStateType) => {
  return state.about.page;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.about.fakeApi;
}

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.about.isFetching;
}
