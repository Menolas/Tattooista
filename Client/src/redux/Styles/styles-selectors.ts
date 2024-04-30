import { AppStateType } from "../redux-store";

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.styles.isFetching;
}

export const getStylesSelector = (state: AppStateType) => {
  return state.styles.styles;
}

export const getActiveStyleSelector = (state: AppStateType) => {
  return state.styles.activeStyle;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.styles.fakeApi;
}

export const getIsDeletingInProcess = (state: AppStateType) => {
  return state.styles.isDeletingInProcess;
}
