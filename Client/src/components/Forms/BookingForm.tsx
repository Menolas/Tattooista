import * as React from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {phoneRegex} from "../../utils/validators";
import * as Yup from "yup";
import {BookConsultationFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {useEffect, useState, useRef,} from "react";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {FormSelect2} from "./formComponents/FormSelect2";
import {useDispatch} from "react-redux";
import {addBooking} from "../../redux/Bookings/bookings-reducer";

const options = [
  { value: "email", label: "email" },
  { value: "phone", label: "phone" },
  { value: "whatsapp", label: "whatsapp" },
  { value: "messenger", label: "messenger" },
  { value: "insta", label: "instagram" }
];

type ContactField = 'email' | 'phone' | 'insta' | 'whatsapp' | 'messenger';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
      .min(2, "Must be minimum longer two characters")
      .max(30, "Must be shorter than 31 character")
      .required("Required Field"),
  contact: Yup.string()
      .required("Please select a way to contact you"),
  email: Yup.string().when('contact', {
        is: (contact: string | undefined) => contact === 'email',
        then: () => Yup.string().required("Please, provide your email.").email("Email should have correct format")
      }),
  phone: Yup.string().when('contact', {
        is: (contact: string | undefined) => contact === 'phone',
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
        is: (contact: string | undefined) => contact === 'whatsapp',
        then: () => Yup.string().required("Please, provide you whatsapp number.")
      }),
  message: Yup.string()
      .min(20, "Must be at least twenty characters long")
      .max(600, "Must be shorter than 200 character")
      .required("Required Field"),
  consent: Yup.boolean().oneOf([true],"Required Field")
});

const initialValues: BookConsultationFormValues = {
  fullName: '',
  contact: '',
  email: '',
  phone: '',
  insta: '',
  whatsapp: '',
  messenger: '',
  message: 'Hey there,\n' +
      '\n' +
      'I\'ve got a burning question about getting a tattoo and would love to get some insights from your awesome team. Do tattoos hurt more than the existential dread of knowing we\'re all just fleeting shadows in a vast, indifferent universe?\n' +
      '\n' +
      'Looking forward to your reply before my soul turns to dust.\n' +
      '\n' +
      'Cheers!',
  consent: false,
};

type PropsType = {
  apiError: string | null;
  consentId: string;
  closeBookingModal?: () => void;
};

export const BookingForm: React.FC<PropsType> = React.memo(({
  apiError,
  consentId,
  closeBookingModal,
}) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [contactInput, setContactInput] = useState('');

  const dispatch = useDispatch();

  const submit = async (
      values: BookConsultationFormValues,
      actions: FormikHelpers<BookConsultationFormValues>
  ) => {
    const success = await dispatch(addBooking(values));
    if (success && closeBookingModal) {
      closeBookingModal();
    }
    actions.setSubmitting(false);
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust height on mount
  }, []);

  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submit}
      >
      {(propsF) => {

        const handleChange = (input: string) => {
          propsF.setFieldValue('email', '');
          propsF.setFieldValue('phone', '');
          propsF.setFieldValue('insta', '');
          propsF.setFieldValue('whatsapp', '');
          propsF.setFieldValue('messenger', '');
          setContactInput(input);
        }

        return (
          <Form id="booking"
            className="form booking__form"
          >
            <FieldComponent
              name={'fullName'}
              type={'text'}
              placeholder={'Your Full Name'}
              value={propsF.values.fullName}
              onChange={propsF.handleChange}
            />

            <FieldWrapper
                wrapperClass={'booking__input-wrap'}
                name={"contact"}
            >
              <FormSelect2
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
                    value={propsF.values[contactInput as ContactField]}
                    onChange={propsF.handleChange}
                />
            }
            <FieldWrapper
                wrapperClass={'booking__input-wrap'}
                name={"message"}
            >
              <Field
                  id="messageTextarea"
                  component="textarea"
                  name="message"
                  placeholder={'Your message'}
                  value={propsF.values.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    propsF.handleChange(e);
                    adjustTextareaHeight();
                  }}
                  innerRef={textareaRef}
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
            { !!apiError &&
                <ApiErrorMessage message={apiError}/>
            }
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
  )
});

BookingForm.displayName = 'BookingForm';
