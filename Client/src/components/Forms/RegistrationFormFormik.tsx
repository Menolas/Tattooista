import * as React from "react"
import { Field, Form, Formik, FormikHelpers, FormikValues } from "formik"
// @ts-ignore
import { ErrorMessageWrapper, ApiErrorMessage} from "../../utils/validators"
import * as Yup from "yup"
import {RegistrationFormValues} from "../../types/Types"
import {FieldComponent} from "./FieldComponent"
import {FieldWrapper} from "./FieldWrapper"

const validationSchema = Yup.object().shape({
  displayName: Yup
      .string()
      .min(2, 'Display is too short - should be 4 chars minimum.')
      .required('Required field'),
  email: Yup
      .string()
      .email("Invalid email format")
      .required('Required field'),
  password: Yup
      .string()
      .min(4, 'Password is too short - should be 4 chars minimum.')
      .required('Required field'),
  consent: Yup
      .boolean()
      .oneOf([true],'If you want to be registered as an admin you need to check this and agree to sare your email with us')
      .required('Required field')
})

type PropsType = {
  registrationError: string | null
  registration: (values: RegistrationFormValues) => void
}

export const RegistrationForm: React.FC<PropsType> = React.memo(({
  registrationError,
  registration
}) => {

  const submit = (values: RegistrationFormValues, actions: FormikHelpers<FormikValues>) => {
    registration(values)
    actions.setSubmitting(false)
  }

  const initialValues: RegistrationFormValues = {
      displayName: '',
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
          <Form id="registration" className="form">
            <h3 className="form__title">Registration</h3>
            { registrationError  !== '' &&
                <ApiErrorMessage message={registrationError}/>
            }
            <FieldComponent
                name={'displayName'}
                type={'text'}
                placeholder={'Display Name'}
                label={'Your display name'}
                value={propsF.values.displayName}
                onChange={propsF.handleChange}
            />
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                label={'Your email'}
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
            <FieldWrapper
                wrapperClass={'form__input-wrap--checkbox'}
                name={"consent"}
            >
              <Field
                  type="checkbox"
                  name="consent"
                  id="consent"
              />
              <label htmlFor="consent">
                <span className="checkbox">{''}</span>
                CONSENT WITH PROCESSING OF MY PERSONAL DATA
              </label>
            </FieldWrapper>
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
