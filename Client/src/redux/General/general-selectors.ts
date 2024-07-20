import { AppStateType } from "../redux-store";

export const getApiErrorSelector = (state: AppStateType) => {
  return state.general.apiError;
};

export const getSuccessModalSelector = (state: AppStateType) => {
  return state.general.successModal;
};
