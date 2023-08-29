import * as React from 'react'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import * as yup from 'yup'
import {ErrorMessageWrapper} from '../../utils/validators'
import {SERVER_URL} from '../../utils/constants'
import tattooMachine from '../../assets/img/tattoo-machine.webp'
import {PageType} from '../../types/Types'

const validationSchema = yup.object().shape({
    title: yup.string(),
    content: yup.string(),
})

type PropsType = {
    pageAbout?: PageType
    editAboutPage: (id: string, values: FormData) => void
    closeModal: () => void
    showSuccessModal: () => void
}
export const UpdateAboutPageFormFormik: React.FC<PropsType> =  React.memo(({
    pageAbout,
    editAboutPage,
    closeModal,
    showSuccessModal
}) => {

    const [imageURL, setImageURL] = useState('')

    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        setImageURL(fileReader.result)
    }

    const handleOnChange = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            fileReader.readAsDataURL(file)
        }
    }

    const initialValues = {
        wallPaper: pageAbout && pageAbout.wallPaper ? pageAbout.wallPaper : '',
        title: pageAbout && pageAbout.title ? pageAbout.title : '',
        content: pageAbout && pageAbout.content ? pageAbout.content : '',
    }

    const submit = (values) => {
        const formData = new FormData()
        for (let value in values) {
            formData.append(value, values[value])
        }
        editAboutPage(pageAbout._id, formData)
        closeModal()
        showSuccessModal()
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
                        <div className="form__input-wrap form__input-wrap--uploadFile">
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={
                                        imageURL ? imageURL
                                            : pageAbout?.wallPaper
                                            ? `${SERVER_URL}/pageWallpapers/${pageAbout?._id}/${pageAbout.wallPaper}`
                                            : tattooMachine
                                    }
                                    alt="preview"
                                />
                            </div>
                            <label className="btn btn--sm" htmlFor={"wallPaper"}>Pick File</label>
                            <Field
                                className="hidden"
                                id="wallPaper"
                                name={'wallPaper'}
                                type={'file'}
                                accept='image/*,.png,.jpg,.web,.jpeg'
                                value={undefined}
                                onChange={(e) => {
                                    propsF.setFieldValue('wallPaper', e.currentTarget.files[0])
                                    handleOnChange(e)
                                }}
                            />
                        </div>
                        <div className="form__input-wrap">
                            <Field name={'title'} type={'text'} placeholder={'Block Title'}
                                   onChange={propsF.handleChange}
                                   value={propsF.values.title}/>
                            <ErrorMessage name='title'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'content'}
                                component="textarea"
                                rows={6}
                                placeholder={'Describe this Tattoo style'}
                                onChange={propsF.handleChange}
                                value={propsF.values.content}/>
                            <ErrorMessage name='content'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
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
})
