import * as React from "react";
import {RegistrationForm} from "../../components/Forms/RegistrationForm";
import {IUser} from "../../types/Types";

type PropsType = {
    isAuth: string | null;
    user?: IUser | null | undefined;
    authApiError: string | null;
}

export const Registration: React.FC<PropsType> = React.memo(({
  isAuth,
  user,
  authApiError,
}) => {

    return (
        <div className="registration page-block page-block--top container">
            { !isAuth &&
                <div className = "registration__form-wrap form__wrap">
                    <RegistrationForm
                        authApiError={authApiError}
                    />
                </div>
            }
            { isAuth && !user?.isActivated &&
                <p>Please activate your account by link we sent to your email</p>
            }
        </div>
    )
});

Registration.displayName = 'Registration';
