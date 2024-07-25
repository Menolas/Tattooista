import * as React from "react";
import { Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router";
import { LoginFormValues } from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import { NavLink } from "react-router-dom";
import {ADMIN, SUPER_ADMIN, USER} from "../../utils/constants";
import {useDispatch} from "react-redux";
import {login} from "../../redux/Auth/auth-reducer";
import {handleEnterClick} from "../../utils/functions";

const validationSchema = Yup.object().shape({
  email: Yup
      .string()
      .email("Invalid email format")
      .required('Required field'),
  password: Yup
      .string()
      .required('Required field')
});

type PropsType = {
  isAuth: null | string;
  authApiError: null | string;
};

export const LoginForm: React.FC<PropsType> = React.memo(({
  isAuth,
  authApiError,
}) => {

  const dispatch = useDispatch();

  if (isAuth === ADMIN || isAuth === SUPER_ADMIN) {
    return <Navigate to="/admin/bookedConsultations" />
  }

  if (isAuth === USER) {
    return <Navigate to="/" />
  }

  const submit = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    await dispatch(login(values));
    actions.setSubmitting(false);
  };

  const initialValues: LoginFormValues = {
      email: '',
      password: ''
  };

  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submit}
    >
      {(propsF) => {
        const {isSubmitting} = propsF

        return (
          <Form id="login" className="form">
            <h3 className="form__title">
              Login
            </h3>
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                label={'Email'}
                value={propsF.values.email}
                onChange={propsF.handleChange}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            <FieldComponent
                name={'password'}
                type={'password'}
                placeholder={'xxxxxxxx'}
                label={'Password'}
                value={propsF.values.password}
                onChange={propsF.handleChange}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            { authApiError &&
                <ApiErrorMessage message={authApiError}/>
            }
            <button
              className="btn btn--bg btn--dark-bg form__submit-btn"
              type="submit"
              disabled={!propsF.dirty || isSubmitting}
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
        );
      }}
    </Formik>
  );
});

LoginForm.displayName = 'LoginForm';
