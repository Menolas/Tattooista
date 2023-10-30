import * as React from 'react'
import { useState } from 'react'
import {Field, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import {phoneRegex} from '../../utils/validators'
import {AddClientFormValues, ClientType} from '../../types/Types'
import {SERVER_URL} from '../../utils/constants'
// @ts-ignore
import avatar from '../../assets/img/fox.webp'
import {FieldComponent} from './FieldComponent'
import * as Yup from 'yup'
import {FieldWrapper} from './FieldWrapper'

interface UpdateClientFormType {
  avatar: FileList
  clientName: string
  email: string
  phone: string
  insta: string
  messenger: string
  whatsapp: string
}

const validationSchema = Yup.object().shape({
  avatar: Yup.mixed()
      .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
        if (!value) return true
        return value.size <= 1024 * 1024
      })
      .test('fileType', 'Invalid file type', (value: File) => {
        if (!value) return true
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
      }),
  clientName: Yup.string()
    .min(2, 'Name is too short - should be 2 chars minimum.')
    .matches(/^([^0-9]*)$/, "First name should not contain numbers")
    .required("First name is a required field"),
  email: Yup.string()
    .email("Email should have correct format")
      .when(['phone', 'insta', 'messenger', 'whatsapp'], {
        is: (phone, insta, messenger, whatsapp) =>
            !phone && !insta && !messenger && !whatsapp,
        then: () => Yup.string().required('At least one field must be filled'),
      }),
  phone: Yup.string()
    .min(8, 'Phone number is too short - should be 8 chars minimum.')
    .matches(phoneRegex, 'That does not look like phone number'),
  insta: Yup.string()
      .min(3, 'Insta name is too short - should be 3 chars minimum.'),
  messenger: Yup.string()
      .min(3, 'Messenger name is too short - should be 3 chars minimum.'),
  whatsapp: Yup.string()
      .min(7, 'Whatsapp number is too short - should be 7 chars minimum.')
      .matches(phoneRegex, 'That does not look like whatsapp number'),
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

  const handleOnChange = (event) => {
    event.preventDefault()
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const initialValues: AddClientFormValues = {
    avatar: profile && profile.avatar ? profile.avatar : '',
    clientName: profile && profile.fullName ? profile.fullName : '',
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
            {/*<pre>{JSON.stringify(propsF, undefined, 2)}</pre>*/}
            <div className="form__input-wrap form__input-wrap--uploadFile">
              <div className="form__avatar">
                <img
                  src={imageURL
                      ? imageURL
                      : profile?.avatar
                          ? `${SERVER_URL}/clients/${profile._id}/avatar/${profile.avatar}`
                          : avatar
                  }
                  alt="preview"
                />
              </div>
              <label className="btn btn--sm" htmlFor={"avatar"}>Pick File</label>
              <FieldWrapper name={'avatar'}>
                <Field
                  className="hidden"
                  id="avatar"
                  name={'avatar'}
                  type={'file'}
                  value={undefined}
                  onChange={(e) => {
                    propsF.setFieldValue('avatar', e.currentTarget.files[0])
                    handleOnChange(e)
                  }}
                />
              </FieldWrapper>
            </div>
            <FieldComponent
                name={'clientName'}
                type={'text'}
                placeholder={'Full Name'}
                onChange={propsF.handleChange}
                value={propsF.values.clientName}
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
              disabled={propsF.isSubmitting}
              className="btn btn--bg btn--transparent form__submit-btn">
              {propsF.isSubmitting
                ? 'Please wait...'
                : 'SUBMIT'
              }
            </button>
          </Form>
        )
      }}
    </Formik>
  )
})

