import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { LoginFormValues } from "../../types/Types";
import { login } from "../../redux/Auth/auth-reducer";
import { getAuthSelector, getAuthApiErrorSelector } from "../../redux/Auth/auth-selectors";

export const LoginContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const authApiError = useSelector(getAuthApiErrorSelector);

  const dispatch = useDispatch();

  const loginCallBack = (values: LoginFormValues) => {
    dispatch(login(values));
  }

  return (
    <Login
      isAuth={isAuth}
      authApiError={authApiError}
      login={loginCallBack}
    />
  )
};
