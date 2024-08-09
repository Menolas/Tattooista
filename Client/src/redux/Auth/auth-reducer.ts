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

const initialState = {
  user: {} as IUser | null | undefined,
  roles: [] as Array<RoleType> | null,
  token: null as string | null | undefined,
  isAuth: null as string | null,
  from: null as string | null,
  authApiError: null as null | string,
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
        authApiError: null,
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
        authApiError: action.error
      }

    default: return state
  }
}

type ActionsTypes = SetAuthApiErrorAT | SetSuccessModalAT |
     LogOutAT | LogInAT | SetFromAT;

// actions creators

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

const setAuthApiErrorAC = (error: null | string): SetAuthApiErrorAT => ({
    type: SET_AUTH_API_ERROR, error
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
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    console.log(error.response.data.message);
    dispatch(setAuthApiErrorAC(error.response?.data?.message));
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
  //TO_DO: add api error and error message for user

  try {
    const response = await authAPI.checkAuth();
    if (response.resultCode === ResultCodesEnum.Success) {
      if (response.userData.isAuth === true) {
        const isAuth = getUserRole(response.userData.user.roles, response.userData.roles);
        dispatch(logInAC(
            response.userData.accessToken,
            response.userData.user,
            isAuth,
            response.userData.roles
        ));
      }
      if (response.userData.isAuth === false) {
        dispatch(logOutAC());
      }
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    console.log(error.response?.data?.message);
    return false;
  }
};
