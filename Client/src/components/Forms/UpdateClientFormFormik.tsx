import * as React from 'react'
import { useState } from 'react'
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import * as yup from 'yup'
import {ErrorMessageWrapper} from '../../utils/validators'
import {AddClientFormValues, ClientType} from '../../types/Types'
import {SERVER_URL} from '../../utils/constants'
// @ts-ignore
import avatar from '../../assets/img/fox.webp'

const validationSchema = yup.object().shape({
  name: yup.string()
    .matches(/^([^0-9]*)$/, "First name should not contain numbers")
    .required("First name is a required field"),
  email: yup.string()
    .email("Email should have correct format"),
  insta: yup.string(),
  messenger: yup.string(),
  phone: yup.string(),
  whatsapp: yup.string(),
})

type PropsType = {
  profile?: ClientType
  closeModal: () => void
  editClient?: (clientId: string, values: FormData) => void
  addClient?: (values: FormData) => void
}

export const UpdateClientForm: React.FC<PropsType> = React.memo(({
  profile,
  closeModal,
  editClient,
  addClient,
}) => {

  const [imageURL, setImageURL] = useState('')
  console.log(imageURL)

  const handleOnChange = (event) => {
    event.preventDefault()
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        setImageURL(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const initialValues: AddClientFormValues = {
    avatar: profile && profile.avatar ? profile.avatar : '',
    name: profile && profile.fullName ? profile.fullName : '',
    email: profile && profile.contacts.email ? profile.contacts.email : '',
    insta: profile && profile.contacts.insta ? profile.contacts.insta : '',
    messenger: profile && profile.contacts.messenger ? profile.contacts.messenger : '',
    phone: profile && profile.contacts.phone ? profile.contacts.phone : '',
    whatsapp: profile && profile.contacts.whatsapp ? profile.contacts.whatsapp : ''
  }

  const submit = (values: AddClientFormValues, actions: FormikHelpers<FormikValues>) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    if (profile) {
      editClient(profile._id, formData)
    } else {
      addClient(formData)
    }
    closeModal()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {propsF => {

        return (
          <Form className="form" encType={"multipart/form-data"}>
            <div className="form__input-wrap form__input-wrap--uploadFile">
              <div className="form__avatar">
                {
                  profile &&
                    <img
                      src={imageURL ? imageURL : `${SERVER_URL}/clients/${profile._id}/avatar/${profile.avatar}`}
                      alt="preview"
                    />
                }
                {
                  !profile &&
                    <img
                        src={imageURL ? imageURL : avatar}
                        alt="preview"
                    />
                }

              </div>
              <label className="btn btn--sm" htmlFor={"avatar"}>Pick File</label>
              <Field
                className="hidden"
                id="avatar"
                name={'avatar'}
                type={'file'}
                accept='image/*,.png,.jpg,.web,.jpeg,.webp'
                value={undefined}
                onChange={(e) => {
                  propsF.setFieldValue('avatar', e.currentTarget.files[0])
                  handleOnChange(e)
                }}
              />
            </div>
            <div className="form__input-wrap">
              <Field name={'name'} type={'text'} placeholder={'Full Name'}
                     onChange={propsF.handleChange}
                     value={propsF.values.name}/>
              <ErrorMessage name='name'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap">
              <Field name={'email'} type={'text'} placeholder={'Email'}
                     onChange={propsF.handleChange}
                     value={propsF.values.email}/>
              <ErrorMessage name='email'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap">
              <Field name={'phone'} type={'text'} placeholder={'Phone'}
                     onChange={propsF.handleChange}
                     value={propsF.values.phone}/>
              <ErrorMessage name='phone'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap">
              <Field name={'insta'} type={'text'} placeholder={'Instagram'}
                     onChange={propsF.handleChange}
                     value={propsF.values.insta}/>
              <ErrorMessage name='insta'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap">
              <Field name={'messenger'} type={'text'} placeholder={'Messenger'}
                     onChange={propsF.handleChange}
                     value={propsF.values.messenger}/>
              <ErrorMessage name='messenger'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <div className="form__input-wrap">
              <Field name={'whatsapp'} type={'text'} placeholder={'whatsapp'}
                     onChange={propsF.handleChange}
                     value={propsF.values.whatsapp}/>
              <ErrorMessage name='whatsapp'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
            <button
              type="submit"
              disabled={propsF.isSubmitting}
              className="btn btn--bg btn--transparent form__submit-btn">
              {propsF.isSubmitting
                ? 'Please wait...'
                : 'SUBMIT'
              }
            </button>
            {/*<pre>{JSON.stringify(values, 0, 2)}</pre>*/}
          </Form>
        )
      }}
    </Formik>
  )
})

