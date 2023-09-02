import * as React from 'react'
import {RegistrationForm} from '../../components/Forms/RegistrationFormFormik'
import {LoginFormValues, RegistrationFormValues} from "../../types/Types";
import {IUser} from "../../types/IUser";

type PropsType = {
    isAuth: boolean
    user?: IUser
    registration: (values: RegistrationFormValues) => void
}

export const Registration: React.FC<PropsType> = React.memo(({
  isAuth,
  user,
  registration
}) => {
    return (
        <div className="registration">
            { !isAuth &&
                <div className = "registration__form-wrap form__wrap">
                    <RegistrationForm
                        isAuth={isAuth}
                        registration={registration}
                    />
                </div>
            }
            { isAuth && !user?.isActivated &&
                <p>Please activate your account by link we sent to your email</p>
            }
        </div>
    )
})