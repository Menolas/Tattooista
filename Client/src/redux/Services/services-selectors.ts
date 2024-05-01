import { AppStateType } from "../redux-store";

export const getServicesSelector = (state: AppStateType) => {
  return state.services.services;
}

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.services.isFetching;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.services.fakeApi;
}

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
  return state.services.isDeletingInProcess;
}
