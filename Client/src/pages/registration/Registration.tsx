import * as React from 'react'
import {RegistrationForm} from '../../components/Forms/RegistrationFormFormik'
import {RegistrationFormValues} from "../../types/Types";
import {IUser} from "../../types/IUser";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";

type PropsType = {
    isSuccess: boolean
    isAuth: boolean
    user?: IUser
    registrationError: string | null
    registration: (values: RegistrationFormValues) => void
    setIsSuccess: (bol: boolean) => void
}

export const Registration: React.FC<PropsType> = React.memo(({
  isSuccess,
  isAuth,
  user,
  registrationError,
  registration,
  setIsSuccess
}) => {

    const successPopUpContent = 'You registered as admin now!'
    return (
        <div className="registration">
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
            {
                isSuccess &&
                <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent}/>
            }
        </div>
    )
})