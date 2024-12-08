import {RoleType, SearchFilterType, UserType, ApiErrorType} from "../../types/Types";
import { ResultCodesEnum } from "../../utils/constants";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import { usersAPI } from "./usersApi";
import { getNewPage } from "../../utils/functions";
import {
    setSuccessModalAC,
    SetSuccessModalAT,
    setApiErrorAC,
    SetApiErrorAT} from "../General/general-reducer";
import {setNeedReLoginAC, SetNeedReLoginAT, setUserProfileAC, SetUserProfileAT} from "../Auth/auth-reducer";
import {AnyAction} from "redux";

const SET_USERS = 'SET_USERS';
const SET_PAGE_LIMIT = 'SET_PAGE_LIMIT';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_FILTER = 'SET_FILTER';
const DELETE_USER = 'DELETE_USER';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const SET_ROLES = 'SET_ROLES';
const EDIT_USER = 'EDIT_USER';
const ADD_USER = 'ADD_USER';
const SET_USERS_API_ERROR = 'SET_USERS_API_ERROR';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_USER_UPDATE_ERROR = 'SET_USER_UPDATE_ERROR';

const UPDATE_USER_SUCCESS = 'You successfully updated user info!';
const ADD_USER_SUCCESS = 'You successfully added new user!';


const initialState = {
    users: [] as Array<UserType>,
    roles: [] as Array<RoleType>,
    totalCount: 0 as number,
    isFetching: false as boolean,
    pageLimit: 5 as number,
    currentPage: 1 as number,
    isDeletingInProcess: [] as Array<string>,
    filter: {
        term: '',
        condition: 'any'
    } as SearchFilterType,
    usersApiError: null as string | null,
    userUpdateError: null as string | null,
    accessError: null as string | null,
};

export type InitialStateType = typeof initialState;

export const usersReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
    switch (action.type) {
        case SET_FILTER:
            return {
                ...state,
                filter: action.filter
            }

        case SET_USERS:
            return {
                ...state,
                users: action.users,
                totalCount: action.total,
            }

        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching,
            }

        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.page

            }

        case SET_PAGE_LIMIT:
            return {
                ...state,
                pageLimit: action.pageLimit
            }

        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId),
                totalCount: state.totalCount - 1,
            }

        case TOGGLE_IS_DELETING_IN_PROCESS:
            return {
                ...state,
                isDeletingInProcess: action.isFetching
                    ? [...state.isDeletingInProcess, action.id]
                    : state.isDeletingInProcess.filter(id => id !== action.id)
            }

        case SET_ROLES:
            return {
                ...state,
                roles: action.roles
            }

        case EDIT_USER:
            return {
                ...state,
                users: state.users.map(user => {
                    if (user._id === action.user._id) {
                        return { ...action.user }
                    }

                    return user
                })
            }

        case ADD_USER:
            return {
                ...state,
                users: [{...action.user}, ...state.users ],
                totalCount: state.totalCount + 1,
            }

        case SET_USERS_API_ERROR:
            return {
                ...state,
                usersApiError: action.error
            }

        case SET_USER_UPDATE_ERROR:
        return {
            ...state,
            userUpdateError: action.error
        }

        case SET_ACCESS_ERROR:
            return {
                ...state,
                accessError: action.error
            }

        default: return state
    }
};

type ActionsTypes =
    | SetUsersFilterAT
    | SetUsersAT
    | ToggleIsFetchingAT
    | SetUsersCurrentPageAT
    | SetPageLimitAT
    | DeleteUserAT
    | ToggleIsDeletingInProcessAT
    | SetRolesAT
    | EditUserAT
    | AddUserAT
    | SetAccessErrorAT
    | SetSuccessModalAT
    | SetApiErrorAT
    | SetUsersApiErrorAT
    | SetNeedReLoginAT
    | SetUserUpdateErrorAT
    | SetUserProfileAT;

//actions creators

type SetUserUpdateErrorAT = {
    type: typeof SET_USER_UPDATE_ERROR;
    error: string | null;
};

export const setUserUpdateErrorAC = (error: string | null): SetUserUpdateErrorAT => ({
    type: SET_USER_UPDATE_ERROR, error
});

type SetUsersApiErrorAT = {
    type: typeof SET_USERS_API_ERROR;
    error: string | null;
};

export const setUsersApiErrorAC = (error: string | null): SetUsersApiErrorAT => ({
    type: SET_USERS_API_ERROR, error
});

type SetAccessErrorAT = {
    type: typeof SET_ACCESS_ERROR;
    error: string | null;
};

export const setAccessErrorAC = (error: string | null): SetAccessErrorAT => ({
    type: SET_ACCESS_ERROR, error
});

type AddUserAT = {
    type: typeof ADD_USER;
    user: UserType;
};

const addUserAC = (user: UserType): AddUserAT => ({
        type: ADD_USER, user
});

type SetUsersFilterAT = {
    type: typeof SET_FILTER;
    filter: SearchFilterType;
};

export const setUsersFilterAC = (filter: SearchFilterType): SetUsersFilterAT => ({
        type: SET_FILTER, filter
});

type SetUsersAT = {
    type: typeof SET_USERS;
    users: Array<UserType>;
    total: number;
};

export const setUsersAC = (users: Array<UserType>, total: number): SetUsersAT => ({
    type: SET_USERS, users, total
});

type ToggleIsFetchingAT = {
    type: typeof TOGGLE_IS_FETCHING;
    isFetching: boolean;
}

const toggleIsFetchingAC = (isFetching: boolean): ToggleIsFetchingAT => ({
        type: TOGGLE_IS_FETCHING, isFetching,
});

type SetUsersCurrentPageAT = {
    type: typeof SET_CURRENT_PAGE;
    page: number;
};

export const setCurrentPageAC = (page: number): SetUsersCurrentPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type SetPageLimitAT = {
    type: typeof SET_PAGE_LIMIT;
    pageLimit: number;
};

export const setPageLimitAC = (pageLimit: number): SetPageLimitAT => ({
    type: SET_PAGE_LIMIT, pageLimit
});

export type DeleteUserAT = {
    type: typeof DELETE_USER;
    userId: string;
};

export const deleteUserAC = (userId: string): DeleteUserAT => ({
    type: DELETE_USER, userId
});

type ToggleIsDeletingInProcessAT = {
    type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
    isFetching: boolean;
    id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetRolesAT = {
    type: typeof SET_ROLES;
    roles: Array<RoleType>;
};

const setRolesAC = (roles: Array<RoleType>): SetRolesAT => ({
    type: SET_ROLES, roles
});

type EditUserAT = {
    type: typeof EDIT_USER;
    user: UserType;
};

const editUserAC = (user: UserType): EditUserAT => ({
    type: EDIT_USER, user
});

//export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>;
export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, AnyAction>;

export const getRoles = (): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        const response = await usersAPI.getRoles();
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setRolesAC(response.roles));
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

export const getUsers = (
    token: string | null,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        const response = await usersAPI.getUsers(
            token,
            currentPage,
            pageLimit,
            filter
        );
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setAccessErrorAC(null));
            dispatch(setUsersAC(response.users, response.totalCount));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        const error = e as ApiErrorType;
        if (error.response?.status === 403 || error.response?.status === 401) {
            dispatch(setAccessErrorAC(error.response.data.message));
            dispatch(setNeedReLoginAC(true));
        } else {
            console.log(error);
        }
        return false;
    } finally {
        dispatch(toggleIsFetchingAC(false));
    }
};

const deleteUserThunk = (
    token: string | null,
    id: string,
    users: Array<UserType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
    if (users.length > 1) {
        dispatch(deleteUserAC(id));
    } else {
        const newPage = getNewPage(currentPage);
        if (currentPage === newPage) {
            await dispatch(getUsers(token, newPage, pageLimit, filter));
        }
        dispatch(deleteUserAC(id));
        dispatch(setCurrentPageAC(newPage));
    }
    return true;
};

export const deleteUser = (
    token: string | null,
    id: string,
    users: Array<UserType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
    try {
        dispatch(toggleIsDeletingInProcessAC(true, id));
        const response = await usersAPI.deleteUser(token, id);
        if (response.resultCode === ResultCodesEnum.Success) {
            await dispatch(deleteUserThunk(token, id, users, currentPage, pageLimit, filter));
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

export const updateUser = (
    fromProfile: boolean,
    token: string | null,
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        const response = !fromProfile ? await usersAPI.updateUser(token, id, values) : await usersAPI.updateUserFromProfile(token, id, values);
        if (response.resultCode === ResultCodesEnum.Success) {
            if (fromProfile) {
                dispatch(setUserProfileAC(response.user));
            }
            dispatch(editUserAC(response.user));
            dispatch(setUserUpdateErrorAC(null));
            dispatch(setSuccessModalAC(true, UPDATE_USER_SUCCESS));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        const error = e as ApiErrorType;
        dispatch(setUserUpdateErrorAC(error.response?.data?.message));
        return false;
    } finally {
        dispatch(toggleIsFetchingAC(false));
    }
};

export const addUser = (
    token: string | null,
    values: FormData,
): ThunkType => async (dispatch) => {
    try {
        const response = await usersAPI.addUser(token, values);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(addUserAC(response.user));
            dispatch(setApiErrorAC(null));
            dispatch(setSuccessModalAC(true, ADD_USER_SUCCESS));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        const error = e as ApiErrorType;
        dispatch(setApiErrorAC(error.response?.data?.message));
        return false;
    }
};
