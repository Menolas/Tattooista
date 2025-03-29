import {
    ApiErrorType,
    ReviewType,
    SearchFilterType,
} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {AnyAction} from "redux";
import {ResultCodesEnum} from "../../utils/constants";
import {reviewsAPI} from "./reviewsApi";
import {setApiErrorAC, setSuccessModalAC} from "../General/general-reducer";
import {getNewPage} from "../../utils/functions";
import {clientsAPI} from "../Clients/clientsApi";

const SET_REVIEWS = 'SET_REVIEWS';
const SET_PAGE_LIMIT = 'SET_PAGE_LIMIT';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_FILTER = 'SET_FILTER';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const DELETE_REVIEW = 'DELETE_REVIEW';
const ADD_REVIEW = 'ADD_REVIEW';
const EDIT_REVIEW = 'EDIT_REVIEW';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const TOGGLE_IS_DELETING_PICTURES_IN_PROCESS = 'TOGGLE_IS_DELETING_PICTURE_IN_PROGRESS';

const ADD_REVIEW_SUCCESS = 'You successfully added you review!';
const UPDATE_REVIEW_SUCCESS = 'You successfully updated you review!';

const initialState = {
    reviews: [] as Array<ReviewType>,
    totalCount: 0 as number,
    pageLimit: 5 as number,
    currentPage: 1 as number,
    isFetching: false as boolean,
    reviewUpdateError: null as null | string,
    isDeletingInProcess: [] as Array<string>,
    isDeletingPicturesInProcess: [] as Array<string>,
    filter: {
        term: '' as string | null,
        rate: "any" as string | number,
        condition: "any" as string | null,
    } as SearchFilterType,
};

export type InitialStateType = typeof initialState;

export const reviewsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
    switch (action.type) {
        case SET_FILTER:
            return {
                ...state,
                filter: action.filter
            }

        case SET_REVIEWS:
            return {
                ...state,
                reviews: action.reviews,
                totalCount: action.total,
            }

        case ADD_REVIEW:
            return {
                ...state,
                reviews: [{...action.review}, ...state.reviews],
                totalCount: state.totalCount + 1,
            }

        case EDIT_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(review => {
                    if (review._id === action.review._id) {
                        return { ...action.review }
                    }
                    return review
                }),
            }

        case TOGGLE_IS_DELETING_IN_PROCESS:
            return {
                ...state,
                isDeletingInProcess: action.isFetching
                    ? [...state.isDeletingInProcess, action.id]
                    : state.isDeletingInProcess.filter(id => id !== action.id)
            }

        case TOGGLE_IS_DELETING_PICTURES_IN_PROCESS:
            return {
                ...state,
                isDeletingPicturesInProcess: action.isFetching
                    ? [...state.isDeletingPicturesInProcess, action.id]
                    : state.isDeletingPicturesInProcess.filter(id => id !== action.id)
            }

        case DELETE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(review => review._id !== action.id),
                totalCount: state.totalCount - 1,
            }
        default: return state
    }
};

type ActionsTypes =
    SetFilterAT
    | SetReviewsAT
    | SetPageLimitAT
    | SetReviewsCurrentPageAT
    | AddReviewAT
    | EditReviewAT
    | ToggleIsDeletingInProcessAT
    | ToggleIsDeletingPicturesInProcessAT
    | DeleteReviewAT;

//actions creators
type SetFilterAT = {
    type: typeof SET_FILTER;
    filter: SearchFilterType;
};

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
    type: SET_FILTER, filter
});

type AddReviewAT = {
    type: typeof ADD_REVIEW;
    review: ReviewType;
};

const addReviewAC = (review: ReviewType): AddReviewAT => ({
    type: ADD_REVIEW, review
});

type SetReviewsCurrentPageAT = {
    type: typeof SET_CURRENT_PAGE;
    page: number;
};

type EditReviewAT = {
    type: typeof EDIT_REVIEW;
    review: ReviewType;
};

const editReviewAC = (review: ReviewType): EditReviewAT => ({
    type: EDIT_REVIEW, review
});

export const setCurrentPageAC = (page: number): SetReviewsCurrentPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type SetPageLimitAT = {
    type: typeof SET_PAGE_LIMIT;
    pageLimit: number;
}

export const setPageLimitAC = (pageLimit: number): SetPageLimitAT => ({
    type: SET_PAGE_LIMIT, pageLimit
});

type ToggleIsFetchingAT = {
    type: typeof TOGGLE_IS_FETCHING;
    isFetching: boolean;
}

const toggleIsFetchingAC = (isFetching: boolean): ToggleIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching,
});

type DeleteReviewAT = {
    type: typeof DELETE_REVIEW;
    id: string;
};

const deleteReviewAC = (id: string): DeleteReviewAT => ({
    type: DELETE_REVIEW, id
});

type SetReviewsAT = {
    type: typeof SET_REVIEWS;
    reviews: Array<ReviewType>;
    total: number;
};

const setReviewsAC = (reviews: Array<ReviewType>, total: number): SetReviewsAT => ({
    type: SET_REVIEWS, reviews, total
});

type ToggleIsDeletingInProcessAT = {
    type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
    isFetching: boolean;
    id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type ToggleIsDeletingPicturesInProcessAT = {
    type: typeof TOGGLE_IS_DELETING_PICTURES_IN_PROCESS;
    isFetching: boolean;
    id: string;
};

const toggleIsDeletingPicturesInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingPicturesInProcessAT  => ({
    type: TOGGLE_IS_DELETING_PICTURES_IN_PROCESS, isFetching, id
});

export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, AnyAction>;

export const getReviews = (
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType,
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        const response = await reviewsAPI.getReviews(
            currentPage,
            pageLimit,
            filter
        );
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(setReviewsAC(response.reviews, response.totalCount));
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

export const addReview = (
    userId: string | undefined,
    token: string | null,
    formData: FormData,
): ThunkType => async (dispatch) => {
    try {
        const response = await reviewsAPI.addReview(userId, token, formData);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(addReviewAC(response.review));
            dispatch(setSuccessModalAC(true, ADD_REVIEW_SUCCESS));
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

export const updateReview = (
    token: string | null,
    userId: string | undefined,
    formData: FormData,
): ThunkType => async (dispatch) => {
    try {
        const response = await reviewsAPI.updateReview(userId, token, formData);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(editReviewAC(response.review));
            dispatch(setSuccessModalAC(true, UPDATE_REVIEW_SUCCESS));
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

export const deleteReview = (
    token: string | null,
    id: string,
    reviews: Array<ReviewType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
    try {
        dispatch(toggleIsDeletingInProcessAC(true, id));
        const response = await reviewsAPI.deleteReview(token, id);
        if (response.resultCode === ResultCodesEnum.Success) {
            await dispatch(deleteReviewThunk(id, reviews, currentPage, pageLimit, filter));
            dispatch(setApiErrorAC(null));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        const error = e as ApiErrorType;
        dispatch(setApiErrorAC(error.response?.data?.message));
        console.log(e);
        return false;
    } finally {
        dispatch(toggleIsDeletingInProcessAC(false, id));
    }
};

const deleteReviewThunk = (
    id: string,
    reviews: Array<ReviewType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
    if (reviews.length > 1) {
        dispatch(deleteReviewAC(id));
    } else {
        const newPage = getNewPage(currentPage);
        if (currentPage === newPage) {
            await dispatch(getReviews(
                currentPage,
                pageLimit,
                filter
            ));
        }
        dispatch(deleteReviewAC(id));
        dispatch(setCurrentPageAC(newPage));
    }
    return true;
};

export const deleteReviewGalleryPicture = (
    token: string | null,
    id: string,
    picture: string
): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsDeletingPicturesInProcessAC(true, picture));
        const response = await reviewsAPI.deleteReviewGalleryPicture(token, id, picture);
        if (response.resultCode === ResultCodesEnum.Success) {
            dispatch(editReviewAC(response.review));
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    } finally {
        dispatch(toggleIsDeletingPicturesInProcessAC(false, picture));
    }
};
