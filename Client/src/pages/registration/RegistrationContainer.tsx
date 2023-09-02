import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Registration } from '../registration/Registration'
import { registration } from '../../redux/Auth/auth-reducer'

import {getAuthSelector, getUserSelector} from "../../redux/Auth/auth-selectors";
import {RegistrationFormValues} from "../../types/Types";

export const RegistrationContainer: React.FC = () => {

    const isAuth = useSelector(getAuthSelector)
    const user = useSelector(getUserSelector)

    const dispatch = useDispatch()

    const registrationCallBack = (values: RegistrationFormValues) => {
        dispatch(registration(values))
    }

    return (
        <Registration
            isAuth={isAuth}
            user={user}
            registration={registrationCallBack}
        />
    )
}