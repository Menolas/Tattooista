import * as React from "react";
import { useState } from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {API_URL} from "../../http";
import {PageType, UpdateAboutPageFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import * as Yup from "yup";
import {validateFile} from "../../utils/validators";
import {useDispatch} from "react-redux";
import {editAboutPage} from "../../redux/About/about-reducer";

type PropsType = {
    apiError: null | string;
    data?: PageType;
    closeModal: () => void;
};

export const UpdateAboutPageForm: React.FC<PropsType> =  React.memo(({
    apiError,
    data,
    closeModal
}) => {
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        aboutPageTitle: Yup.string(),
        aboutPageContent: Yup.string(),
    });

    const [imageURL, setImageURL] = useState('')

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        if (typeof fileReader.result === 'string') {
            setImageURL(fileReader.result);
        } else {
            setImageURL('');
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            fileReader.readAsDataURL(file);
        }
    };

    const initialValues: UpdateAboutPageFormValues = {
        aboutPageWallPaper: data && data.wallPaper ? data.wallPaper : '',
        aboutPageTitle: data && data.title ? data.title : '',
        aboutPageContent: data && data.content ? data.content : '',
    };

    const submit = async (
        values: UpdateAboutPageFormValues,
        actions:FormikHelpers<UpdateAboutPageFormValues>
    ) => {
        if (values.aboutPageWallPaper instanceof File) {
            const isValidFile = validateFile(values.aboutPageWallPaper);
            if (!isValidFile) {
                actions.setFieldError('aboutPageWallPaper', 'Invalid file');
                return;
            } else {
                actions.setFieldError('aboutPageWallPaper', '');
            }
        }
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            const valueKey = key as keyof UpdateAboutPageFormValues;
            const value = values[valueKey];
            if (value instanceof File) {
                formData.append(valueKey, value);
            } else if (typeof value === 'string') {
                formData.append(valueKey, value);
            }
        });
        try {
            const response = await dispatch(editAboutPage(formData));
            if (!response || response.message) { // Check the response here
                throw new Error('Error submitting form');
            }
            closeModal();
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
        >
            {propsF => {
                return (
                    <Form className="form form--updateAboutForm" encType={"multipart/form-data"}>
                        <FieldWrapper name={'aboutPageWallPaper'} wrapperClass={'form__input-wrap--uploadFile'}>
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={
                                        imageURL ? imageURL
                                            : data?.wallPaper
                                            ? `${API_URL}/pageWallpapers/${data?._id}/${data.wallPaper}`
                                            : "./uploads/ServicesWallpapers/service.jpg"
                                    }
                                    alt="preview"
                                />
                                <label className="btn btn--sm btn--dark-bg" htmlFor={"aboutPageWallPaper"}>
                                    Pick File
                                </label>
                            </div>
                            <Field
                                className="hidden"
                                id="aboutPageWallPaper"
                                name={'aboutPageWallPaper'}
                                type={'file'}
                                accept='image/*,.png,.jpg,.web,.jpeg'
                                value={undefined}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                                        propsF.setFieldValue('aboutPageWallPaper', e.currentTarget.files[0]);
                                        handleOnChange(e);
                                    }
                                }}
                            />
                        </FieldWrapper>
                        <FieldComponent
                            name={'aboutPageTitle'}
                            type={'text'}
                            placeholder={"Block Title"}
                            value={propsF.values.aboutPageTitle}
                            onChange={propsF.handleChange}
                        />

                        <FieldWrapper
                            name={"aboutPageContent"}
                        >
                            <Field
                                name={'aboutPageContent'}
                                component="textarea"
                                rows={6}
                                placeholder={'Describe this Tattoo style'}
                                onChange={propsF.handleChange}
                                value={propsF.values.aboutPageContent}/>
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

UpdateAboutPageForm.displayName = 'UpdateAboutPageForm';
