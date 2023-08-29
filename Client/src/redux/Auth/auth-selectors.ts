import { AppStateType } from '../redux-store'

export const getAuthSelector = (state: AppStateType) => {
  return state.auth.isAuth
}

export const getTokenSelector = (state: AppStateType) => {
  return state.auth.token
}

export const getUserIdSelector = (state: AppStateType) => {
  return state.auth.userId
}

//username: null,
//password: null,











