import { authAPI } from './authApi'
import { ResultCodesEnum } from '../../utils/constants'
import {ThunkAction} from "redux-thunk"
import {AppStateType} from "../redux-store"
import {LoginFormValues, RegistrationFormValues} from "../../types/Types"
import {IUser} from "../../types/IUser";

const SET_ADMIN_DATA = 'SET_ADMIN_DATE'
const SET_AUTH = 'SET_AUTH'
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'
const SET_REGISTRATION_ERROR = 'SET_REGISTRATION_ERROR'
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR'

let initialState = {
  user: {} as IUser | null,
  token: null as string | null | undefined,
  isAuth: false as boolean,
  isSuccess: false as boolean,
  registrationError: '' as string | undefined,
  loginError: '' as string | undefined
}

export type InitialStateType = typeof initialState

export const authReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case SET_ACCESS_TOKEN:
      return  {
        ...state,
        token: action.token
      }

    case SET_ADMIN_DATA:
      return {
        ...state,
        ...action.user,
      }

    case SET_AUTH:
      return {
        ...state,
        isAuth: action.isAuth
      }

    case SET_IS_SUCCESS:
      return {
        ...state,
        isSuccess: action.isSuccess
      }

    case SET_LOGIN_ERROR:
      return {
        ...state,
        loginError: action.error
      }

    case SET_REGISTRATION_ERROR:
      return {
        ...state,
        registrationError: action.error
      }

    default: return state
  }
}

type ActionsTypes = SetLoginErrorAT | SetRegistrationErrorAT | SetIsSuccessAT | SetTokenAT | SetAdminDataAT | SetAuthAT

// actions creators

type SetLoginErrorAT = {
  type: typeof SET_LOGIN_ERROR
  error: string | undefined
}

const setLoginErrorAC = (error: string | undefined): SetLoginErrorAT => ({
  type: SET_LOGIN_ERROR, error
})

type SetRegistrationErrorAT = {
  type: typeof  SET_REGISTRATION_ERROR
  error: string | undefined
}

const setRegistrationErrorAC = (error: string | undefined): SetRegistrationErrorAT => ({
  type: SET_REGISTRATION_ERROR, error
})

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  isSuccess: boolean
}

export const setIsSuccessAC = (isSuccess: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, isSuccess
})

type SetTokenAT = {
  type: typeof SET_ACCESS_TOKEN,
  token: null | string
}

const setAccessTokenAC = (token: string | null): SetTokenAT => ({
  type: SET_ACCESS_TOKEN, token
})

type SetAdminDataAT = {
  type: typeof SET_ADMIN_DATA,
  user: IUser | null
}

const setAdminDataAC = (
    user: IUser | null
): SetAdminDataAT => ({
    type: SET_ADMIN_DATA, user
})

type SetAuthAT = {
  type: typeof SET_AUTH
  isAuth: boolean
}

const setAuth = (isAuth: boolean): SetAuthAT => ({
    type: SET_AUTH, isAuth
})

//thunks

export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getAuthAdminData = (
    token: string | null
): ThunkType => async (
    dispatch
) => {
  //debugger
  try {
    let response = await authAPI.auth(token)
    if (response === ResultCodesEnum.Success) {
      dispatch(setAuth(true))
    }
  } catch (e) {
    console.log(e)
  }
}

export const login = (values: LoginFormValues): ThunkType => async (
    dispatch
) => {
  try {
    let response = await authAPI.login(values)
    dispatch(setLoginErrorAC(''))
    dispatch(setAdminDataAC(response.userData.user))
    dispatch(setAuth(true))
    dispatch(setAccessTokenAC(response.userData.accessToken))

  } catch (e) {
    // @ts-ignore
    dispatch(setLoginErrorAC(e.response.data.message))
    // @ts-ignore
    console.log(e.response.data.message)
  }

}

export const logout = (): ThunkType => async (
    dispatch
) => {
  try {
    const response = await authAPI.logout()
     if(response.deletedCount === 1) {
       dispatch(setAccessTokenAC(null))
       dispatch(setAdminDataAC(null))
       dispatch(setAuth(false))
     }
  } catch (e) {
    console.log(e)
  }
}

export const registration = (values: RegistrationFormValues): ThunkType => async (dispatch) => {
  debugger
  try {
    let response = await authAPI.registration(values.email, values.password)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setRegistrationErrorAC(''))
      dispatch(setAuth(true))
      dispatch(setAdminDataAC(response.user.user))
      dispatch(setAccessTokenAC(response.user.accessToken))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setRegistrationErrorAC(e.response.data.message))
    // @ts-ignore
    console.log(e.response.data.message)
  }
}

export const checkAuth = ():ThunkType => async (dispatch) => {
  try {
    let response = await authAPI.checkAuth()
    dispatch(setAccessTokenAC(response.accessToken))
    dispatch(setAuth(true))
    dispatch(setAdminDataAC(response.user))
  } catch (e) {
    console.log(e)
  }
}
