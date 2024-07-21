import * as React from "react";
import { useState } from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {
  isFileSizeValid,
  isFileTypesValid,
  MAX_FILE_SIZE,
  phoneRegex,
  VALID_FILE_EXTENSIONS
} from "../../utils/validators";
import {AddClientFormValues, ClientType} from "../../types/Types";
import {API_URL} from "../../http";
import {FieldComponent} from "./formComponents/FieldComponent";
import * as Yup from "yup";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {useDispatch} from "react-redux";
import {editClient, addClient} from "../../redux/Clients/clients-reducer";
import {DefaultAvatar} from "../common/DefaultAvatar";

const getValidationSchema = (isEditing: boolean, hasNewFile: boolean) => {
  let schema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Name is too short - should be 2 chars minimum.')
        .matches(/^([^0-9]*)$/, "First name should not contain numbers")
        .required("First name is a required field"),
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
          .test(
              'fileSize',
              'Max allowed size is 1024*1024',
              (value) => {
            if (value instanceof File) {
              return isFileSizeValid([value], MAX_FILE_SIZE);
            }
            return true;
          })
          .test(
              'fileType',
              'Invalid file type. Must be jpg, gif, png, jpeg, svg, webp.',
              (value) => {
            if (value instanceof File) {
              return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
            }
            return true;
          }),
    }));
  }
  return schema;
};

type PropsType = {
  apiError: string | null;
  isEditing: boolean;
  data: ClientType | null;
  closeModal: () => void;
};

export const UpdateClientForm: React.FC<PropsType> = React.memo(({
  apiError,
  isEditing,
  data,
  closeModal,
}) => {

  const [hasNewFile, setHasNewFile] = useState(false);
  const validationSchema = getValidationSchema(isEditing, hasNewFile);
  const [imageURL, setImageURL] = useState('');

  const dispatch = useDispatch();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        if (typeof fileReader.result === 'string') {
          setImageURL(fileReader.result);
        } else {
          setImageURL('');
        }
      }
      setHasNewFile(true);
      fileReader.readAsDataURL(file);
    }
  };

  const initialValues: AddClientFormValues = {
    avatar: data?.avatar ?? '',
    fullName: data?.fullName ?? '',
    email: data?.contacts?.email ?? '',
    insta: data?.contacts?.insta ?? '',
    messenger: data?.contacts?.messenger ?? '',
    phone: data?.contacts?.phone ?? '',
    whatsapp: data?.contacts?.whatsapp ?? ''
  };

  const submit = async (values: AddClientFormValues, actions: FormikHelpers<AddClientFormValues>) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const valueKey = key as keyof AddClientFormValues;
      const value = values[valueKey];
      if (value instanceof File) {
        formData.append(valueKey, value);
      } else if (typeof value === 'string') {
        formData.append(valueKey, value);
      }
    });
    let success;
    if (isEditing && data) {
      success = await dispatch(editClient(data._id, formData));
    } else {
      success = await dispatch(addClient(formData));
    }
    if (success) {
        closeModal();
    }
    actions.setSubmitting(false);
  };

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
                { !imageURL
                    ? !data?.avatar
                        ? <DefaultAvatar/>
                        : <img src={`${API_URL}/clients/${data._id}/avatar/${data.avatar}`} alt="preview"/>
                    : <img src={imageURL} alt="preview"/>
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                    propsF.setFieldValue('avatar', e.currentTarget.files[0]);
                    handleOnChange(e);
                  }
                }}
              />
            </FieldWrapper>
            <FieldComponent
                name={'fullName'}
                type={'text'}
                placeholder={'Monica Bellucci'}
                label={'Full Name'}
                onChange={propsF.handleChange}
                value={propsF.values.fullName}
            />
            <FieldComponent
                name={'email'}
                type={'text'}
                placeholder={'monica_bellucci@gmail.com'}
                label={'Email'}
                onChange={propsF.handleChange}
                value={propsF.values.email ?? ''}
            />
            <FieldComponent
                name={'phone'}
                type={'tel'}
                placeholder={'+47(222)-23-34'}
                label={'Phone'}
                onChange={propsF.handleChange}
                value={propsF.values.phone ?? ''}
            />
            <FieldComponent
                name={'insta'}
                type={'text'}
                placeholder={'@Monica'}
                label={'Instagram'}
                onChange={propsF.handleChange}
                value={propsF.values.insta ?? ''}
            />
            <FieldComponent
                name={'messenger'}
                type={'text'}
                placeholder={'@Monica'}
                label={'Messenger'}
                onChange={propsF.handleChange}
                value={propsF.values.messenger ?? ''}
            />
            <FieldComponent
                name={'whatsapp'}
                type={'text'}
                placeholder={'+47(222)-23-34'}
                label={'Whatsapp'}
                onChange={propsF.handleChange}
                value={propsF.values.whatsapp ?? ''}
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
        );
      }}
    </Formik>
  );
});

UpdateClientForm.displayName = 'UpdateClientForm';
