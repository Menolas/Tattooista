import * as React from "react";
import {RegistrationForm} from "../../components/Forms/RegistrationForm";
import {UserType} from "../../types/Types";

type PropsType = {
    isAuth: string | null;
    user?: UserType | null;
    authApiError: string | null;
}

export const Registration: React.FC<PropsType> = React.memo(({
  isAuth,
  user,
  authApiError,
}) => {

    return (
        <div className="registration page-block page-block--top container">
            {isAuth && !user?.isActivated
                ? <p>Please activate your account by link we sent to your email</p>
                : <div className="registration__form-wrap form__wrap">
                    <RegistrationForm
                        authApiError={authApiError}
                    />
                </div>
            }
        </div>
    )
});

Registration.displayName = 'Registration';
