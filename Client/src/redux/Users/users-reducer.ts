import type {} from "redux-thunk/extend-redux"
import { UserType } from "../../types/Types"
import { ResultCodesEnum } from "../../utils/constants"
import { AppStateType } from "../redux-store"
import { ThunkAction } from "redux-thunk"
import {usersAPI} from "./usersApi"
import {ClientsFilterType} from "../Clients/clients-reducer";

const SET_USERS = 'SET_USERS'
const SET_USERS_TOTAL_COUNT = 'SET_USERS_TOTAL_COUNT'
const SET_USERS_PAGE_LIMIT = 'SET_PAGE_LIMIT'
const SET_USERS_CURRENT_PAGE = 'SET_CURRENT_PAGE'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_USERS_FILTER = 'SET_USERS_FILTER'

let initialState = {
    users: [] as Array<UserType>,
    totalUsersCount: 0 as number,
    usersIsFetching: false as boolean,
    pageLimit: 5 as number,
    currentPage: 1 as number,
    isDeletingInProcess: [] as Array<string>,
    usersFilter: {
        term: '' as string | null,
        role: "any" as string | null
    }
}

export type InitialStateType = typeof initialState
export type UsersFilterType = typeof initialState.usersFilter

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

        default: return state
    }
}

type ActionsTypes = SetUsersFilterAT | SetUsersAT | ToggleIsFetchingAT |
    SetUsersTotalCountAT | SetUsersCurrentPageAT | SetPageLimitAT

//actions creators

type SetUsersFilterAT = {
    type: typeof SET_USERS_FILTER
    filter: UsersFilterType
}

export const setClientsFilterAC = (filter: UsersFilterType): SetUsersFilterAT => (
    {
        type: SET_USERS_FILTER, filter
    }
)

type SetUsersAT = {
    type: typeof SET_USERS
    users: Array<UserType>
}

export const setUsersAC = (users: Array<UserType>): SetUsersAT => ({
    type: SET_USERS, users
})

type ToggleIsFetchingAT = {
    type: typeof TOGGLE_IS_FETCHING,
    isFetching: boolean,
}

const toggleIsFetchingAC = (isFetching: boolean): ToggleIsFetchingAT => ({
        type: TOGGLE_IS_FETCHING, isFetching,
})

type SetUsersTotalCountAT = {
    type: typeof SET_USERS_TOTAL_COUNT,
    total: number
}

const setUsersTotalCountAC = (total: number): SetUsersTotalCountAT => ({
    type: SET_USERS_TOTAL_COUNT, total
})

type SetUsersCurrentPageAT = {
    type: typeof SET_USERS_CURRENT_PAGE,
    page: number
}

export const setUsersCurrentPageAC = (page: number): SetUsersCurrentPageAT => ({
    type: SET_USERS_CURRENT_PAGE, page
})

type SetPageLimitAT = {
    type: typeof SET_USERS_PAGE_LIMIT,
    pageLimit: number
}

export const setUsersPageLimitAC = (pageLimit: number): SetPageLimitAT => ({
    type: SET_USERS_PAGE_LIMIT, pageLimit
})

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getUsers = (
    currentPage: number,
    pageLimit: number,
    filter: UsersFilterType
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true))
        let response = await usersAPI.getUsers(
            currentPage,
            pageLimit,
            filter
        )
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setUsersAC(response.users))
            dispatch(setUsersTotalCountAC(response.totalCount))
        }
    } catch (e) {
        console.log(e)
    } finally {
        dispatch(toggleIsFetchingAC(false))
    }
}
