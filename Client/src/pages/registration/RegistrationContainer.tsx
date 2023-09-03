import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Registration } from '../registration/Registration'
import { registration } from '../../redux/Auth/auth-reducer'

import {getAuthSelector, getUserSelector, getIsSuccessSelector} from "../../redux/Auth/auth-selectors";
import {RegistrationFormValues} from "../../types/Types";
import {setIsSuccessAC} from "../../redux/Auth/auth-reducer";

export const RegistrationContainer: React.FC = () => {

    const isAuth = useSelector(getAuthSelector)
    const user = useSelector(getUserSelector)
    const isSuccess = useSelector(getIsSuccessSelector)

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
            registration={registrationCallBack}
            setIsSuccess={setIsSuccessCallBack}
        />
    )
}