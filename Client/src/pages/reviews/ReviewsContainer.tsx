import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {SuccessPopUp} from "../../components/PopUps/SuccessPopUp";
import {AppDispatch} from "../../redux/redux-store";
import {useCallback} from "react";
import {setSuccessModalAC} from "../../redux/General/general-reducer";
import {getSuccessModalSelector} from "../../redux/General/general-selectors";
import {Reviews} from "./Reviews";

export const ReviewsContainer: React.FC = () => {

    const successModal = useSelector(getSuccessModalSelector);

    const dispatch = useDispatch<AppDispatch>();

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

    return (
        <>
            <Reviews />
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />

        </>
    )
}