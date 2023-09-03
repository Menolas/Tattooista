import * as React from 'react'
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import * as Yup from 'yup'
import {ErrorMessageWrapper} from '../../utils/validators'
import {AddCustomerFormValues} from "../../types/Types";

const validationSchema = Yup.object().shape({
  name: Yup.string()
      .min(2, 'Must be minimum longer two characters')
      .max(30, 'Must be shorter than 31 character')
      .required('Required Field'),
  contact: Yup.string().required('Required Field'),
  contactValue: Yup.string().required('Required Field')
})

type PropsType = {
  addCustomer: (values: AddCustomerFormValues) => void
  closeBookingModal: () => void
}

export const AddingCustomerForm: React.FC<PropsType> = React.memo(({
  addCustomer,
  closeBookingModal,
}) => {

  const submit = (values: AddCustomerFormValues) => {
    addCustomer(values)
    //actions.setSubmitting(false)
    //actions.resetForm()
    closeBookingModal()
  }

  const initialValues: AddCustomerFormValues = {
    name: '',
    contact: '',
    contactValue: ''
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
                placeholder={"Customer's Full Name"}
              />
              <ErrorMessage name='name'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>

            <div className="form__input-wrap booking__input-wrap">
              <Field
                name={'contact'}
                as="select"
                placeholder={"Choose the way customer want's to be contacted"}
              >
                  <option>Choose the way customer want's to be contacted</option>
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
                  placeholder={'Customers contact'}
                />
                <ErrorMessage name='contactValue'>
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
                    : 'Add customer'
                }
            </button>
          </Form>
        )
      }}
    </Formik>
)})
