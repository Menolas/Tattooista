import * as React from 'react'
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues, useField } from 'formik'
import {phoneRegex} from '../../utils/validators'
import * as Yup from 'yup'
import {BookConsultationFormValues} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import {useState} from "react";
import {FieldWrapper} from "./FieldWrapper";
import {FormSelect} from "./FormSelect";
import * as yup from "yup";

const options = [
  { value: "email", label: "email" },
  { value: "phone", label: "phone" },
  { value: "whatsapp", label: "whatsapp" },
  { value: "messenger", label: "messenger" },
  { value: "insta", label: "insta" }
]

const validationSchema = Yup.object().shape({
  name: Yup.string()
      .min(2, 'Must be minimum longer two characters')
      .max(30, 'Must be shorter than 31 character')
      .required('Required Field'),
  contact: Yup.string()
      .required("Please select a way to contact you"),
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

  const [contactInput, setContactInput] = useState('')

  const handleChange = (input: string) => {
    setContactInput(input)
  }


  const submit = (values: BookConsultationFormValues, actions: FormikHelpers<FormikValues>) => {
    console.log("submit hit!!!!!!!!")
    bookConsultation(values)
    if (closeBookingModal) {
      closeBookingModal();
    }
    actions.setSubmitting(false)
    actions.resetForm()
  }

  const initialValues: BookConsultationFormValues = {
    name: '',
    contact: null,
    email: '',
    phone: '',
    insta: '',
    whatsapp: '',
    messenger: '',
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
            {/*<pre>{JSON.stringify(propsF, undefined, 2)}</pre>*/}
            <FieldComponent
              name={'name'}
              type={'text'}
              placeholder={'Your Full Name'}
              value={propsF.values.name}
              onChange={propsF.handleChange}
            />

            <FieldWrapper
                wrapperClass={'booking__input-wrap'}
                name={"contact"}
                label={'Choose the way you want me to contact you'}
            >
              <FormSelect name="contact" options={options} handleChange={handleChange} />
            </FieldWrapper>
            { contactInput &&
                <FieldComponent
                    name={contactInput}
                    type={'text'}
                    placeholder={'Your contact'}
                    value={propsF.values.contactInput}
                    onChange={propsF.handleChange}
                />
            }
            <FieldWrapper
                wrapperClass={'booking__input-wrap'}
                name={"message"}
            >
              <Field
                  component="textarea"
                  name="message"
                  placeholder={'Your message'}
                  value={propsF.values.message}
                  onChange={propsF.handleChange}
              />
            </FieldWrapper>
            <FieldWrapper
                wrapperClass={'form__input-wrap--checkbox'}
                name={"consent"}
            >
              <Field
                  type="checkbox"
                  name="consent"
                  id={consentId}
                  value={propsF.values.concent}
                  onChange={propsF.handleChange}
              />
              <label htmlFor={consentId}>
                <span className="checkbox">{''}</span>
                CONSENT WITH PROCESSING OF MY PERSONAL DATA
              </label>
            </FieldWrapper>
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
