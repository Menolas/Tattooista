import * as React from "react";
import {useEffect, useState} from "react";
import {Field, Form, Formik, FormikHelpers, FormikValues} from "formik";
import * as Yup from "yup";
import {API_URL} from "../../http";
// @ts-ignore
import tattooMachine from "../../assets/img/tattoo-machine.webp";
import {StyleType} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {
    isFileSizeValid, isFileTypesValid,
    MAX_FILE_SIZE, VALID_FILE_EXTENSIONS,
} from "../../utils/validators";
import {useDispatch} from "react-redux";
import {addStyle, editStyle} from "../../redux/Styles/styles-reducer";

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
}

type PropsType = {
    apiError: null | string;
    isEditing: boolean;
    style?: StyleType;
    closeModal: () => void;
}
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

    useEffect(() => {
        if (isEditing) {
            // Set initial values based on style
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

    const [initialValues, setInitialValues] = useState({
        wallPaper: '',
        value: '',
        description: ''
    });

    const submit = async (values, actions: FormikHelpers<FormikValues>) => {
       const formData = new FormData();
       for (let value in values) {
           formData.append(value, values[value]);
       }
       try {
           let success;
           if(isEditing) {
               success = await dispatch(editStyle(style._id, formData));
           } else {
               success = await dispatch(addStyle(formData));
           }
           if (success ) { // Check the response here
               closeModal();
           }
       } catch (error) {
           console.error('Error submitting form:', error);
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
                    <Form className="form form--updateTattooStyle" encType={"multipart/form-data"}>
                        <FieldWrapper name={'wallPaper'} wrapperClass={'form__input-wrap--uploadFile'}>
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={imageURL ? imageURL
                                            : isEditing && style.wallPaper
                                            ? `${API_URL}/styleWallpapers/${style._id}/${style.wallPaper}`
                                            : tattooMachine
                                    }
                                    alt="preview"
                                />
                                <label className="btn btn--sm btn--dark-bg" htmlFor={"wallPaper"}>Pick File</label>
                            </div>
                            <Field
                                className="hidden"
                                id="wallPaper"
                                name={'wallPaper'}
                                type={'file'}
                                value={undefined}
                                onChange={(e) => {
                                    propsF.setFieldValue('wallPaper', e.currentTarget.files[0]);
                                    handleOnChange(e);
                                }}
                            />
                        </FieldWrapper>
                        <FieldComponent
                            name={'value'}
                            type={'text'}
                            placeholder={"Tattoo style name"}
                            value={propsF.values.value}
                            onChange={propsF.handleChange}
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
                                value={propsF.values.description}/>

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
                )
            }}
        </Formik>
    )
});
