import * as React from 'react'
import {LoginForm} from '../../components/Forms/LoginFormFormik'
import {LoginFormValues} from "../../types/Types";

type PropsType = {
  isAuth: boolean
  login: (values: LoginFormValues) => void
}

export const Login: React.FC<PropsType> = React.memo(({
  isAuth,
  login
}) => {
  return (
    <div className="login container">
      <div className = "login__form-wrap">
        <LoginForm
          isAuth={isAuth}
          login={login}
        />
      </div>
    </div>
  )
})
