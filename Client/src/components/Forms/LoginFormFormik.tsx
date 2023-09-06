import * as React from 'react'
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import { ErrorMessageWrapper } from '../../utils/validators'
import * as Yup from 'yup'
import { Navigate } from 'react-router';
import { LoginFormValues } from '../../types/Types'

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Required field'),
  password: Yup.string().required('Required field')
})

type PropsType = {
  isAuth: boolean
  login: (values: LoginFormValues) => void
}

export const LoginForm: React.FC<PropsType> = React.memo(({
  isAuth,
  login
}) => {

  if (isAuth) {
    return <Navigate to="/admin/bookedConsultations" />
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
            <div className="form__input-wrap">
              <label>Login</label>
              <Field
                name={'email'}
                type={'text'}
                placeholder={'Email'}
              />
              <ErrorMessage name='email'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap">
              <label>Password</label>
              <Field
                name={'password'}
                type={'password'}
                placeholder={'xxxxxxxx'}
              />
              <ErrorMessage name='password'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
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
          </Form>
        )
      }}
    </Formik>
  )
})
