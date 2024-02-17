import * as React from "react"
import { Form, Formik, FormikHelpers, FormikValues} from "formik"
import { ApiErrorMessage } from "../../utils/validators"
import * as Yup from "yup"
import { Navigate } from "react-router"
import { LoginFormValues } from "../../types/Types"
import {FieldComponent} from "./FieldComponent"
import { NavLink } from "react-router-dom"
import {ADMIN, SUPER_ADMIN, USER} from "../../utils/constants";

const validationSchema = Yup.object().shape({
  email: Yup
      .string()
      .email("Invalid email format")
      .required('Required field'),
  password: Yup
      .string()
      .required('Required field')
})

type PropsType = {
  isAuth: null | string
  loginError: string
  login: (values: LoginFormValues) => void
}

export const LoginForm: React.FC<PropsType> = React.memo(({
  isAuth,
  loginError,
  login
}) => {

  console.log(isAuth + "is Auth!!!!!!!!!!!!")

  if (isAuth === ADMIN || isAuth === SUPER_ADMIN) {
    return <Navigate to="/admin/bookedConsultations" />
  }

  if (isAuth === USER) {
    console.log(isAuth + " isAuth in login form!!!!!!!!!!!!!!!")
    return <Navigate to="/" />
  }

  const submit = (values: LoginFormValues, actions: FormikHelpers<FormikValues>) => {
    login(values)
    actions.setSubmitting(false)
  }

  const initialValues: LoginFormValues = {
      email: '',
      password: ''
  }

  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submit}
    >
      {(propsF) => {
        let {isSubmitting} = propsF

        return (
          <Form id="login" className="form">
            <h3 className="form__title">
              Login
            </h3>
            { loginError  !== '' &&
                <ApiErrorMessage message={loginError}/>
            }
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                label={'Email'}
                value={propsF.values.email}
                onChange={propsF.handleChange}
            />
            <FieldComponent
                name={'password'}
                type={'password'}
                placeholder={'xxxxxxxx'}
                label={'Password'}
                value={propsF.values.password}
                onChange={propsF.handleChange}
            />
            <button
              className="btn btn--bg btn--transparent form__submit-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                  ? 'Please wait...'
                  : 'Log In'
              }
            </button>
            <NavLink className={'form__link'} to={'/registration'}>
              Need registration?
            </NavLink>
          </Form>
        )
      }}
    </Formik>
  )
})
