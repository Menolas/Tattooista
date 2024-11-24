import {AppStateType} from "../redux-store";

export const getUsersSelector = (state: AppStateType) => {
    return state.users.users;
};

export const getTotalCountSelector = (state: AppStateType) => {
    return state.users.totalCount;
};

export const getCurrentPageSelector = (state: AppStateType) => {
    return state.users.currentPage;
};

export const getPageLimitSelector = (state: AppStateType) => {
    return state.users.pageLimit;
};

export const getIsFetching = (state: AppStateType) => {
    return state.users.isFetching;
};

export const getFilterSelector = (state: AppStateType) => {
    return state.users.filter;
};

export const getRolesSelector = (state: AppStateType) => {
    return state.users.roles;
};

export const getUsersApiErrorSelector = (state: AppStateType) => {
    return state.users.usersApiError;
};

export const getUsersAccessErrorSelector = (state: AppStateType) => {
    return state.users.accessError;
};

export const getIsDeletingInProcessSelector = (state: AppStateType) => {
    return state.users.isDeletingInProcess;
}
