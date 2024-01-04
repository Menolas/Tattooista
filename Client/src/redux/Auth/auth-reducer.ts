import { authAPI } from "./authApi"
import { ResultCodesEnum } from "../../utils/constants"
import { ThunkAction } from "redux-thunk"
import { AppStateType } from "../redux-store"
import { LoginFormValues, RegistrationFormValues} from "../../types/Types"
import { IUser } from "../../types/Types"

const SET_USER_DATA = 'SET_USER_DATE'
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

    case SET_USER_DATA:
      return {
        ...state,
        user: action.user,
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

type ActionsTypes = SetLoginErrorAT | SetRegistrationErrorAT | SetIsSuccessAT | SetTokenAT | SetUserDataAT | SetAuthAT

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

type SetUserDataAT = {
  type: typeof SET_USER_DATA,
  user: IUser | null
}

const setUserDataAC = (
    user: IUser | null
): SetUserDataAT => ({
    type: SET_USER_DATA, user
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

export const login = (values: LoginFormValues): ThunkType => async (
    dispatch
) => {
  try {
    let response = await authAPI.login(values)
    if(response.resultCode === 0) {
      dispatch(setLoginErrorAC(''))
      dispatch(setUserDataAC(response.userData.user))
      dispatch(setAuth(true))
      dispatch(setAccessTokenAC(response.userData.accessToken))
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setLoginErrorAC(e.response.data.message))
  }
}

export const logout = (): ThunkType => async (
    dispatch
) => {
  console.log("hit logout!!!")
  try {
    const response = await authAPI.logout()
     if(response.resultCode === 0) {
       dispatch(setAccessTokenAC(null))
       dispatch(setUserDataAC(null))
       dispatch(setAuth(false))
     }
  } catch (e) {
    console.log(e)
  }
}

export const registration = (values: RegistrationFormValues): ThunkType => async (dispatch) => {
  try {
    let response = await authAPI.registration(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setRegistrationErrorAC(''))
      dispatch(setAuth(true))
      dispatch(setUserDataAC(response.userData.user))
      dispatch(setAccessTokenAC(response.userData.accessToken))
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
    if (response.resultCode === ResultCodesEnum.Success) {
      if (response.userData.isAuth === true) {
        dispatch(setAccessTokenAC(response.userData.accessToken))
        dispatch(setAuth(true))
        dispatch(setUserDataAC(response.userData.user))
      }
    }
  } catch (e) {
    console.log(e)
  }
}
