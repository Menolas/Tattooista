import { AppStateType } from "../redux-store";

export const getIsFetching = (state: AppStateType) => {
  return state.portfolio.isFetching;
}

export const getTattooStylesSelector = (state: AppStateType) => {
  return state.portfolio.tattooStyles;
}

export const getActiveStyleSelector = (state: AppStateType) => {
  return state.portfolio.activeStyle;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.portfolio.apiError;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.portfolio.fakeApi;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.portfolio.successModal;
}
