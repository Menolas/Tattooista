import * as React from 'react'
import {Form, Formik} from 'formik'
import * as yup from 'yup'
import {FaqType} from '../../types/Types'
import {FieldComponent} from "./FieldComponent";

const validationSchema = yup.object().shape({
    question: yup.string()
        .required("Faq question is a required field"),
    answer: yup.string()
        .required("Answer is a required field"),
})

type PropsType = {
    faqItem?: FaqType
    updateFaqItem?: (id: string, values: FaqType) => void
    addFaqItem?: (values: FaqType) => void
    closeModal: () => void
}
export const UpdateFaqItemFormFormik: React.FC<PropsType> = ({
  faqItem,
  updateFaqItem,
  addFaqItem,
  closeModal,
}) => {

    const initialValues = {
        question: faqItem && faqItem.question ? faqItem.question : '',
        answer: faqItem && faqItem.answer ? faqItem.answer : '',
    }

    const submit = (values) => {
        // const formData = new FormData()
        // for (let value in values) {
        //     formData.append(value, values[value])
        // }
        if (faqItem) {
            updateFaqItem(faqItem._id, values)
        } else {
            addFaqItem(values)
        }
        closeModal()
    }

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

                        <FieldComponent
                            name={'answer'}
                            type={'text'}
                            placeholder={"FAQ Answer"}
                            value={propsF.values.answer}
                            onChange={propsF.handleChange}
                        />

                        <button
                            type="submit"
                            disabled={propsF.isSubmitting}
                            className="btn btn--bg btn--transparent form__submit-btn">
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
