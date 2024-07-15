import * as React from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {FaqType, UpdateFaqValues} from "../../types/Types";
import {FieldComponent} from "./formComponents/FieldComponent";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {useDispatch} from "react-redux";
import {
    addFaqItem,
    updateFaqItem,
} from "../../redux/Faq/faq-reducer";

const validationSchema = Yup.object().shape({
    question: Yup.string()
        .required("Faq question is a required field"),
    answer: Yup.string()
        .required("Answer is a required field"),
});

type PropsType = {
    apiError: string | null;
    faqItem?: FaqType;
    closeModal: () => void;
}
export const UpdateFaqItemForm: React.FC<PropsType> = React.memo(({
  apiError,
  faqItem,
  closeModal,
}) => {
    const initialValues = {
        question: faqItem?.question ?? '',
        answer: faqItem?.answer ?? '',
    };

    const dispatch = useDispatch();

    const submit = async (values: UpdateFaqValues, actions: FormikHelpers<UpdateFaqValues>) => {
        let success;
        if (faqItem) {
            success = await dispatch(updateFaqItem(faqItem._id, values));
        } else {
            success = await dispatch(addFaqItem(values));
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
        >
            {propsF => {
                return (
                    <Form className="form form--updateTattooStyle">
                        <FieldComponent
                            name={'question'}
                            type={'text'}
                            placeholder={"FAQ Question"}
                            value={propsF.values.question}
                            onChange={propsF.handleChange}
                        />

                        <FieldWrapper
                            name={'answer'}
                        >
                            <Field
                                name={'answer'}
                                component="textarea"
                                rows={6}
                                placeholder={"FAQ Answer"}
                                value={propsF.values.answer}
                                onChange={propsF.handleChange}
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
                )
            }}
        </Formik>
    )
});

UpdateFaqItemForm.displayName = 'UpdateFaqItemForm';
