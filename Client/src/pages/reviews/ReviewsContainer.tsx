import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {SuccessPopUp} from "../../components/PopUps/SuccessPopUp";
import {AppDispatch} from "../../redux/redux-store";
import {useCallback, useEffect, useState} from "react";
import {setSuccessModalAC} from "../../redux/General/general-reducer";
import {getSuccessModalSelector} from "../../redux/General/general-selectors";
import {Reviews} from "./Reviews";
import {deleteReview, getReviews, setCurrentPageAC, setPageLimitAC} from "../../redux/Reviews/reviews-reducer";
import {
    getCurrentPageSelector, getIsDeletingInProcessSelector, getIsFetchingSelector,
    getPageLimitSelector, getReviewsFilterSelector,
    getReviewsSelector,
    getTotalCountSelector
} from "../../redux/Reviews/reviews-selectors";
import {getIsAuthSelector, getTokenSelector, getUserProfileSelector} from "../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../types/Types";
import {setFilterAC} from "../../redux/Reviews/reviews-reducer";

export const ReviewsContainer: React.FC = () => {
    const currentPage = useSelector(getCurrentPageSelector);
    const pageLimit = useSelector(getPageLimitSelector);
    const totalCount = useSelector(getTotalCountSelector);
    const reviews = useSelector(getReviewsSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const isAuth = useSelector(getIsAuthSelector);
    const token = useSelector(getTokenSelector);
    const user = useSelector(getUserProfileSelector);
    const filter = useSelector(getReviewsFilterSelector);

    const dispatch = useDispatch<AppDispatch>();

    const deleteReviewCallBack = (
        id: string
    ) => {
        dispatch(deleteReview(token, id, reviews, currentPage, pageLimit, filter));
    };

    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

    useEffect(() => {
        dispatch(getReviews(currentPage, pageLimit, filter));
    }, [dispatch, currentPage, pageLimit, filter]);

    useEffect(() => {
        reviews.forEach(review => {
            if(review.user._id === user?._id) {
                setIsReviewSubmitted(true);
            }
        });
        console.log(isReviewSubmitted)
    }, [reviews]);

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

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
                isDeletingInProcess={isDeletingInProcess}
                setPageLimit={setPageLimitCallBack}
                setCurrentPage={setCurrentPageCallBack}
                isReviewSubmitted={isReviewSubmitted}
                remove={deleteReviewCallBack}
                onFilterChanged={onFilterChangedCallBack}
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
