import {ApiErrorType, ReviewType, UpdateReviewFormValues, UserType} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {AnyAction} from "redux";
import {ResultCodesEnum} from "../../utils/constants";
import {reviewsAPI} from "./reviewsApi";
import {setApiErrorAC, setSuccessModalAC} from "../General/general-reducer";

const SET_REVIEWS = 'SET_REVIEWS';
const SET_PAGE_LIMIT = 'SET_PAGE_LIMIT';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const DELETE_REVIEW = 'DELETE_REVIEW';
const ADD_REVIEW = 'ADD_REVIEW';
const EDIT_REVIEW = 'EDIT_REVIEW';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';

const ADD_REVIEW_SUCCESS = 'You successfully added you review!';

const initialState = {
    reviews: [] as Array<ReviewType>,
    totalCount: 0 as number,
    pageLimit: 5 as number,
    currentPage: 1 as number,
    isFetching: false as boolean,
};

export type InitialStateType = typeof initialState;

export const reviewsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
    switch (action.type) {
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
        default: return state
    }
};

type ActionsTypes =
    SetReviewsAT
    | SetPageLimitAT
    | SetReviewsCurrentPageAT
    | AddReviewAT;

//actions creators
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

export const setCurrentPageAC = (page: number): SetReviewsCurrentPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type SetPageLimitAT = {
    type: typeof SET_PAGE_LIMIT;
    pageLimit: number;
}

type ToggleIsFetchingAT = {
    type: typeof TOGGLE_IS_FETCHING;
    isFetching: boolean;
}

export const setPageLimitAC = (pageLimit: number): SetPageLimitAT => ({
    type: SET_PAGE_LIMIT, pageLimit
});

const toggleIsFetchingAC = (isFetching: boolean): ToggleIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching,
});

type SetReviewsAT = {
    type: typeof SET_REVIEWS;
    reviews: Array<ReviewType>;
    total: number;
};

const setReviewsAC = (reviews: Array<ReviewType>, total: number): SetReviewsAT => ({
    type: SET_REVIEWS, reviews, total
});

export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, AnyAction>;

export const getReviews = (): ThunkType => async (dispatch) => {
    try {
        dispatch(toggleIsFetchingAC(true));
        const response = await reviewsAPI.getReviews();
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
    token: string | null,
    values: UpdateReviewFormValues
): ThunkType => async (dispatch) => {
    try {
        const response = await reviewsAPI.addReview(token, values);
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
