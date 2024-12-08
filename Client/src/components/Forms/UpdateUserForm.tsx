import * as React from "react";
import { useState } from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {
  isFileSizeValid,
  isFileTypesValid,
  MAX_FILE_SIZE,
  VALID_FILE_EXTENSIONS
} from "../../utils/validators";
import {RoleType, UpdateUserFormValues, UserType} from "../../types/Types";
import {API_URL} from "../../http";
import {FieldComponent} from "./formComponents/FieldComponent";
import * as Yup from "yup";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {useDispatch, useSelector} from "react-redux";
import {
  updateUser,
  addUser,
} from "../../redux/Users/users-reducer";
import {DefaultAvatar} from "../common/DefaultAvatar";
import {handleEnterClick} from "../../utils/functions";
import {getAuthSelector, getTokenSelector} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";
import {SUPER_ADMIN} from "../../utils/constants";

const getValidationSchema = (isEditing: boolean, hasNewFile: boolean) => {
  let schema = Yup.object().shape({
    displayName: Yup.string()
        .min(2, 'Name is too short - should be 2 chars minimum.')
        .required("First name is a required field"),
    email: Yup.string()
        .email("Email should have correct format")
        .required("Email is a required field"),
    password: Yup
        .string()
        .min(4, 'Password is too short - should be 4 chars minimum.'),
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
              'Invalid file type',
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
  fromProfile: boolean;
  apiError: string | null;
  isEditing: boolean;
  roles: Array<RoleType>;
  data?: UserType | null;
  closeModal: () => void;
};

export const UpdateUserForm: React.FC<PropsType> = React.memo(({
  fromProfile,
  apiError,
  isEditing,
  roles,
  data,
  closeModal,
}) => {
  const token = useSelector(getTokenSelector);
  const isAuth = useSelector(getAuthSelector);
  const [hasNewFile, setHasNewFile] = useState(false);
  const validationSchema = getValidationSchema(isEditing, hasNewFile);
  const [imageURL, setImageURL] = useState('');

  const dispatch = useDispatch<AppDispatch>();

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

  const isEditingWithData = isEditing && data;

  const rolesInitialValues = roles?.reduce((acc, role) => {
    const isSelected = isEditingWithData ? data.roles.some(profileRole => profileRole === role._id) : false;
    return {
        ...acc,
        [role._id]: isSelected,
    };
  }, {});


  const initialValues: UpdateUserFormValues = {
    avatar: data?.avatar ?? '',
    displayName: data?.displayName ?? '',
    email: data?.email ?? '',
    password: '',
    roles: rolesInitialValues,
  };

  const submit = async (values: UpdateUserFormValues, actions: FormikHelpers<UpdateUserFormValues>) => {
    const formData = new FormData();
    for (const key in values) {
      if (key === 'roles') {
        let roles = "";
        const userRoles = values[key];
        for (const roleId in userRoles) {
          if (userRoles[roleId]) {
            roles = roles + roleId + ' '
          }
        }
        formData.append(key, roles);
      } else {
        formData.append(key, values[key]);
      }
    }

    let success;
    if (isEditing && data) {
      success = await dispatch(updateUser(fromProfile, token, roles, data._id, formData));
    } else {
      success = await dispatch(addUser(token, formData));
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

        const rolesFields = roles?.map((role) => {
          return (
              <FieldWrapper
                  key={role._id}
                  wrapperClass={'form__input-wrap--checkbox'}
                  name={`roles.${role._id}`}
              >
                <Field
                    type="checkbox"
                    name={`roles.${role._id}`}
                    id={role._id}
                    checked={(propsF.values.roles as { [key: string]: boolean })[role._id]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      propsF.setFieldValue(`roles.${role._id}`, e.target.checked);
                    }}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      handleEnterClick(event, propsF.handleSubmit)
                    }}
                />
                <label htmlFor={role._id}>
                  <span className="checkbox">{''}</span>
                  {role.value}
                </label>
              </FieldWrapper>
          )
        });

        return (
          <Form className="form" encType={"multipart/form-data"}>
            <FieldWrapper name={'avatar'} wrapperClass={'form__input-wrap--uploadFile'}>
              <div className="form__input-wrap--uploadFile-img">
                { !imageURL
                    ? !data?.avatar
                        ? <DefaultAvatar/>
                        : <img src={`${API_URL}/users/${data?._id}/avatar/${data?.avatar}`} alt="preview"/>
                    : <img src={imageURL} alt="preview"/>
                }
                <label className="btn btn--sm btn--dark-bg" htmlFor={"avatar"}>Pick File</label>
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
                  onKeyDown={(event: React.KeyboardEvent) => {
                    handleEnterClick(event, propsF.handleSubmit)
                  }}
              />
            </FieldWrapper>
            <FieldComponent
                name={'displayName'}
                type={'text'}
                placeholder={'Full Name'}
                onChange={propsF.handleChange}
                value={propsF.values.displayName}
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
                name={'password'}
                type={'password'}
                placeholder={'xxxxxxxx'}
                label={'Password'}
                onChange={propsF.handleChange}
                value={propsF.values.password}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleEnterClick(event, propsF.handleSubmit)
                }}
            />
            { (isAuth && isAuth === SUPER_ADMIN) && rolesFields }
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

UpdateUserForm.displayName = 'UpdateUserForm';
