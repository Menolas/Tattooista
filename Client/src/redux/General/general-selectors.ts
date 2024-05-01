import { AppStateType } from "../redux-store";

export const getIsFetchingSelector = (state: AppStateType) => {
  return state.general.isFetching;
}

export const getApiErrorSelector = (state: AppStateType) => {
  return state.general.apiError;
}

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.general.successModal;
}
