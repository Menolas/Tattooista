import * as React from "react";
import {Form, Formik, FormikHelpers, FormikValues} from "formik";
import * as Yup from 'yup';
import {ApiErrorMessage, phoneRegex} from "../../utils/validators";
import {AddConsultationFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";

const validationSchema = Yup.object().shape({
  bookingName: Yup.string()
      .min(2, 'Must be minimum longer two characters')
      .max(30, 'Must be shorter than 31 character')
      .required('Required Field'),
  email: Yup.string()
      .email("Email should have correct format")
      .when(['phone', 'insta', 'messenger', 'whatsapp'], {
        is: (phone, insta, messenger, whatsapp) =>
            !phone && !insta && !messenger && !whatsapp,
        then: () => Yup.string().required('At least one field must be filled'),
  }),
  phone: Yup.string()
      .min(8, 'Phone number is too short - should be 8 chars minimum.')
      .matches(phoneRegex, "That does not look like phone number"),
  insta: Yup.string()
      .min(3, 'Insta name is too short - should be 3 chars minimum.'),
  messenger: Yup.string()
      .min(3, 'Messenger name is too short - should be 3 chars minimum.'),
  whatsapp: Yup.string()
      .min(7, 'Whatsapp number is too short - should be 7 chars minimum.')
      .matches(phoneRegex, "That does not look like whatsapp number"),
});

const initialValues: AddConsultationFormValues = {
  bookingName: '',
  email: '',
  phone: '',
  insta: '',
  whatsapp: '',
  messenger: '',
};

type PropsType = {
  apiError: number | string;
  addBooking: (values: AddConsultationFormValues) => void;
  closeBookingModal: () => void;
};

export const AddBookingForm: React.FC<PropsType> = React.memo(({
  apiError,
  addBooking,
  closeBookingModal,
}) => {

  const submit = async (values: AddConsultationFormValues, actions: FormikHelpers<FormikValues>) => {
    const success = await addBooking(values);
    const isSuccess = Boolean(success);
    if (isSuccess && closeBookingModal) {
      closeBookingModal();
    }
    actions.setSubmitting(false);
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
            { apiError  !== '' &&
                <ApiErrorMessage message={apiError}/>
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
              disabled={!propsF.dirty || isSubmitting}
              className="btn btn--bg btn--dark-bg form__submit-btn booking__submit-btn"
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
)});
