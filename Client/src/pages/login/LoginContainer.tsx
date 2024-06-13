import * as React from "react";
import { useSelector } from "react-redux";
import { Login } from "./Login";
import {getAuthSelector, getAuthApiErrorSelector, getUserSelector} from "../../redux/Auth/auth-selectors";

export const LoginContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const authApiError = useSelector(getAuthApiErrorSelector);
  const user = useSelector(getUserSelector);

  return (
    <Login
      isUserActivated={user?.isActivated}
      isAuth={isAuth}
      authApiError={authApiError}
    />
  )
};
