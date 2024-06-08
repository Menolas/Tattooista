import * as React from "react";
import { useState } from "react";
import {Field, Form, Formik, FormikHelpers, FormikValues} from "formik";
import {
  ApiErrorMessage,
  isFileSizeValid,
  isFileTypesValid,
  MAX_FILE_SIZE,
  phoneRegex,
  VALID_FILE_EXTENSIONS
} from "../../utils/validators";
import {AddClientFormValues, ClientType} from "../../types/Types";
import {API_URL} from "../../http";
// @ts-ignore
import avatar from "../../assets/img/fox.webp";
import {FieldComponent} from "./formComponents/FieldComponent";
import * as Yup from "yup";
import {FieldWrapper} from "./formComponents/FieldWrapper";

const getValidationSchema = (isEditing: boolean, hasNewFile: boolean) => {
  let schema = Yup.object().shape({
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
        .min(8, 'Whatsapp number is too short - should be 8 chars minimum.')
        .matches(phoneRegex, 'That does not look like whatsapp number'),
  });

  if (!isEditing || hasNewFile) {
    schema = schema.concat(Yup.object().shape({
      avatar: Yup.mixed()
          .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
            if (!value) return true
            return isFileSizeValid([value], MAX_FILE_SIZE);
          })
          .test('fileType', 'Invalid file type', (value: File) => {
            if (!value) return true
            return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
          }),
    }));
  }
  return schema;
};

type PropsType = {
  apiError: string | null;
  isEditing: boolean;
  data: ClientType;
  closeModal: () => void;
  edit: (clientId: string, values: FormData) => void;
  add?: (values: FormData) => void;
}

export const UpdateClientForm: React.FC<PropsType> = React.memo(({
  apiError,
  isEditing,
  data,
  closeModal,
  edit,
  add,
}) => {
  //console.log(JSON.stringify(profile) + " profile !!!!!!!!!!!!!!!!!!");

  const [hasNewFile, setHasNewFile] = useState(false);
  const validationSchema = getValidationSchema(isEditing, hasNewFile);
  const [imageURL, setImageURL] = useState('');

  const handleOnChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result);
      }
      setHasNewFile(true);
      fileReader.readAsDataURL(file);
    }
  }

  const initialValues: AddClientFormValues = {
    avatar: data?.avatar ?? '',
    clientName: data?.fullName ?? '',
    email: data?.contacts?.email ?? '',
    insta: data?.contacts?.insta ?? '',
    messenger: data?.contacts?.messenger ?? '',
    phone: data?.contacts?.phone ?? '',
    whatsapp: data?.contacts?.whatsapp ?? ''
  }

  const submit = async (values: AddClientFormValues, actions: FormikHelpers<FormikValues>) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    let success;
    if (isEditing) {
      success = await edit(data._id, formData);
    } else {
      success = await add(formData);
    }
    const isSuccess = Boolean(success);
    if (isSuccess) {
        closeModal();
    }
    actions.setSubmitting(false);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
      context={{ isEditing: isEditing }}
      enableReinitialize={true}
    >
      {propsF => {

        return (
          <Form className="form form--updateClient" encType={"multipart/form-data"}>
            <FieldWrapper name={'avatar'} wrapperClass={'form__input-wrap--uploadFile'}>
              <div className="form__input-wrap--uploadFile-img">
                <img
                  src={ imageURL
                      ? imageURL
                      : data?.avatar
                          ? `${API_URL}/clients/${data._id}/avatar/${data.avatar}`
                          : avatar
                  }
                  alt="preview"
                />
                <label className="btn btn--sm btn--dark-bg" htmlFor={"avatar"}>
                  Pick File
                </label>
              </div>
              <Field
                className="hidden"
                id="avatar"
                name={'avatar'}
                type={'file'}
                value={undefined}
                onChange={(e) => {
                  propsF.setFieldValue('avatar', e.currentTarget.files[0]);
                  handleOnChange(e);
                }}
              />
            </FieldWrapper>
            <FieldComponent
                name={'clientName'}
                type={'text'}
                placeholder={'Monica Bellucci'}
                label={'Full Name'}
                onChange={propsF.handleChange}
                value={propsF.values.clientName}
            />
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'monica_bellucci@gmail.com'}
                label={'Email'}
                onChange={propsF.handleChange}
                value={propsF.values.email}
            />
            <FieldComponent
                name={'phone'}
                type={'tel'}
                placeholder={'+47(222)-23-34'}
                label={'Phone'}
                onChange={propsF.handleChange}
                value={propsF.values.phone}
            />
            <FieldComponent
                name={'insta'}
                type={'text'}
                placeholder={'@Monica'}
                label={'Instagram'}
                onChange={propsF.handleChange}
                value={propsF.values.insta}
            />
            <FieldComponent
                name={'messenger'}
                type={'text'}
                placeholder={'@Monica'}
                label={'Messenger'}
                onChange={propsF.handleChange}
                value={propsF.values.messenger}
            />
            <FieldComponent
                name={'whatsapp'}
                type={'text'}
                placeholder={'+47(222)-23-34'}
                label={'Whatsapp'}
                onChange={propsF.handleChange}
                value={propsF.values.whatsapp}
            />
            { !!apiError &&
                <ApiErrorMessage message={apiError}/>
            }
            <button
              type="submit"
              disabled={!propsF.dirty || propsF.isSubmitting}
              className="btn btn--bg btn--dark-bg form__submit-btn">
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
});
