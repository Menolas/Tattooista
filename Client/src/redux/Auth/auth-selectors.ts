import { AppStateType } from "../redux-store"

export const getIsAuthSelector = (state: AppStateType) => {
  return state.auth.isAuth;
}

export const getTokenSelector = (state: AppStateType) => {
  return state.auth.token;
}

export const getRegistrationApiErrorSelector = (state: AppStateType) => {
    return state.auth.registrationApiError;
};

export const getLoginErrorSelector = (state: AppStateType) => {
  return state.auth.loginError;
};

export  const getFromSelector = (state: AppStateType) => {
    return state.auth.from;
};

export const getNeedReLoginSelector = (state: AppStateType) => {
  return state.auth.needReLogin;
};

export const getUserProfileSelector = (state: AppStateType) => {
  return state.auth.user;
};

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
    return state.auth.isDeletingInProcess;
};

export const getAuthAccessErrorSelector = (state: AppStateType) => {
    return state.auth.accessError;
};

export const getIsFetchingSelector = (state: AppStateType) => {
    return state.auth.isFetching;
};

export const getUsersReviewsSelector = (state: AppStateType) => {
    return state.auth.reviews;
};
