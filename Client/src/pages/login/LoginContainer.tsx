import * as React from "react";
import { useSelector } from "react-redux";
import { Login } from "./Login";
import {
  getAuthSelector,
  getAuthApiErrorSelector,
  getUserSelector,
  getFromSelector
} from "../../redux/Auth/auth-selectors";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const LoginContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const authApiError = useSelector(getAuthApiErrorSelector);
  const user = useSelector(getUserSelector);
  const from = useSelector(getFromSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth && user?.isActivated) {
      if (from) {
        navigate(from);
      } else {
        navigate("/");
      }
    }
  }, [from, navigate, isAuth , user?.isActivated]);

  return (
    <Login
      isUserActivated={user?.isActivated}
      isAuth={isAuth}
      authApiError={authApiError}
    />
  )
};
