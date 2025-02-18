import * as React from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {ReviewType, UpdateReviewFormValues,} from "../../types/Types";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {useDispatch, useSelector} from "react-redux";
//import {addReview, editReview,} from "../../redux/Services/services-reducer";
import {handleEnterClick} from "../../utils/functions";
import {getTokenSelector} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";

const validationSchema = Yup.object().shape({
    rate: Yup.number()
        .required("Please rate your experience"),
    content: Yup.string()
        .required("Please shortly describe your experience"),
});

type PropsType = {
    apiError: null | string;
    review?: ReviewType;
    closeModal: () => void;
};
export const UpdateReviewForm: React.FC<PropsType> = React.memo(({
    apiError,
    review,
    closeModal,
}) => {
    const token = useSelector(getTokenSelector);

    const dispatch = useDispatch<AppDispatch>();

    const initialValues: UpdateReviewFormValues = {
        rate: review?.rate ?? 0,
        content: review?.content ?? '',
    };

    const submit = async (values: UpdateReviewFormValues, actions: FormikHelpers<UpdateReviewFormValues>) => {

        let success;

        try {
            if (review) {
                //success = await dispatch(editService(token, review._id, values));
            } else {
                //success = await dispatch(addService(token, values));
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

                        {/*<FieldComponent*/}
                        {/*    name={'title'}*/}
                        {/*    type={'text'}*/}
                        {/*    placeholder={"Service Title"}*/}
                        {/*    value={propsF.values.title}*/}
                        {/*    onChange={propsF.handleChange}*/}
                        {/*    onKeyDown={(event: React.KeyboardEvent) => {*/}
                        {/*        handleEnterClick(event, propsF.handleSubmit)*/}
                        {/*    }}*/}
                        {/*/>*/}

                        <FieldWrapper
                            name={'answer'}
                        >
                            <Field
                                name={'answer'}
                                component="textarea"
                                rows={6}
                                placeholder={"FAQ Answer"}
                                value={propsF.values.content}
                                onChange={propsF.handleChange}
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

UpdateReviewForm.displayName = 'UpdateServiceItemForm';
