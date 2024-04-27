import { authAPI } from "./authApi";
import { ResultCodesEnum } from "../../utils/constants";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import {LoginFormValues, RegistrationFormValues, RoleType} from "../../types/Types";
import { IUser } from "../../types/Types";
import {getUserRole} from "../../utils/functions";

const SET_USER_DATA = 'SET_USER_DATE';
const SET_ROLES = 'SET_ROLES';
const SET_AUTH = 'SET_AUTH';
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
const SET_IS_SUCCESS = 'SET_IS_SUCCESS';
const SET_REGISTRATION_ERROR = 'SET_REGISTRATION_ERROR';
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';

let initialState = {
  user: {} as IUser | null,
  roles: [] as Array<RoleType>,
  token: null as string | null | undefined,
  isAuth: null as string | null,
  isSuccess: false as boolean,
  registrationError: '' as string | undefined,
  loginError: '' as string | undefined
}

export type InitialStateType = typeof initialState;

export const authReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
  //console.log(state.isAuth + " isAuth in state!!!!!!!!!!!!!!!!!!!!!!!!!!")

  switch (action.type) {
    case SET_ROLES:
      return {
        ...state,
        roles: action.roles
      }

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

type ActionsTypes = SetLoginErrorAT | SetRegistrationErrorAT | SetIsSuccessAT | SetTokenAT |
    SetUserDataAT | SetAuthAT | SetRolesAT;

// actions creators

type SetRolesAT = {
  type: typeof SET_ROLES,
  roles: Array<RoleType>
}

const setRolesAC = (roles: Array<RoleType>): SetRolesAT => ({
  type: SET_ROLES, roles
})

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
  isAuth: null | string
}

const setAuth = (isAuth: null | string): SetAuthAT => ({
    type: SET_AUTH, isAuth
})

//thunks

export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const login = (values: LoginFormValues): ThunkType => async (
    dispatch
) => {
  try {
    let response = await authAPI.login(values);
    if(response.resultCode === 0) {
      dispatch(setLoginErrorAC(''));
      dispatch(setUserDataAC(response.userData.user));
      dispatch(setAuth(getUserRole(response.userData.user.roles, response.userData.roles)));
      dispatch(setAccessTokenAC(response.userData.accessToken));
      dispatch(setRolesAC(response.userData.roles));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setLoginErrorAC(e.response.data.message));
  }
}

export const logout = (): ThunkType => async (
    dispatch
) => {
  try {
    const response = await authAPI.logout();
     if(response.resultCode === 0) {
       dispatch(setAccessTokenAC(null));
       dispatch(setUserDataAC(null));
       dispatch(setAuth(null));
     }
  } catch (e) {
    console.log(e);
  }
}

export const registration = (values: RegistrationFormValues): ThunkType => async (dispatch) => {
  try {
    let response = await authAPI.registration(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setRegistrationErrorAC(''));
      dispatch(setAuth(getUserRole(response.userData.user.roles, response.userData.roles)));
      //console.log("getUserRole in registration");
      dispatch(setUserDataAC(response.userData.user));
      dispatch(setAccessTokenAC(response.userData.accessToken));
      dispatch(setIsSuccessAC(true));
      dispatch(setRolesAC(response.userData.roles));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setRegistrationErrorAC(e.response.data.message));
    // @ts-ignore
    console.log(e.response.data.message);
  }
}

export const checkAuth = ():ThunkType => async (dispatch) => {

  try {
    let response = await authAPI.checkAuth();
    if (response.resultCode === ResultCodesEnum.Success) {
      if (response.userData.isAuth === true) {
        dispatch(setAccessTokenAC(response.userData.accessToken));
        dispatch(setUserDataAC(response.userData.user));
        dispatch(setRolesAC(response.userData.roles));
        dispatch(setAuth(getUserRole(response.userData.user.roles, response.userData.roles)));
      }
    }
  } catch (e: any) {
    console.log(e.response?.data?.message);
  }
}
