import * as React from "react";
import {Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import {phoneRegex} from "../../utils/validators";
import * as Yup from "yup";
import {BookConsultationFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {useState} from "react";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {FormSelect} from "./formComponents/FormSelect";

const options = [
  { value: "email", label: "email" },
  { value: "phone", label: "phone" },
  { value: "whatsapp", label: "whatsapp" },
  { value: "messenger", label: "messenger" },
  { value: "insta", label: "instagram" }
];

// @ts-ignore
const validationSchema = Yup.object().shape({
  bookingName: Yup.string()
      .min(2, "Must be minimum longer two characters")
      .max(30, "Must be shorter than 31 character")
      .required("Required Field"),
  contact: Yup.string()
      .required("Please select a way to contact you"),
  email: Yup.string().when('contact', {
        is: (contact) => contact === 'mail',
        then: () => Yup.string().required("Please, provide your email.").email("Email should have correct format")
      }),
  phone: Yup.string().when('contact', {
        is: (contact) => contact === 'phone',
        then: () => Yup.string().required("Please, provide you phone number.")
            .min(8, "Phone number is too short - should be 8 chars minimum.")
            .matches(phoneRegex, "That does not look like phone number.")
      }),
  insta: Yup.string()
      .min(3, "Insta name is too short - should be 3 chars minimum."),
  messenger: Yup.string()
      .min(3, "Messenger name is too short - should be 3 chars minimum."),
  whatsapp: Yup.string()
      .min(8, "Whatsapp number is too short - should be 8 chars minimum.")
      .matches(phoneRegex, "That does not look like whatsapp number")
      .when('contact', {
        is: (contact) => contact === 'whatsapp',
        then: () => Yup.string().required("Please, provide you whatsapp number.")
      }),
  message: Yup.string()
      .min(20, "Must be at least twenty characters long")
      .max(200, "Must be shorter than 200 character")
      .required("Required Field"),
  consent: Yup.boolean().oneOf([true],"Required Field")
});

type PropsType = {
  apiError: string;
  consentId: string;
  bookConsultation: (values: BookConsultationFormValues) => void;
  closeBookingModal?: () => void;
};

export const BookingForm: React.FC<PropsType> = React.memo(({
  apiError,
  consentId,
  bookConsultation,
  closeBookingModal,
}) => {

  const [contactInput, setContactInput] = useState('');

  const handleChange = (input: string) => {
    setContactInput(input);
  }


  const submit = (values: BookConsultationFormValues, actions: FormikHelpers<FormikValues>) => {
    bookConsultation(values);
    if (closeBookingModal) {
      closeBookingModal();
    }
    actions.setSubmitting(false);
    actions.resetForm();
  }

  const initialValues: BookConsultationFormValues = {
    bookingName: '',
    contact: '',
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

        return (
          <Form id="booking"
            className="form booking__form"
          >
            <h3 className="form__title">
              FILL THE FORM AND WE WILL CONTACT YOU SOON
            </h3>
            <FieldComponent
              name={'bookingName'}
              type={'text'}
              placeholder={'Your Full Name'}
              value={propsF.values.name}
              onChange={propsF.handleChange}
            />

            <FieldWrapper
                wrapperClass={'booking__input-wrap'}
                name={"contact"}
            >
              <FormSelect
                  name="contact"
                  options={options}
                  handleChange={handleChange}
                  placeholder={'Choose the way you want me to contact you'}
              />

            </FieldWrapper>
            { contactInput &&
                <FieldComponent
                    name={contactInput}
                    type={'text'}
                    placeholder={`Your ${contactInput}`}
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
                  row={8}
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
                  checked={propsF.values.consent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    propsF.setFieldValue('consent', e.target.checked);
                  }}
              />
              <label htmlFor={consentId}>
                <span className="checkbox">{''}</span>
                CONSENT WITH PROCESSING OF MY PERSONAL DATA
              </label>
            </FieldWrapper>
            <button
              type="submit"
              disabled={!propsF.dirty || propsF.isSubmitting}
              className="btn btn--bg btn--dark-bg form__submit-btn booking__submit-btn"
            >
                {propsF.isSubmitting
                    ? 'Please wait...'
                    : 'Book a consultation'
                }
            </button>
          </Form>
        )
      }}
    </Formik>
)})
