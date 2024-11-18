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
import {useDispatch, useSelector} from "react-redux";
import {editAboutPage} from "../../redux/About/about-reducer";
import {handleEnterClick} from "../../utils/functions";
import {getTokenSelector} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";

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
    const token = useSelector(getTokenSelector);
    const dispatch = useDispatch<AppDispatch>();

    const validationSchema = Yup.object().shape({
        aboutPageTitle: Yup.string()
            .min(2, 'Title is too short - should be 2 chars minimum.')
            .required("Page title is a required field"),
        aboutPageContent: Yup.string()
            .min(20, 'content is too short - should be 20 chars minimum.')
            .required("Page content is a required field"),
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
                actions.setFieldError(
                    'aboutPageWallPaper',
                    'Invalid file: max allowed size is 1024kb and allowed types are: jpg, jpeg, png, web, gif.');
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
            const response = await dispatch(editAboutPage(token, formData));
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
                                onKeyDown={(event: React.KeyboardEvent) => {
                                    handleEnterClick(event, propsF.handleSubmit)
                                }}
                            />
                        </FieldWrapper>
                        <FieldComponent
                            name={'aboutPageTitle'}
                            type={'text'}
                            placeholder={"Block Title"}
                            value={propsF.values.aboutPageTitle}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
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
                                value={propsF.values.aboutPageContent}
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

UpdateAboutPageForm.displayName = 'UpdateAboutPageForm';
