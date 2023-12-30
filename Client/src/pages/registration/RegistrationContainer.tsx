import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Registration } from "./Registration"
import { registration } from "../../redux/Auth/auth-reducer"

import {
    getAuthSelector,
    getUserSelector,
    getIsSuccessSelector,
    getRegistrationErrorSelector
} from "../../redux/Auth/auth-selectors"
import {RegistrationFormValues} from "../../types/Types"
import {setIsSuccessAC} from "../../redux/Auth/auth-reducer"

export const RegistrationContainer: React.FC = () => {

    const isAuth = useSelector(getAuthSelector)
    const user = useSelector(getUserSelector)
    const isSuccess = useSelector(getIsSuccessSelector)
    const registrationError = useSelector(getRegistrationErrorSelector)

    const dispatch = useDispatch()

    const registrationCallBack = (values: RegistrationFormValues) => {
        dispatch(registration(values))
    }

    const setIsSuccessCallBack = (bol: boolean) => {
        dispatch(setIsSuccessAC(bol))
    }

    return (
        <Registration
            isSuccess={isSuccess}
            isAuth={isAuth}
            user={user}
            registrationError={registrationError}
            registration={registrationCallBack}
            setIsSuccess={setIsSuccessCallBack}
        />
    )
}
