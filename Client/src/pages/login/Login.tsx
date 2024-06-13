import * as React from "react";
import {LoginForm} from "../../components/Forms/LoginForm";
import {LoginFormValues} from "../../types/Types";
import {Navigate} from "react-router";

type PropsType = {
  isUserActivated: boolean;
  isAuth: null | string;
  authApiError: null | string;
}

export const Login: React.FC<PropsType> = React.memo(({
  isUserActivated,
  isAuth,
  authApiError,
}) => {

  return (
    <div className="login page-block page-block--top container">
      {!isAuth &&
          <div className="login__form-wrap">
            <LoginForm
                isAuth={isAuth}
                authApiError={authApiError}
            />
          </div>
      }
      {isAuth && !isUserActivated &&
          <p>Please activate your account by link we sent to your email</p>
      }
      {isAuth && isUserActivated &&
          <Navigate to="/" />
      }
    </div>
  )
});
