import * as React from 'react'
import { Form, Formik, FormikHelpers, FormikValues} from 'formik'
import * as Yup from 'yup'
import {phoneRegex, ApiErrorMessage} from '../../utils/validators'
import {AddConsultationFormValues} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import * as yup from "yup";

const validationSchema = Yup.object().shape({
  bookingName: Yup.string()
      .min(2, 'Must be minimum longer two characters')
      .max(30, 'Must be shorter than 31 character')
      .required('Required Field'),
  email: yup.string()
      .email("Email should have correct format"),
  phone: yup
      .string()
      .min(8, 'Phone number is too short - should be 8 chars minimum.')
      .matches(phoneRegex, "That does not look like phone number"),
  insta: yup
      .string()
      .min(3, 'Insta name is too short - should be 3 chars minimum.'),
  messenger: yup
      .string()
      .min(3, 'Messenger name is too short - should be 3 chars minimum.'),
  whatsapp: yup
      .string()
      .min(7, 'Whatsapp number is too short - should be 7 chars minimum.')
      .matches(phoneRegex, "That does not look like whatsapp number"),
})

type PropsType = {
  addBookingApiError: string | undefined
  addBookedConsultation: (values: AddConsultationFormValues) => void
  closeBookingModal: () => void
}

export const AddConsultationForm: React.FC<PropsType> = React.memo(({
  addBookingApiError,
  addBookedConsultation,
  closeBookingModal,
}) => {

  const submit = (values: AddConsultationFormValues) => {
    addBookedConsultation(values)
    //actions.setSubmitting(false)
    //actions.resetForm()
    closeBookingModal()
  }

  const initialValues: AddConsultationFormValues = {
    bookingName: '',
    email: '',
    phone: '',
    insta: '',
    whatsapp: '',
    messenger: '',
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
            { addBookingApiError  !== '' &&
                <ApiErrorMessage message={addBookingApiError}/>
            }
            <FieldComponent
                name={'bookingName'}
                type={'text'}
                placeholder={"Customer's Full Name"}
                value={propsF.values.bookingName}
                onChange={propsF.handleChange}
            />

            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                onChange={propsF.handleChange}
                value={propsF.values.email}
            />
            <FieldComponent
                name={'phone'}
                type={'tel'}
                placeholder={'Phone'}
                onChange={propsF.handleChange}
                value={propsF.values.phone}
            />
            <FieldComponent
                name={'insta'}
                type={'text'}
                placeholder={'Instagram'}
                onChange={propsF.handleChange}
                value={propsF.values.insta}
            />
            <FieldComponent
                name={'messenger'}
                type={'text'}
                placeholder={'Messenger'}
                onChange={propsF.handleChange}
                value={propsF.values.messenger}
            />
            <FieldComponent
                name={'whatsapp'}
                type={'text'}
                placeholder={'Whatsapp'}
                onChange={propsF.handleChange}
                value={propsF.values.whatsapp}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--bg btn--transparent form__submit-btn booking__submit-btn"
            >
                {isSubmitting
                    ? 'Please wait...'
                    : 'Add Consultation'
                }
            </button>
          </Form>
        )
      }}
    </Formik>
)})
