import * as React from "react";
import {Form, Formik, FormikHelpers} from "formik";
import * as Yup from 'yup';
import {phoneRegex} from "../../utils/validators";
import {AddConsultationFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {useDispatch} from "react-redux";
import {addBooking} from "../../redux/Bookings/bookings-reducer";
import {handleEnterClick} from "../../utils/functions";

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
      .min(2, 'Must be minimum longer two characters')
      .max(30, 'Must be shorter than 31 character')
      .required('Required Field'),
  email: Yup.string()
      .email("Email should have correct format")
      .when(['phone', 'insta', 'messenger', 'whatsapp'], {
        is: (
            phone: string | undefined,
            insta: string | undefined,
            messenger: string | undefined,
            whatsapp: string | undefined
        ) =>
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
  fullName: '',
  email: '',
  phone: '',
  insta: '',
  whatsapp: '',
  messenger: '',
};

type PropsType = {
  apiError: string | null;
  closeBookingModal: () => void;
};

export const AddBookingForm: React.FC<PropsType> = React.memo(({
  apiError,
  closeBookingModal,
}) => {

  const dispatch = useDispatch();

  const submit = async (values: AddConsultationFormValues, actions: FormikHelpers<AddConsultationFormValues>) => {
    const success = await dispatch(addBooking(values));
    if (success && closeBookingModal) {
      closeBookingModal();
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submit}
      >
      {(propsF) => {
        const {isSubmitting} = propsF;

        return (
          <Form id="booking"
            className="form booking__form"
          >
            <FieldComponent
                name={'fullName'}
                type={'text'}
                placeholder={"Customer's Full Name"}
                value={propsF.values.fullName}
                onChange={propsF.handleChange}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />

            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                onChange={propsF.handleChange}
                value={propsF.values.email}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            <FieldComponent
                name={'phone'}
                type={'tel'}
                placeholder={'Phone'}
                onChange={propsF.handleChange}
                value={propsF.values.phone}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            <FieldComponent
                name={'insta'}
                type={'text'}
                placeholder={'Instagram'}
                onChange={propsF.handleChange}
                value={propsF.values.insta}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            <FieldComponent
                name={'messenger'}
                type={'text'}
                placeholder={'Messenger'}
                onChange={propsF.handleChange}
                value={propsF.values.messenger}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            <FieldComponent
                name={'whatsapp'}
                type={'text'}
                placeholder={'Whatsapp'}
                onChange={propsF.handleChange}
                value={propsF.values.whatsapp}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            { apiError  !== '' &&
                <ApiErrorMessage message={apiError}/>
            }
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
        );
      }}
    </Formik>
  );
});

AddBookingForm.displayName = 'AddBookingForm';
