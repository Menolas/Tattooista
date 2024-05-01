import * as React from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {FaqType} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import {FieldWrapper} from "./FieldWrapper";

const validationSchema = Yup.object().shape({
    question: Yup.string()
        .required("Faq question is a required field"),
    answer: Yup.string()
        .required("Answer is a required field"),
});

type PropsType = {
    faqItem?: FaqType
    edit?: (id: string, values: FaqType) => void
    add?: (values: FaqType) => void
    closeModal: () => void
}
export const UpdateFaqItemFormFormik: React.FC<PropsType> = ({
  faqItem,
  edit,
  add,
  closeModal,
}) => {
    const initialValues = {
        question: faqItem?.question ?? '',
        answer: faqItem?.answer ?? '',
    };

    const submit = (values) => {
        if (faqItem) {
            edit(faqItem._id, values);
        } else {
            add(values);
        }
        closeModal();
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
}
