import { authAPI } from "./authApi";
import { ResultCodesEnum } from "../../utils/constants";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import {LoginFormValues, RegistrationFormValues, RoleType} from "../../types/Types";
import { IUser } from "../../types/Types";
import {getUserRole} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
} from "../General/general-reducer";

const SET_USER_DATA = 'SET_USER_DATE';
const SET_ROLES = 'SET_ROLES';
const SET_AUTH = 'SET_AUTH';
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
const SET_REGISTRATION_ERROR = 'SET_REGISTRATION_ERROR';
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
const CHECK_AUTH = 'CHECK_AUTH';

let initialState = {
  user: {} as IUser | null,
  roles: [] as Array<RoleType> | null,
  token: null as string | null | undefined,
  isAuth: null as string | null,
  registrationError: '' as string,
  loginError: '' as string,
}

export type InitialStateType = typeof initialState;

export const authReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

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

    case CHECK_AUTH:
      return {
        ...state,
        token: action.accessToken,
        user: action.user,
        roles: action.roles,
        isAuth: action.isAuth,
      }

    default: return state
  }
}

type ActionsTypes = SetLoginErrorAT | SetRegistrationErrorAT | SetSuccessModalAT | SetTokenAT |
    SetUserDataAT | SetAuthAT | SetRolesAT | CheckAuthAT;

// actions creators

type SetRolesAT = {
  type: typeof SET_ROLES,
  roles: Array<RoleType>
}

const setRolesAC = (roles: Array<RoleType>): SetRolesAT => ({
  type: SET_ROLES, roles
});

type SetLoginErrorAT = {
  type: typeof SET_LOGIN_ERROR
  error: string
}

const setLoginErrorAC = (error: string): SetLoginErrorAT => ({
  type: SET_LOGIN_ERROR, error
});

type SetRegistrationErrorAT = {
  type: typeof  SET_REGISTRATION_ERROR
  error: string
}

const setRegistrationErrorAC = (error: string): SetRegistrationErrorAT => ({
  type: SET_REGISTRATION_ERROR, error
});

type SetTokenAT = {
  type: typeof SET_ACCESS_TOKEN,
  token: null | string
}

const setAccessTokenAC = (token: string | null): SetTokenAT => ({
  type: SET_ACCESS_TOKEN, token
});

type SetUserDataAT = {
  type: typeof SET_USER_DATA,
  user: IUser | null
}

const setUserDataAC = (
    user: IUser | null
): SetUserDataAT => ({
    type: SET_USER_DATA, user
});

type SetAuthAT = {
  type: typeof SET_AUTH
  isAuth: null | string
}

const setAuthAC = (isAuth: null | string): SetAuthAT => ({
    type: SET_AUTH, isAuth
});

export type CheckAuthAT = {
  type: typeof CHECK_AUTH;
  user: IUser | null;
  accessToken: string | null;
  roles: Array<RoleType> | null;
  isAuth: string | null;
}

export const checkAuthAC = (
    user: IUser | null,
    accessToken: string | null,
    roles: Array<RoleType> | null,
    isAuth: string | null
): CheckAuthAT => ({
    type: CHECK_AUTH, user, accessToken, roles, isAuth
});

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
      dispatch(setAuthAC(getUserRole(response.userData.user.roles, response.userData.roles)));
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
       dispatch(setAuthAC(null));
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
      dispatch(setAuthAC(getUserRole(response.userData.user.roles, response.userData.roles)));
      //console.log("getUserRole in registration");
      dispatch(setUserDataAC(response.userData.user));
      dispatch(setAccessTokenAC(response.userData.accessToken));
      dispatch(setSuccessModalAC(true, "You successfully subscribed!"));
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
        const isAuth = getUserRole(response.userData.user.roles, response.userData.roles);
        dispatch(checkAuthAC(
            response.userData.user,
            response.userData.accessToken,
            response.userData.roles,
            isAuth
        ));
      }
      if (response.userData.isAuth === false) {
        dispatch(checkAuthAC(
            null,
            null,
            null,
            null
        ));
      }
    }
  } catch (e: any) {
    console.log(e.response?.data?.message);
  }
}
