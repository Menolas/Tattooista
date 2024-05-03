import {AppStateType} from "../redux-store";

export const getUsersSelector = (state: AppStateType) => {
    return state.users.users;
}

export const getTotalCountSelector = (state: AppStateType) => {
    return state.users.totalCount;
}

export const getCurrentPageSelector = (state: AppStateType) => {
    return state.users.currentPage;
}

export const getPageLimitSelector = (state: AppStateType) => {
    return state.users.pageLimit;
}

export const getIsFetching = (state: AppStateType) => {
    return state.users.isFetching;
}

export const getFiletSelector = (state: AppStateType) => {
    return state.users.filter;
}

export const getRolesSelector = (state: AppStateType) => {
    return state.users.roles;
}

export const getSuccessModalSelector = (state: AppStateType) => {
    return state.users.successModal;
}

export const getAccessErrorSelector = (state: AppStateType) => {
    return state.users.accessError;
}

export const getUsersApiErrorSelector = (state: AppStateType) => {
    return state.users.apiError;
}

export const getIsDeletingInProcess = (state: AppStateType) => {
    return state.users.isDeletingInProcess;
}
