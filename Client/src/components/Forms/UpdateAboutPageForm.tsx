import * as React from "react";
import { useState } from "react";
import { Field, Form, Formik} from "formik";
import {API_URL} from "../../http";
import {PageType} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import {FieldWrapper} from "./FieldWrapper";
import * as Yup from "yup";
import {validateFile} from "../../utils/validators";

type PropsType = {
    data?: PageType;
    edit: (values: FormData) => void;
    closeModal: () => void;
};

export const UpdateAboutPageForm: React.FC<PropsType> =  React.memo(({
    data,
    edit,
    closeModal
}) => {

    const validationSchema = Yup.object().shape({
        aboutPageTitle: Yup.string(),
        aboutPageContent: Yup.string(),
    });

    const [imageURL, setImageURL] = useState('')

    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result)
    }

    const handleOnChange = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            fileReader.readAsDataURL(file);
        }
    }

    const initialValues = {
        aboutPageWallPaper: data && data.wallPaper ? data.wallPaper : '',
        aboutPageTitle: data && data.title ? data.title : '',
        aboutPageContent: data && data.content ? data.content : '',
    }

    const submit = async (values, actions) => {
        // Check if aboutPageWallPaper is a File object
        if (values.aboutPageWallPaper instanceof File) {
            const isValidFile = validateFile(values.aboutPageWallPaper);
            if (!isValidFile) {
                actions.setFieldError('aboutPageWallPaper', 'Invalid file');
                return;
            } else {
                // Clear any existing field error
                actions.setFieldError('aboutPageWallPaper', '');
            }
        }

        const formData = new FormData();

        for (let value in values) {
            formData.append(value, values[value]);
        }

        try {
            await edit(formData);
            closeModal();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

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
                                onChange={(e) => {
                                    propsF.setFieldValue('aboutPageWallPaper', e.currentTarget.files[0])
                                    handleOnChange(e)
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
