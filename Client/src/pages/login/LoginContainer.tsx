import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { LoginFormValues } from "../../types/Types";
import { login } from "../../redux/Auth/auth-reducer";
import {getAuthSelector, getAuthApiErrorSelector, getUserSelector} from "../../redux/Auth/auth-selectors";

export const LoginContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const authApiError = useSelector(getAuthApiErrorSelector);
  const user = useSelector(getUserSelector);

  const dispatch = useDispatch();

  const loginCallBack = (values: LoginFormValues) => {
    dispatch(login(values));
  }

  return (
    <Login
      isUserActivated={user?.isActivated}
      isAuth={isAuth}
      authApiError={authApiError}
      login={loginCallBack}
    />
  )
};
