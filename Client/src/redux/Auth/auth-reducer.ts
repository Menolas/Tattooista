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

let initialState = {
  user: {} as IUser | null,
  token: null as string | null | undefined,
  isAuth: false as boolean,
  isSuccess: false as boolean
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

    default: return state
  }
}

type ActionsTypes = SetIsSuccessAT | SetTokenActionType | SetAdminDataActionType | SetAuthActionType

// actions creators

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  isSuccess: boolean
}

export const setIsSuccessAC = (isSuccess: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, isSuccess
})

type SetTokenActionType = {
  type: typeof SET_ACCESS_TOKEN,
  token: null | string
}

const setAccessToken = (token: string | null): SetTokenActionType => ({
  type: SET_ACCESS_TOKEN, token
})

type SetAdminDataActionType = {
  type: typeof SET_ADMIN_DATA,
  user: IUser | null
}

const setAdminData = (
    user: IUser | null
): SetAdminDataActionType => ({
    type: SET_ADMIN_DATA, user
})

type SetAuthActionType = {
  type: typeof SET_AUTH
  isAuth: boolean
}

const setAuth = (isAuth: boolean): SetAuthActionType => ({
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
    dispatch(setAdminData(response.user))
    dispatch(setAuth(true))
    dispatch(setAccessToken(response.accessToken))

  } catch (e) {
    console.log(e)
  }

}

export const logout = (): ThunkType => async (
    dispatch
) => {
  try {
    const response = await authAPI.logout()
     if(response.deletedCount === 1) {
       dispatch(setAccessToken(null))
       dispatch(setAdminData(null))
       dispatch(setAuth(false))
     }
  } catch (e) {
    console.log(e)
  }
}

export const registration = (values: RegistrationFormValues): ThunkType => async (dispatch) => {
  try {
    let response = await authAPI.registration(values.email, values.password)
    dispatch(setAuth(true))
    dispatch(setAdminData(response.user))
    dispatch(setAccessToken(response.accessToken))
    dispatch(setIsSuccessAC(true))
  } catch (e) {
    console.log(e)
  }
}

export const checkAuth = ():ThunkType => async (dispatch) => {
  try {
    let response = await authAPI.checkAuth()
    dispatch(setAccessToken(response.accessToken))
    dispatch(setAuth(true))
    dispatch(setAdminData(response.user))
  } catch (e) {
    console.log(e)
  }
}
