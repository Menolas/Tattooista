import * as React from "react";
import {useEffect, useState} from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {API_URL} from "../../http";
import {StyleType, UpdateStyleFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {
    isFileSizeValid, isFileTypesValid,
    MAX_FILE_SIZE, VALID_FILE_EXTENSIONS,
} from "../../utils/validators";
import {useDispatch} from "react-redux";
import {addStyle, editStyle} from "../../redux/Styles/styles-reducer";
import {DefaultAvatar} from "../common/DefaultAvatar";
import tattooMachine from '../../assets/img/tattoo-machine.webp';
import {handleEnterClick} from "../../utils/functions";

const getValidationSchema = (isEditing: boolean, hasNewFile: boolean) => {
    let schema = Yup.object().shape({
        value: Yup.string()
            .matches(/^([^0-9]*)$/, "Name should not contain numbers")
            .required("Name is a required field"),
        description: Yup.string()
            .required("Description is a required field")
    });

    if (!isEditing || hasNewFile) {
        schema = schema.concat(Yup.object().shape({
            wallPaper: Yup.mixed()
                .test(
                    'fileSize',
                    'Max allowed size is 1024*1024',
                    (value) => {
                    if (value instanceof File) {
                        return isFileSizeValid([value], MAX_FILE_SIZE);
                    }
                    return true
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
    apiError: null | string;
    isEditing: boolean;
    style?: StyleType | null;
    closeModal: () => void;
};
export const UpdateStyleForm: React.FC<PropsType> = React.memo(({
    apiError,
    isEditing,
    style,
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

    useEffect(() => {
        if (isEditing) {
            setInitialValues({
                wallPaper: style?.wallPaper || '',
                value: style?.value || '',
                description: style?.description || ''
            });
        } else {
            setInitialValues({
                wallPaper: '',
                value: '',
                description: ''
            });
            setImageURL('');
        }
    }, [style, isEditing]);

    const [initialValues, setInitialValues] = useState<UpdateStyleFormValues>({
        wallPaper: '',
        value: '',
        description: ''
    });

    const submit = async (values: UpdateStyleFormValues, actions: FormikHelpers<UpdateStyleFormValues>) => {
        const formData = new FormData();
        for (const key in values) {
            const valueKey = key as keyof UpdateStyleFormValues;
            const value = values[valueKey];

            if (value !== undefined && value !== null) {
                if (typeof value === 'object' || value instanceof File) {
                    formData.append(key, value);
                }
            }
        }
       try {
           let success;
           if(isEditing && style) {
               success = await dispatch(editStyle(style._id, formData));
           } else {
               success = await dispatch(addStyle(formData));
           }
           if (success ) {
               closeModal();
           }
       } catch (error) {
           console.error('Error submitting form:', error);
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
                    <Form className="form form--updateTattooStyle" encType={"multipart/form-data"}>
                        <FieldWrapper name={'wallPaper'} wrapperClass={'form__input-wrap--uploadFile'}>
                            <div className={"form__input-wrap--uploadFile-img"}>
                                { imageURL
                                    ? <img src={imageURL} alt="preview"/>
                                    : isEditing && style?.wallPaper
                                        ? <img src={`${API_URL}/styleWallpapers/${style._id}/${style.wallPaper}`} alt="preview"/>
                                        : <DefaultAvatar src={tattooMachine}/>
                                }
                                <label className="btn btn--sm btn--dark-bg" htmlFor={"wallPaper"}>Pick File</label>
                            </div>
                            <Field
                                className="hidden"
                                id="wallPaper"
                                name={'wallPaper'}
                                type={'file'}
                                value={undefined}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.currentTarget.files && e.currentTarget.files.length) {
                                        propsF.setFieldValue('wallPaper', e.currentTarget.files[0]);
                                        handleOnChange(e);
                                    }
                                }}
                                onKeyDown={(event: React.KeyboardEvent) => {
                                    handleEnterClick(event, propsF.handleSubmit)
                                }}
                            />
                        </FieldWrapper>
                        <FieldComponent
                            name={'value'}
                            type={'text'}
                            placeholder={"Tattoo style name"}
                            value={propsF.values.value}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />
                        <FieldWrapper
                            name={"description"}
                        >
                            <Field
                                name={'description'}
                                component="textarea"
                                rows={5}
                                placeholder={'Describe this Tattoo style'}
                                onChange={propsF.handleChange}
                                value={propsF.values.description}
                                onKeyDown={(event: React.KeyboardEvent) => {
                                    handleEnterClick(event, propsF.handleSubmit)
                                }}
                            />

                        </FieldWrapper>
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

UpdateStyleForm.displayName = 'UpdateStyleForm';
