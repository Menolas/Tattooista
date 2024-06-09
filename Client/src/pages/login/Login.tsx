import * as React from "react";
import {LoginForm} from "../../components/Forms/LoginForm";
import {LoginFormValues} from "../../types/Types";

type PropsType = {
  isAuth: null | string;
  authApiError: null | string;
  login: (values: LoginFormValues) => void;
}

export const Login: React.FC<PropsType> = React.memo(({
  isAuth,
  authApiError,
  login
}) => {

  return (
    <div className="login page-block page-block--top">
      <div className = "login__form-wrap">
        <LoginForm
          isAuth={isAuth}
          authApiError={authApiError}
          login={login}
        />
      </div>
    </div>
  )
});
