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

export const getIsFetchingSelector = (state: AppStateType) => {
    return state.reviews.isFetching;
};

export const getIsDeletingReviewInProcessSelector = (state: AppStateType) => {
    return state.reviews.isDeletingInProcess;
};

export const getIsDeletingReviewPicturesInProcessSelector = (state: AppStateType) => {
    return state.reviews.isDeletingPicturesInProcess;
};

export const getReviewUpdateErrorSelector = (state: AppStateType) => {
    return state.reviews.reviewUpdateError;
};

export const getReviewsFilterSelector = (state: AppStateType) => {
    return state.reviews.filter;
};
