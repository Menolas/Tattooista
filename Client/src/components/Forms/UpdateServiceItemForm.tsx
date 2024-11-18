import * as React from "react";
import {useState} from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {API_URL} from "../../http";
import {ServiceType, UpdateServiceFormValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {
    validateFile
} from "../../utils/validators";
import {useDispatch, useSelector} from "react-redux";
import {
    addService,
    editService,
} from "../../redux/Services/services-reducer";
import {handleEnterClick} from "../../utils/functions";
import {getTokenSelector} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Name is a required field"),
    condition_0: Yup.string(),
    condition_1: Yup.string(),
    condition_2: Yup.string(),
    condition_3: Yup.string(),
    condition_4: Yup.string(),
    condition_5: Yup.string(),
});

type PropsType = {
    apiError: null | string;
    service?: ServiceType;
    closeModal: () => void;
};
export const UpdateServiceItemForm: React.FC<PropsType> = React.memo(({
    apiError,
    service,
    closeModal,
}) => {
    const token = useSelector(getTokenSelector);
    const [imageURL, setImageURL] = useState('');

    const dispatch = useDispatch<AppDispatch>();

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

    const initialValues: UpdateServiceFormValues = {
        wallPaper: service?.wallPaper ?? '',
        title: service?.title ?? '',
        condition_0: service?.conditions[0] ?? '',
        condition_1: service?.conditions[1] ?? '',
        condition_2: service?.conditions[2] ?? '',
        condition_3: service?.conditions[3] ?? '',
        condition_4: service?.conditions[4] ?? '',
        condition_5: service?.conditions[5] ?? '',
    };

    const submit = async (values: UpdateServiceFormValues, actions: FormikHelpers<UpdateServiceFormValues>) => {
        // Check if picture is a File object
        if (values.wallPaper instanceof File) {
            const isValidFile = validateFile(values.wallPaper);
            if (!isValidFile) {
                actions.setFieldError('wallPaper', 'Invalid file');
                return;
            } else {
                actions.setFieldValue('wallpaper', '');
            }
        }
        const formData = new FormData();
        for (const key in values) {
            const value = values[key];
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined) { // Check if value is not undefined
                formData.append(key, value.toString());
            } else {
                formData.append(key, '');
            }
        }
        let success;
        try {
            if (service) {
                success = await dispatch(editService(token, service._id, formData));
            } else {
                success = await dispatch(addService(token, formData));
            }
            if (success) {
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
        >
            {propsF => {

                return (
                    <Form className="form form--updateService" encType={"multipart/form-data"}>
                        <FieldWrapper name={'wallPaper'} wrapperClass={'form__input-wrap--uploadFile'}>
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={
                                        imageURL ? imageURL
                                            : service?.wallPaper
                                            ? `${API_URL}/serviceWallpapers/${service._id}/${service.wallPaper}`
                                            : "./uploads/ServicesWallpapers/service.jpg"
                                    }
                                    alt="preview"
                                />
                                <label className="btn btn--sm btn--dark-bg" htmlFor={"wallPaper"}>
                                    Pick File
                                </label>
                            </div>
                            <Field
                                className="hidden"
                                id="wallPaper"
                                name={'wallPaper'}
                                type={'file'}
                                accept='image/*,.png,.jpg,.web,.jpeg'
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
                            name={'title'}
                            type={'text'}
                            placeholder={"Service Title"}
                            value={propsF.values.title}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />

                        <FieldComponent
                            name={'condition_0'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_0}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />

                        <FieldComponent
                            name={'condition_1'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_1}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />

                        <FieldComponent
                            name={'condition_2'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_2}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />

                        <FieldComponent
                            name={'condition_3'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_3}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />

                        <FieldComponent
                            name={'condition_4'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_4}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
                        />

                        <FieldComponent
                            name={'condition_5'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_5}
                            onChange={propsF.handleChange}
                            onKeyDown={(event: React.KeyboardEvent) => {
                                handleEnterClick(event, propsF.handleSubmit)
                            }}
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

UpdateServiceItemForm.displayName = 'UpdateServiceItemForm';
