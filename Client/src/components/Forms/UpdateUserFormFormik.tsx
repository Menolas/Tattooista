import * as React from "react"
import { useState } from "react"
import {Field, Form, Formik, FormikHelpers, FormikValues} from "formik"
import {
  isFileSizeValid,
  isFileTypesValid,
  MAX_FILE_SIZE,
  VALID_FILE_EXTENSIONS
} from "../../utils/validators"
import {AddClientFormValues, RoleType, UpdateUserFormValues, UserType} from "../../types/Types"
import {API_URL} from "../../http"
// @ts-ignore
import avatar from "../../assets/img/fox.webp"
import {FieldComponent} from "./FieldComponent"
import * as Yup from "yup"
import {FieldWrapper} from "./FieldWrapper"

const validationSchema = Yup.object().shape({
  avatar: Yup.mixed()
      .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
        if (!value) return true
        return isFileSizeValid([value], MAX_FILE_SIZE)
      })
      .test('fileType', 'Invalid file type', (value: File) => {
        if (!value) return true
        return isFileTypesValid([value], VALID_FILE_EXTENSIONS)
      }),
  displayName: Yup.string()
    .min(2, 'Name is too short - should be 2 chars minimum.')
    .required("First name is a required field"),
  email: Yup.string()
    .email("Email should have correct format")
      .when(['phone', 'insta', 'messenger', 'whatsapp'], {
        is: (phone, insta, messenger, whatsapp) =>
            !phone && !insta && !messenger && !whatsapp,
        then: () => Yup.string().required('At least one field must be filled'),
      }),
  password: Yup
      .string()
      .min(4, 'Password is too short - should be 4 chars minimum.')
})

type PropsType = {
  roles: Array<RoleType>
  profile?: UserType
  closeModal: () => void
  updateUser?: (clientId: string, values: FormData) => void
  addUser?: (values: FormData) => void
}

export const UpdateUserForm: React.FC<PropsType> = React.memo(({
  roles,
  profile,
  closeModal,
  updateUser,
  addUser,
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

  let initialValues = {
    avatar: profile && profile.avatar ? profile.avatar : '',
    displayName: profile && profile.displayName ? profile.displayName : '',
    email: profile && profile.email ? profile.email : '',
    password: '',
    roles: profile && profile.roles ? profile?.roles.map(role => role._id) : []
  }

  const submit = (values: AddClientFormValues, actions: FormikHelpers<FormikValues>) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    if (profile) {
      updateUser(profile._id, formData)
    } else {
      addUser(formData)
    }
    closeModal()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {(propsF) => {

        const rolesFields = roles.map((role) => {
          return (
              <FieldWrapper
                  key={role._id}
                  wrapperClass={'form__input-wrap--checkbox'}
                  name={'roles'}
              >
                <Field
                    type="checkbox"
                    name={'roles'}
                    id={role._id}
                    value={role._id}
                    checked={propsF.values.roles.includes(role._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        propsF.setFieldValue('roles', [...propsF.values.roles, e.target.value])
                      } else {
                        propsF.setFieldValue('roles', propsF.values.roles.filter((value) => value !== e.target.value))
                      }
                    }}
                />
                <label htmlFor={role._id}>
                  <span className="checkbox">{''}</span>
                  {role.value}
                </label>

              </FieldWrapper>
          )
        })
        return (
          <Form className="form" encType={"multipart/form-data"}>
            <div className="form__input-wrap form__input-wrap--uploadFile">
              <div className="form__avatar">
                <img
                  src={imageURL
                      ? imageURL
                      : profile?.avatar
                          ? `${API_URL}/users/${profile._id}/avatar/${profile.avatar}`
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
                name={'displayName'}
                type={'text'}
                placeholder={'Full Name'}
                onChange={propsF.handleChange}
                value={propsF.values.displayName}
            />
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'Email'}
                onChange={propsF.handleChange}
                value={propsF.values.email}
            />
            <FieldComponent
                name={'password'}
                type={'password'}
                placeholder={'xxxxxxxx'}
                label={'Password'}
                value={propsF.values.password}
                onChange={propsF.handleChange}
            />
            { rolesFields }
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

