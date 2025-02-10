import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Registration } from "./Registration";
import {
    getSuccessModalSelector,
} from "../../redux/General/general-selectors";
import {setSuccessModalAC} from "../../redux/General/general-reducer";
import {
    getIsAuthSelector,
    getUserProfileSelector,
    getRegistrationApiErrorSelector
} from "../../redux/Auth/auth-selectors";
import {SuccessPopUp} from "../../components/PopUps/SuccessPopUp";
import {useCallback, useEffect} from "react";
import {AppDispatch} from "../../redux/redux-store";

export const RegistrationContainer: React.FC = () => {

    const isAuth = useSelector(getIsAuthSelector);
    const user = useSelector(getUserProfileSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const authApiError = useSelector(getRegistrationApiErrorSelector);

    const dispatch = useDispatch<AppDispatch>();

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

    return (
        <>
            <Registration
                isAuth={isAuth}
                user={user}
                authApiError={authApiError}
            />
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />
        </>
    )
}
