import * as React from "react";
import {RegistrationForm} from "../../components/Forms/RegistrationForm";
import {RegistrationFormValues} from "../../types/Types";
import {IUser} from "../../types/Types";

type PropsType = {
    isAuth: string;
    user?: IUser;
    registrationError: string | null;
    registration: (values: RegistrationFormValues) => void;
}

export const Registration: React.FC<PropsType> = React.memo(({
  isAuth,
  user,
  registrationError,
  registration,
}) => {

    return (
        <div className="registration page-block page-block--top">
            { !isAuth &&
                <div className = "registration__form-wrap form__wrap">
                    <RegistrationForm
                        //isAuth={isAuth}
                        registrationError={registrationError}
                        registration={registration}
                    />
                </div>
            }
            { isAuth && !user?.isActivated &&
                <p>Please activate your account by link we sent to your email</p>
            }
        </div>
    )
});
