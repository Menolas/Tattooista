import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Login } from '../login/Login'
import { LoginFormValues } from '../../types/Types'
import { login } from '../../redux/Auth/auth-reducer'

import {getAuthSelector, getRegistrationErrorSelector} from "../../redux/Auth/auth-selectors";

export const LoginContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector)
  const registrationError = useSelector(getRegistrationErrorSelector)

  const dispatch = useDispatch()

  const loginCallBack = (values: LoginFormValues) => {
    dispatch(login(values))
  }

  return (
    <Login
      isAuth={isAuth}
      registrationError={registrationError}
      login={loginCallBack}
    />
  )
}
