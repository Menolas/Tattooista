import * as React from 'react'
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import * as Yup from 'yup'
import {ErrorMessageWrapper} from '../../utils/validators'
import {BookConsultationFormValues} from "../../types/Types";

const validationSchema = Yup.object().shape({
  name: Yup.string()
      .min(2, 'Must be minimum longer two characters')
      .max(30, 'Must be shorter than 31 character')
      .required('Required Field'),
  contact: Yup.string().required('Required Field'),
  contactValue: Yup.string().required('Required Field'),
  message: Yup.string()
      .min(20, 'Must be minimum longer twenty characters')
      .max(200, 'Must be shorter than 200 character')
      .required('Required Field'),
  consent: Yup.boolean().oneOf([true],'Required Field')
})

type PropsType = {
  consentId: string
  bookConsultation: (values: BookConsultationFormValues) => void
  closeBookingModal?: () => void
}

export const BookingForm: React.FC<PropsType> = React.memo(({
  consentId,
  bookConsultation,
  closeBookingModal,
}) => {

  const submit = (values: BookConsultationFormValues, actions: FormikHelpers<FormikValues>) => {
    bookConsultation(values)
    if (closeBookingModal) {
      closeBookingModal();
    }
    actions.setSubmitting(false)
    actions.resetForm()
  }

  const initialValues: BookConsultationFormValues = {
    name: '',
    contact: '',
    contactValue: '',
    message: '',
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
          <Form id="booking"
            className="form booking__form"
          >
            <div className="form__input-wrap booking__input-wrap">
              <Field
                name={'name'}
                type={'text'}
                placeholder={'Your Full Name'}
              />
              <ErrorMessage name='name'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>

            <div className="form__input-wrap booking__input-wrap">
              <Field
                name={'contact'}
                as="select"
                placeholder={'Choose the way you want me to contact you'}
              >
                  <option>Choose the way you want me to contact you</option>
                  <option value="email">email</option>
                  <option value="phone">phone</option>
                  <option value="whatsapp">whatsapp</option>
                  <option value="messenger">messenger</option>
              </Field>
              <ErrorMessage name='contact'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap booking__input-wrap">
                <Field
                  name="contactValue"
                  type={'text'}
                  placeholder={'Your contact'}
                />
                <ErrorMessage name='contactValue'>
                    {ErrorMessageWrapper}
                </ErrorMessage>
            </div>
            <div className="form__input-wrap booking__input-wrap">
                <Field
                  component="textarea"
                  name="message"
                  placeholder={'Your message'}
                />
                <ErrorMessage name='message'>
                    {ErrorMessageWrapper}
                </ErrorMessage>
            </div>
            <div className="form__input-wrap form__input-wrap--checkbox">
                <Field
                  type="checkbox"
                  name="consent"
                  id={consentId}
                />
                <label htmlFor={consentId}>
                    <span className="checkbox">{''}</span>
                    CONSENT WITH PROCESSING OF MY PERSONAL DATA
                </label>
                <ErrorMessage name='consent'>
                    {ErrorMessageWrapper}
                </ErrorMessage>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--bg btn--transparent form__submit-btn booking__submit-btn"
            >
                {isSubmitting
                    ? 'Please wait...'
                    : 'BOOK A CONSULTATION'
                }
            </button>
          </Form>
        )
      }}
    </Formik>
)})
