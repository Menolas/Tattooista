import { authAPI } from './authApi'
import { ResultCodesEnum } from '../../utils/constants'
import {ThunkAction} from "redux-thunk"
import {AppStateType} from "../redux-store"
import {LoginFormValues} from "../../types/Types"

const SET_ADMIN_DATA = 'SET_ADMIN_DATE'
const SET_AUTH = 'SET_AUTH'

export type InitialStateType = {
  userId: string | null
  username: string | null
  password: string | null
  token: string | null
  isAuth: boolean
}

let initialState: InitialStateType = {
  userId: null,
  username: null,
  password: null,
  token: null,
  isAuth: false
}

export const authReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case SET_ADMIN_DATA:
      return {
        ...state,
        ...action.payload,
      }

    case SET_AUTH:
      return {
        ...state,
        isAuth: action.isAuth
      }

    default: return state
  }
}

type ActionsTypes = SetAdminDataActionType | SetAuthActionType

type SetAdminDataActionPayloadType = {
  userId: string | null
  username: string | null
  password: string | null
  token: string | null
}

type SetAdminDataActionType = {
  type: typeof SET_ADMIN_DATA,
  payload: SetAdminDataActionPayloadType
}

const setAdminData = (
    userId: string | null,
    username: string | null,
    password: string | null,
    token: string | null
): SetAdminDataActionType => (
  {
    type: SET_ADMIN_DATA,
    payload: { userId, username, password, token }
  }
)

type SetAuthActionType = {
  type: typeof SET_AUTH
  isAuth: boolean
}

const setAuth = (isAuth: boolean): SetAuthActionType => (
  {
    type: SET_AUTH, isAuth
  }
)

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
  //debugger
  try {
    let response = await authAPI.login(values)
    if (response.resultCode === ResultCodesEnum.Success && response.user) {
      dispatch(setAdminData(
          response.user._id,
          response.user.username,
          response.user.password,
          response.user.token
      ))
      await dispatch(getAuthAdminData(response.user.token))
    }
    if (response.resultCode === ResultCodesEnum.Error) {
      console.log(response.error)
    }
  } catch (e) {
    console.log(e)
  }

}

export const logout = (
    userId: string
): ThunkType => async (
    dispatch
) => {
  try {
    let response = await authAPI.logout(userId)
    if (response === ResultCodesEnum.Success) {
      dispatch(setAdminData(null, null, null, null))
      dispatch(setAuth(false))
    }
  } catch (e) {
    console.log(e)
  }
}
