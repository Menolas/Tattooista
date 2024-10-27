import { authAPI } from "./authApi";
import { ResultCodesEnum } from "../../utils/constants";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import {ApiErrorType, LoginFormValues, RegistrationFormValues, RoleType} from "../../types/Types";
import { IUser } from "../../types/Types";
import {getUserRole} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
} from "../General/general-reducer";

const SET_AUTH_API_ERROR = 'SET_AUTH_API_ERROR';
const LOG_OUT = 'LOG_OUT';
const LOG_IN = 'LOG_IN';
const SET_FROM = 'SET_FROM';
const SET_NEED_RELOGIN = 'SET_NEED_RELOGIN';
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';

const initialState = {
  user: {} as IUser | null | undefined,
  roles: [] as Array<RoleType> | null,
  token: null as string | null,
  isAuth: null as string | null,
  from: null as string | null,
  authApiError: null as null | string,
  needReLogin: false as boolean,
  loginError: null as null | string,
}

export type InitialStateType = typeof initialState;

export const authReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case LOG_IN:
      return {
        ...state,
        token: action.token,
        user: action.user,
        isAuth: action.isAuth,
        roles: action.roles,
        loginError: null,
        authApiError: null,
        needReLogin: false
      }

    case LOG_OUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuth: null,
        roles: null,
      }

    case SET_AUTH_API_ERROR:
      return {
        ...state,
        authApiError: action.error,
      }

    case SET_FROM:
        return {
            ...state,
            from: action.from
        }

    case SET_NEED_RELOGIN:
        return {
            ...state,
            needReLogin: action.needReLogin
        }

      case SET_LOGIN_ERROR:
          return {
              ...state,
              loginError: action.loginError
          }

      default: return state
  }
}

type ActionsTypes = SetAuthApiErrorAT | SetSuccessModalAT |
     LogOutAT | LogInAT | SetFromAT | SetNeedReLoginAT | SetLoginErrorAT;

// actions creators

export type SetNeedReLoginAT = {
    type: typeof SET_NEED_RELOGIN;
    needReLogin: boolean;
};

export const setNeedReLoginAC = (needReLogin: boolean): SetNeedReLoginAT => ({
    type: SET_NEED_RELOGIN, needReLogin
});

type SetFromAT = {
    type: typeof SET_FROM;
    from: string | null;
};

export const setFromAC = (from: string | null): SetFromAT => ({
    type: SET_FROM, from
});

type LogOutAT = {
    type: typeof LOG_OUT;
};

const logOutAC = (): LogOutAT => ({
    type: LOG_OUT
});

export type LogInAT = {
    type: typeof LOG_IN;
    token: string | null;
    user: IUser | null;
    isAuth: string | null;
    roles: Array<RoleType> | null;
};

const logInAC = (
 token: null | string,
 user: null | IUser,
 isAuth: null | string,
 roles: null | Array<RoleType>
): LogInAT => ({
    type: LOG_IN, token, user, isAuth, roles
});

type SetAuthApiErrorAT = {
    type: typeof SET_AUTH_API_ERROR;
    error: null | string;
};

export const setAuthApiErrorAC = (error: null | string): SetAuthApiErrorAT => ({
    type: SET_AUTH_API_ERROR, error
});

type SetLoginErrorAT = {
    type: typeof SET_LOGIN_ERROR;
    loginError: null | string;
};

export const setLoginErrorAC = (loginError: null | string): SetLoginErrorAT => ({
    type: SET_LOGIN_ERROR, loginError
});

//thunks

export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>;

export const login = (values: LoginFormValues): ThunkType => async (
    dispatch
) => {
  try {
    const response = await authAPI.login(values);
    if(response.resultCode === ResultCodesEnum.Success) {
      dispatch(logInAC(
            response.userData.accessToken,
            response.userData.user,
            getUserRole(response.userData.user.roles, response.userData.roles),
            response.userData.roles
      ));
      localStorage.setItem('refreshToken', response.userData.refreshToken);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    console.log(error.response.data.message);
    dispatch(setLoginErrorAC(error.response?.data?.message));
    return false;
  }
};

export const logout = (): ThunkType => async (
    dispatch
) => {
  try {
    const response = await authAPI.logout();
     if(response.resultCode === ResultCodesEnum.Success) {
       dispatch(logOutAC());
       localStorage.removeItem('refreshToken');
       return true;
     } else {
       return false;
     }
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const registration = (
    values: RegistrationFormValues
): ThunkType => async (dispatch) => {
    try {
      const response = await authAPI.registration(values);
      if (response.resultCode === ResultCodesEnum.Success) {
        dispatch(logInAC(
            response.userData.accessToken,
            response.userData.user,
            getUserRole(response.userData.user.roles, response.userData.roles),
            response.userData.roles
        ));
        dispatch(setSuccessModalAC(true, "You successfully subscribed!"));
        return true;
      } else {
        return false;
      }
    } catch (e) {
      const error = e as ApiErrorType;
      dispatch(setAuthApiErrorAC(error.response?.data?.message));
      console.log(error);
      return false;
    }
};

export const checkAuth = ():ThunkType => async (dispatch) => {

  try {
    const response = await authAPI.checkAuth();
    if (response.resultCode === ResultCodesEnum.Success && response.userData.isAuth === true) {
        const isAuth = getUserRole(response.userData.user.roles, response.userData.roles);
        dispatch(logInAC(
            response.userData.accessToken,
            response.userData.user,
            isAuth,
            response.userData.roles
        ));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(logOutAC());
    dispatch(setNeedReLoginAC(true));
    dispatch(setAuthApiErrorAC(error.response?.data?.message));
    console.log(error);
    return false;
  }
};
