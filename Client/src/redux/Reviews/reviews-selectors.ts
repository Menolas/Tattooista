import {AppStateType} from "../redux-store";

export const getReviewsSelector = (state: AppStateType) => {
    return state.reviews.reviews;
};

export const getTotalCountSelector = (state: AppStateType) => {
    return state.reviews.totalCount;
};

export const getCurrentPageSelector = (state: AppStateType) => {
    return state.reviews.currentPage;
};

export const getPageLimitSelector = (state: AppStateType) => {
    return state.reviews.pageLimit;
};

export const getIsFetching = (state: AppStateType) => {
    return state.reviews.isFetching;
};
