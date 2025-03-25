import {
    ApiErrorType,
    ClientType,
    ReviewType,
    SearchFilterType,
    UpdateReviewFormValues,
    UserType
} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {AnyAction} from "redux";
import {ResultCodesEnum} from "../../utils/constants";
import {reviewsAPI} from "./reviewsApi";
import {setApiErrorAC, setSuccessModalAC} from "../General/general-reducer";
import {clientsAPI} from "../Clients/clientsApi";
import {getNewPage} from "../../utils/functions";
import {getClients, setClientsCurrentPageAC} from "../Clients/clients-reducer";

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
    reviewUpdateError: null as null | string,
    isDeletingInProcess: [] as Array<string>,
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

        case TOGGLE_IS_DELETING_IN_PROCESS:
            return {
                ...state,
                isDeletingInProcess: action.isFetching
                    ? [...state.isDeletingInProcess, action.id]
                    : state.isDeletingInProcess.filter(id => id !== action.id)
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
    SetReviewsAT
    | SetPageLimitAT
    | SetReviewsCurrentPageAT
    | AddReviewAT
    | ToggleIsDeletingInProcessAT
    | DeleteReviewAT;

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

type SetReviewsAT = {
    type: typeof SET_REVIEWS;
    reviews: Array<ReviewType>;
    total: number;
};

type DeleteReviewAT = {
    type: typeof DELETE_REVIEW;
    id: string;
};

const deleteReviewAC = (id: string): DeleteReviewAT => ({
    type: DELETE_REVIEW, id
});

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
    userId: string | undefined,
    token: string | null,
    values: UpdateReviewFormValues
): ThunkType => async (dispatch) => {
    try {
        const response = await reviewsAPI.addReview(userId, token, values);
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

export const deleteReview = (
    token: string | null,
    id: string,
    reviews: Array<ReviewType>,
    currentPage: number,
    pageLimit: number,
    //filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
    try {
        dispatch(toggleIsDeletingInProcessAC(true, id));
        const response = await reviewsAPI.deleteReview(token, id);
        if (response.resultCode === ResultCodesEnum.Success) {
            await dispatch(deleteReviewThunk(token, id, reviews, currentPage, pageLimit));
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
    token: string | null,
    id: string,
    reviews: Array<ReviewType>,
    currentPage: number,
    pageLimit: number,
    //filter: SearchFilterType
): ThunkType => async (dispatch) => {
    if (reviews.length > 1) {
        dispatch(deleteReviewAC(id));
    } else {
        const newPage = getNewPage(currentPage);
        if (currentPage === newPage) {
            await dispatch(getReviews());
        }
        dispatch(deleteReviewAC(id));
        dispatch(setCurrentPageAC(newPage));
    }
    return true;
};
