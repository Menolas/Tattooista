import { AppStateType } from "../redux-store"

export const getAuthSelector = (state: AppStateType) => {
  return state.auth.isAuth
}

export const getTokenSelector = (state: AppStateType) => {
  return state.auth.token
}

export const getUserSelector = (state: AppStateType) => {
  return state.auth.user
}

export const getAuthApiErrorSelector = (state: AppStateType) => {
  return state.auth.authApiError
};

export const getLoginErrorSelector = (state: AppStateType) => {
  return state.auth.loginError
};

export  const getFromSelector = (state: AppStateType) => {
    return state.auth.from
};

// export const getRolesSelector = (state: AppStateType) => {
//   return state.auth.roles
// };

export const getNeedReLoginSelector = (state: AppStateType) => {
  return state.auth.needReLogin
};

export const getUserProfileSelector = (state: AppStateType) => {
  return state.auth.profile;
};

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
    return state.auth.isDeletingInProcess;
};

export const getAuthAccessErrorSelector = (state: AppStateType) => {
    return state.auth.accessError;
}
