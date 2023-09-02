import * as React from 'react'
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import { ErrorMessageWrapper } from '../../utils/validators'
import * as Yup from 'yup'
import { Navigate } from 'react-router';
import {LoginFormValues, RegistrationFormValues} from '../../types/Types'

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Required field'),
  password: Yup.string().required('Required field')
})

type PropsType = {
  isAuth: boolean
  registration: (values: RegistrationFormValues) => void
}

export const RegistrationForm: React.FC<PropsType> = React.memo(({
  isAuth,
  registration
}) => {

  const submit = (values: RegistrationFormValues, actions: FormikHelpers<FormikValues>) => {
    registration(values)
    actions.setSubmitting(false)
  }

  const initialValues: RegistrationFormValues = {
      email: '',
      password: '',
      consent: false,
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
              Registration
            </h3>
            <div className="form__input-wrap">
              <label>Your email</label>
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
            <div className="form__input-wrap form__input-wrap--checkbox">
              <Field
                  type="checkbox"
                  name="consent"
                  id="consent"
              />
              <label htmlFor="consent">
                <span className="checkbox">{''}</span>
                CONSENT WITH PROCESSING OF MY PERSONAL DATA
              </label>
              <ErrorMessage name='consent'>
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
                  : 'Sign Up'
              }
            </button>
          </Form>
        )
      }}
    </Formik>
  )
})
