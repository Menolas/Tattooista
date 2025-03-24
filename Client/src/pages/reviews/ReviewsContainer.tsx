import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {SuccessPopUp} from "../../components/PopUps/SuccessPopUp";
import {AppDispatch} from "../../redux/redux-store";
import {useCallback, useEffect, useState} from "react";
import {setSuccessModalAC} from "../../redux/General/general-reducer";
import {getSuccessModalSelector} from "../../redux/General/general-selectors";
import {Reviews} from "./Reviews";
import {getReviews, setCurrentPageAC, setPageLimitAC} from "../../redux/Reviews/reviews-reducer";
import {
    getCurrentPageSelector, getIsDeletingInProcessSelector, getIsFetchingSelector,
    getPageLimitSelector,
    getReviewsSelector,
    getTotalCountSelector
} from "../../redux/Reviews/reviews-selectors";
import {getIsAuthSelector, getUserProfileSelector} from "../../redux/Auth/auth-selectors";

export const ReviewsContainer: React.FC = () => {
    const currentPage = useSelector(getCurrentPageSelector);
    const pageLimit = useSelector(getPageLimitSelector);
    const totalCount = useSelector(getTotalCountSelector);
    const reviews = useSelector(getReviewsSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const isAuth = useSelector(getIsAuthSelector);
    const user = useSelector(getUserProfileSelector);

    const dispatch = useDispatch<AppDispatch>();

    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

    useEffect(() => {
        dispatch(getReviews());
    }, [dispatch, currentPage, pageLimit]);

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
    }

    const setCurrentPageCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    }

    return (
        <>
            <Reviews
                isAuth={isAuth}
                reviews={reviews}
                totalCount={totalCount}
                currentPage={currentPage}
                pageLimit={pageLimit}
                isFetching={isFetching}
                isDeletingInProcess={isDeletingInProcess}
                setPageLimit={setPageLimitCallBack}
                setCurrentPage={setCurrentPageCallBack}
                isReviewSubmitted={isReviewSubmitted}
            />
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />

        </>
    )
}