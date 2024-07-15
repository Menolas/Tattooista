import * as React from "react";
import {LoginForm} from "../../components/Forms/LoginForm";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

type PropsType = {
  isUserActivated: boolean | undefined;
  isAuth: null | string;
  authApiError: null | string;
}

export const Login: React.FC<PropsType> = React.memo(({
  isUserActivated,
  isAuth,
  authApiError,
}) => {

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth && isUserActivated) navigate("/");
  }, [isAuth , isUserActivated]);

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
    </div>
  )
});

Login.displayName = 'Login';
