import type {} from "redux-thunk/extend-redux";
import { RoleType, UserType } from "../../types/Types";
import { ResultCodesEnum } from "../../utils/constants";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import { usersAPI } from "./usersApi";
import { getNewPage } from "../../utils/functions";

const SET_USERS = 'SET_USERS';
const SET_USERS_TOTAL_COUNT = 'SET_USERS_TOTAL_COUNT';
const SET_USERS_PAGE_LIMIT = 'SET_PAGE_LIMIT';
const SET_USERS_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_USERS_FILTER = 'SET_USERS_FILTER';
const DELETE_USER = 'DELETE_USER';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const SET_ROLES = 'SET_ROLES';
const EDIT_USER = 'EDIT_USER';
const ADD_USER = 'ADD_USER';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_API_ERROR = 'SET_API_ERROR';

const UPDATE_USER_SUCCESS = 'You successfully updated user info!';
const ADD_USER_SUCCESS = 'You successfully added new user!';


let initialState = {
    users: [] as Array<UserType>,
    roles: [] as Array<RoleType>,
    totalUsersCount: 0 as number,
    usersIsFetching: false as boolean,
    pageLimit: 5 as number,
    currentPage: 1 as number,
    isDeletingInProcess: [] as Array<string>,
    usersFilter: {
        term: '' as string | null,
        condition: 'any' as string | null
    },
    accessError: '' as string | undefined,
    successModal: {
        isSuccess: false as boolean,
        successText: '' as string,
    },
    apiError: '' as string
}

export type InitialStateType = typeof initialState;
export type UsersFilterType = typeof initialState.usersFilter;

export const usersReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
    switch (action.type) {
        case SET_USERS_FILTER:
            return {
                ...state,
                usersFilter: action.filter
            }

        case SET_USERS:
            return {
                ...state,
                users: action.users
            }

        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                usersIsFetching: action.isFetching,
            }

        case SET_USERS_TOTAL_COUNT:
            return {
                ...state,
                totalUsersCount: action.total
            }

        case SET_USERS_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.page

            }

        case SET_USERS_PAGE_LIMIT:
            return {
                ...state,
                pageLimit: action.pageLimit
            }

        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
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
            }

        case SET_SUCCESS_MODAL:
            return {
                ...state,
                successModal: {
                    isSuccess: action.isSuccess,
                    successText: action.text
                }
            }

        case SET_ACCESS_ERROR:
            return {
                ...state,
                accessError: action.error
            }

        case SET_API_ERROR:
            return {
                ...state,
                apiError: action.apiError
            }

        default: return state
    }
}

type ActionsTypes = SetUsersFilterAT | SetUsersAT | ToggleIsFetchingAT |
    SetUsersTotalCountAT | SetUsersCurrentPageAT | SetPageLimitAT | DeleteUserAT |
    ToggleIsDeletingInProcessAT | SetRolesAT | EditUserAT | AddUserAT
    | SetAccessErrorAT | SetSuccessModalAT | SetApiErrorAT;

//actions creators

type SetApiErrorAT = {
    type: typeof SET_API_ERROR
    apiError: string
}

export const setApiErrorAC = (apiError: string): SetApiErrorAT => ({
    type: SET_API_ERROR, apiError
});

type SetSuccessModalAT = {
    type: typeof SET_SUCCESS_MODAL
    isSuccess: boolean
    text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
    type: SET_SUCCESS_MODAL, isSuccess, text
});

type SetAccessErrorAT = {
    type: typeof SET_ACCESS_ERROR
    error: string | undefined
}

export const setAccessErrorAC = (error: string | undefined): SetAccessErrorAT => ({
    type: SET_ACCESS_ERROR, error
});

type AddUserAT = {
    type: typeof ADD_USER,
    user: UserType
}

const addUserAC = (user: UserType): AddUserAT => ({
        type: ADD_USER, user
});

type SetUsersFilterAT = {
    type: typeof SET_USERS_FILTER
    filter: UsersFilterType
}

export const setUsersFilterAC = (filter: UsersFilterType): SetUsersFilterAT => ({
        type: SET_USERS_FILTER, filter
});

type SetUsersAT = {
    type: typeof SET_USERS
    users: Array<UserType>
}

export const setUsersAC = (users: Array<UserType>): SetUsersAT => ({
    type: SET_USERS, users
});

type ToggleIsFetchingAT = {
    type: typeof TOGGLE_IS_FETCHING,
    isFetching: boolean,
}

const toggleIsFetchingAC = (isFetching: boolean): ToggleIsFetchingAT => ({
        type: TOGGLE_IS_FETCHING, isFetching,
});

type SetUsersTotalCountAT = {
    type: typeof SET_USERS_TOTAL_COUNT,
    total: number
}

const setUsersTotalCountAC = (total: number): SetUsersTotalCountAT => ({
    type: SET_USERS_TOTAL_COUNT, total
});

type SetUsersCurrentPageAT = {
    type: typeof SET_USERS_CURRENT_PAGE,
    page: number
}

export const setUsersCurrentPageAC = (page: number): SetUsersCurrentPageAT => ({
    type: SET_USERS_CURRENT_PAGE, page
});

type SetPageLimitAT = {
    type: typeof SET_USERS_PAGE_LIMIT,
    pageLimit: number
}

export const setUsersPageLimitAC = (pageLimit: number): SetPageLimitAT => ({
    type: SET_USERS_PAGE_LIMIT, pageLimit
});

type DeleteUserAT = {
    type: typeof DELETE_USER,
    userId: string
}

const deleteUserAC = (userId: string): DeleteUserAT => ({
    type: DELETE_USER, userId
});

type ToggleIsDeletingInProcessAT = {
    type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
    isFetching: boolean,
    id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetRolesAT = {
    type: typeof SET_ROLES,
    roles: Array<RoleType>
}

const setRolesAC = (roles: Array<RoleType>): SetRolesAT => ({
    type: SET_ROLES, roles
});

type EditUserAT = {
    type: typeof EDIT_USER,
    user: UserType
}

const editUserAC = (user: UserType): EditUserAT => ({
    type: EDIT_USER, user
});

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getRoles = (): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        let response = await usersAPI.getRoles();
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setRolesAC(response.roles));
        }
    } catch (e) {
        console.log(e);
    } finally {
        dispatch(toggleIsFetchingAC(false));
    }
}

export const getUsers = (
    token: string,
    currentPage: number,
    pageLimit: number,
    filter: UsersFilterType
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        let response = await usersAPI.getUsers(
            token,
            currentPage,
            pageLimit,
            filter
        );
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setAccessErrorAC(''));
            dispatch(setUsersAC(response.users));
            dispatch(setUsersTotalCountAC(response.totalCount));
        }
    } catch (e) {
        // @ts-ignore
        dispatch(setAccessErrorAC(e.response.message));
        console.log(e);
    } finally {
        dispatch(toggleIsFetchingAC(false));
    }
}

const deleteUserThunk = (
    token: string,
    id: string,
    users: Array<UserType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: UsersFilterType
): ThunkType => async (dispatch) => {
    if (users.length > 1) {
        dispatch(deleteUserAC(id));
        dispatch(setUsersTotalCountAC(total -1));
    } else {
        const newPage = getNewPage(currentPage);
        if (currentPage === newPage) {
            await dispatch(getUsers(token, newPage, pageLimit, filter));
        }
        dispatch(deleteUserAC(id));
        dispatch(setUsersCurrentPageAC(newPage));
    }
}

export const deleteUser = (
    token: string,
    id: string,
    users: Array<UserType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: UsersFilterType
): ThunkType => async (
    dispatch
) => {
    try {
        dispatch(toggleIsDeletingInProcessAC(true, id));
        let response = await usersAPI.deleteUser(id);
        if (response.resultCode === ResultCodesEnum.Success) {
            await dispatch(deleteUserThunk(token, id, users, currentPage, total, pageLimit, filter));
        }
    } catch (e) {
        console.log(e);
    } finally {
        dispatch(toggleIsDeletingInProcessAC(false, id));
    }
}

export const updateUser = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        let response = await usersAPI.updateUser(id, values);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setApiErrorAC(''));
            dispatch(editUserAC(response.user));
            dispatch(setSuccessModalAC(true, UPDATE_USER_SUCCESS));
        }
    } catch (e: any) {
        dispatch(setApiErrorAC(e.response.message));
    } finally {
        dispatch(toggleIsFetchingAC(false));
    }

}

export const addUser = (
    values: FormData,
    total: number
): ThunkType => async (dispatch) => {
    try {
        let response = await usersAPI.addUser(values);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(addUserAC(response.user));
            dispatch(setSuccessModalAC(true, ADD_USER_SUCCESS));
            dispatch(setUsersTotalCountAC(total + 1));
        }
    } catch (e: any) {
        dispatch(setApiErrorAC(e.response.data.message));
    }
}
