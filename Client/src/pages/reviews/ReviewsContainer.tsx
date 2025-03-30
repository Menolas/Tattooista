import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {SuccessPopUp} from "../../components/PopUps/SuccessPopUp";
import {AppDispatch} from "../../redux/redux-store";
import {useCallback, useEffect} from "react";
import {setApiErrorAC, setSuccessModalAC} from "../../redux/General/general-reducer";
import {getSuccessModalSelector} from "../../redux/General/general-selectors";
import {Reviews} from "./Reviews";
import {
    deleteReview,
    getReviews,
    setCurrentPageAC,
    setPageLimitAC, setReviewApiErrorAC
} from "../../redux/Reviews/reviews-reducer";
import {
    getCurrentPageSelector,
    getIsDeletingReviewInProcessSelector,
    getIsFetchingSelector,
    getPageLimitSelector, getReviewApiErrorSelector,
    getReviewsFilterSelector,
    getReviewsSelector,
    getTotalCountSelector
} from "../../redux/Reviews/reviews-selectors";
import {
    getIsAuthSelector,
    getTokenSelector,
    getUsersReviewsSelector
} from "../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../types/Types";
import {setFilterAC} from "../../redux/Reviews/reviews-reducer";

export const ReviewsContainer: React.FC = () => {
    const currentPage = useSelector(getCurrentPageSelector);
    const pageLimit = useSelector(getPageLimitSelector);
    const totalCount = useSelector(getTotalCountSelector);
    const reviews = useSelector(getReviewsSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingReviewInProcessSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const isAuth = useSelector(getIsAuthSelector);
    const token = useSelector(getTokenSelector);
    const submittedReviews = useSelector(getUsersReviewsSelector);
    const filter = useSelector(getReviewsFilterSelector);
    const apiError = useSelector(getReviewApiErrorSelector);

    const dispatch = useDispatch<AppDispatch>();

    const deleteReviewCallBack = (
        id: string
    ) => {
        dispatch(deleteReview(token, id, reviews, currentPage, pageLimit, filter));
    };

    useEffect(() => {
        dispatch(getReviews(currentPage, pageLimit, filter));
        console.log(currentPage + " currentpage!!!!!!!!!!!!!!!!!")
    }, [dispatch, currentPage, pageLimit, filter]);

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModalCallBack();
            }, 3000);
        }
    }, [successModal, setSuccessModalCallBack]);

    const setPageLimitCallBack = (pageLimit: number) => {
        dispatch(setPageLimitAC(pageLimit));
    };

    const setCurrentPageCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    };

    const onFilterChangedCallBack = (
        filter: SearchFilterType
    ) => {
        dispatch(setFilterAC(filter));
    };

    const setApiErrorCallBack = () => {
        dispatch(setReviewApiErrorAC(null));
    };

    return (
        <>
            <Reviews
                isAuth={isAuth}
                reviews={reviews}
                totalCount={totalCount}
                currentPage={currentPage}
                pageLimit={pageLimit}
                isFetching={isFetching}
                filter={filter}
                apiError={apiError}
                isDeletingInProcess={isDeletingInProcess}
                isSubmittedReviews={submittedReviews.length}
                setPageLimit={setPageLimitCallBack}
                setCurrentPage={setCurrentPageCallBack}
                remove={deleteReviewCallBack}
                onFilterChanged={onFilterChangedCallBack}
                setReviewApiError={setApiErrorCallBack}
            />
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />

        </>
    )
};

Reviews.displayName = 'Reviews';
