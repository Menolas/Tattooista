import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Login } from '../login/Login'
import { LoginFormValues } from '../../types/Types'
import { login } from '../../redux/Auth/auth-reducer'

import { getAuthSelector } from "../../redux/Auth/auth-selectors";

export const LoginContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector)

  const dispatch = useDispatch()

  const adminLogin = (values: LoginFormValues) => {
    dispatch(login(values))
  }

  return (
    <Login
      isAuth={isAuth}
      login={adminLogin}
    />
  )
}
