import { authAPI } from "./authApi";
import { ResultCodesEnum } from "../../utils/constants";
import { ThunkAction } from "redux-thunk";
import {AppStateType} from "../redux-store";
import {
    ApiErrorType,
    LoginFormValues,
    ReviewType,
    RoleType,
    UserType
} from "../../types/Types";
import {getUserRole} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
} from "../General/general-reducer";
import {
    deleteUserAC,
    DeleteUserAT,
} from "../Users/users-reducer";
import {AnyAction} from "redux";
import {usersAPI} from "../Users/usersApi";
import {setUsersApiErrorAC} from "../Users/users-reducer";
import {reviewsAPI} from "../Reviews/reviewsApi";

const SET_AUTH_API_ERROR = 'SET_AUTH_API_ERROR';
const LOG_OUT = 'LOG_OUT';
const LOG_IN = 'LOG_IN';
const SET_FROM = 'SET_FROM';
const SET_NEED_RELOGIN = 'SET_NEED_RELOGIN';
const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_REVIEWS = 'SET_REVIEWS';
const ADD_REVIEW = 'ADD_REVIEW';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_REGISTRATION_API_ERROR = 'SET_REGISTRATION_API_ERROR';

const initialState = {
  user: null as null | UserType,
  reviews: [] as Array<ReviewType>,
  reviewsTotalCount: 0 as number,
  roles: [] as Array<RoleType>,
  token: null as string | null,
  isAuth: null as string | null,
  from: null as string | null,
  authApiError: null as null | string,
  registrationApiError: null as null | string,
  needReLogin: false as boolean,
  loginError: null as null | string,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  accessError: null as null | string,
}

export type InitialStateType = typeof initialState;

export const authReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case TOGGLE_IS_FETCHING:
      return {
          ...state,
          isFetching: action.isFetching,
    }

    case LOG_IN:
      return {
        ...state,
        token: action.token,
        user: action.user,
        isAuth: action.isAuth,
        roles: action.roles,
        loginError: null,
        authApiError: null,
        accessError: null,
        registrationApiError: null,
        needReLogin: false
      }

    case LOG_OUT:
      return {
        ...state,
        token: null,
        user: null,
        isAuth: null,
        roles: [],
      }

    case SET_REGISTRATION_API_ERROR:
        return {
            ...state,
            registrationApiError: action.error,
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

      case SET_USER_PROFILE:
          return {
              ...state,
              user: action.user,
              isAuth: action.role
          }

      case SET_REVIEWS:
          return {
              ...state,
              reviews: action.reviews
          }

      case ADD_REVIEW:
          return {
              ...state,
              reviews: [{...action.review}, ...state.reviews],
              reviewsTotalCount: state.reviewsTotalCount + 1,
          }

      case TOGGLE_IS_DELETING_IN_PROCESS:
          return {
              ...state,
              isDeletingInProcess: action.isFetching
                  ? [...state.isDeletingInProcess, action.id]
                  : state.isDeletingInProcess.filter(id => id !== action.id)
          }

      case SET_ACCESS_ERROR:
          return {
              ...state,
              accessError: action.error
          }

      default: return state
  }
}

type ActionsTypes =
    | SetAuthApiErrorAT
    | SetSuccessModalAT
    | LogOutAT
    | LogInAT
    | SetFromAT
    | SetNeedReLoginAT
    | SetLoginErrorAT
    | ToggleIsFetchingAT
    | SetUserProfileAT
    | SetReviewsAT
    | AddUserReviewAT
    | ToggleIsDeletingInProcessAT
    | DeleteUserAT
    | SetAccessErrorAT
    | SetRegistrationApiErrorAT;

// actions creators

type SetRegistrationApiErrorAT = {
    type: typeof SET_REGISTRATION_API_ERROR;
    error: string | null;
};

export const setRegistrationApiErrorAC = (error: string | null): SetRegistrationApiErrorAT => ({
    type: SET_REGISTRATION_API_ERROR, error
});

export type SetAccessErrorAT = {
    type: typeof SET_ACCESS_ERROR;
    error: string | null;
};

export const setAccessErrorAC = (error: string | null): SetAccessErrorAT => ({
    type: SET_ACCESS_ERROR, error
});

type ToggleIsDeletingInProcessAT = {
    type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
    isFetching: boolean;
    id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

export type SetUserProfileAT = {
    type: typeof SET_USER_PROFILE;
    user: UserType;
    role: string;
};

export const setUserProfileAC = (
    user: UserType,
    role: string
): SetUserProfileAT => ({
    type: SET_USER_PROFILE, user, role
});

type AddUserReviewAT = {
    type: typeof ADD_REVIEW;
    review: ReviewType;
};

export const addUserReviewAC = (review: ReviewType): AddUserReviewAT => ({
    type: ADD_REVIEW, review
});

type SetReviewsAT = {
    type: typeof SET_REVIEWS;
    reviews: Array<ReviewType>;
};

export const setReviewsAC = (reviews: Array<ReviewType>): SetReviewsAT => ({
    type: SET_REVIEWS, reviews
});

type ToggleIsFetchingAT = {
    type: typeof TOGGLE_IS_FETCHING;
    isFetching: boolean;
}

const toggleIsFetchingAC = (isFetching: boolean): ToggleIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching,
});

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
    user: UserType;
    isAuth: string | null;
    roles: Array<RoleType>;
};

const logInAC = (
 token: null | string,
 user: UserType,
 isAuth: null | string,
 roles: Array<RoleType>
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

export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, AnyAction>;

export const login = (values: LoginFormValues): ThunkType => async (
    dispatch
) => {
  try {
    const response = await authAPI.login(values);
    if(response.resultCode === ResultCodesEnum.Success && response.userData.user) {
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
    values: FormData
): ThunkType => async (dispatch) => {
    try {
        const response = await authAPI.registration(values);
        if (response.resultCode === ResultCodesEnum.Success && response.userData.user) {
            dispatch(logInAC(
                response.userData.accessToken,
                response.userData.user,
                getUserRole(response.userData.user.roles, response.userData.roles),
                response.userData.roles
            ));
            dispatch(setAuthApiErrorAC(null));
            dispatch(setSuccessModalAC(true, "You successfully subscribed!"));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        const error = e as ApiErrorType;
        dispatch(setRegistrationApiErrorAC(error.response?.data?.message));
        console.log(error);
        return false;
    }
};


export const checkAuth = ():ThunkType => async (dispatch) => {

  try {
    const response = await authAPI.checkAuth();
    if (response.resultCode === ResultCodesEnum.Success && response.userData.isAuth === true) {
        if (response.userData.user) {
            const isAuth = getUserRole(response.userData.user.roles, response.userData.roles);
            dispatch(logInAC(
                response.userData.accessToken,
                response.userData.user,
                isAuth,
                response.userData.roles
            ));
        }
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

export const verifyEmail = (
    token: string | null
): ThunkType => async (dispatch) => {
    try {
        const response = await authAPI.verifyEmail(token);
        if (response.resultCode === ResultCodesEnum.Success) {
            if (response.userData.user) {
                dispatch(logInAC(
                    response.userData.accessToken,
                    response.userData.user,
                    getUserRole(response.userData.user.roles, response.userData.roles),
                    response.userData.roles
                ));
                localStorage.setItem('refreshToken', response.userData.refreshToken);
                return true;
            }
            return false;
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

export const deleteUserFromProfile = (
    token: string | null,
    id: string,
): ThunkType => async (
    dispatch
) => {
    try {
        dispatch(toggleIsDeletingInProcessAC(true, id));
        const response = await usersAPI.deleteUserFromProfile(token, id);
        if (response.resultCode === ResultCodesEnum.Success) {
            await dispatch(logout());
            dispatch(deleteUserAC(id));
            dispatch(setUsersApiErrorAC(null));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        const error = e as ApiErrorType;
        dispatch(setUsersApiErrorAC(error.response?.data?.message));
        console.log(e);
        return false;
    } finally {
        dispatch(toggleIsDeletingInProcessAC(false, id));
    }
};

export const getUsersReviews = (
    id: string
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        const response = await reviewsAPI.getUserReviews(id);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setReviewsAC(response.reviews));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        dispatch(toggleIsFetchingAC(false));
    }
};
