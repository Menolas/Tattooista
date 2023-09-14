import * as React from 'react'
import {useState} from 'react'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import * as yup from 'yup'
import {ErrorMessageWrapper} from '../../utils/validators'
import {SERVER_URL} from '../../utils/constants'
// @ts-ignore
import tattooMachine from '../../assets/img/tattoo-machine.webp'
import {ServiceType} from '../../types/Types'

const validationSchema = yup.object().shape({
    title: yup.string()
        .required("Name is a required field"),
    description: yup.string(),
})

type PropsType = {
    service?: ServiceType
    editService?: (id: string, values: FormData) => void
    addService?: (values: FormData) => void
    closeModal: () => void
}
export const UpdateServiceItemFormFormik: React.FC<PropsType> = ({
    service,
    editService,
    addService,
    closeModal,
}) => {

    const [imageURL, setImageURL] = useState('')

    const fileReader = new FileReader()
    fileReader.onloadend = () => {
        // @ts-ignore
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
        wallPaper: service && service.wallPaper ? service.wallPaper : '',
        title: service && service.title ? service.title : '',
        condition_0: service && service.conditions ? service.conditions[0] : '',
        condition_1: service && service.conditions ? service.conditions[1] : '',
        condition_2: service && service.conditions ? service.conditions[2] : '',
        condition_3: service && service.conditions ? service.conditions[3] : '',
        condition_4: service && service.conditions ? service.conditions[4] : '',
        condition_5: service && service.conditions ? service.conditions[5] : '',
    }

    const submit = (values) => {
        const formData = new FormData()
        for (let value in values) {
            formData.append(value, values[value])
        }
        if (service) {
            editService(service._id, formData)
        } else {
            addService(formData)
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
                    <Form className="form form--updateTattooStyle" encType={"multipart/form-data"}>
                        <div className="form__input-wrap form__input-wrap--uploadFile">
                            <div className={"form__input-wrap--uploadFile-img"}>
                                <img
                                    src={
                                        imageURL ? imageURL
                                            : service && service.wallPaper
                                            ? `${SERVER_URL}/serviceWallpapers/${service._id}/${service.wallPaper}`
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
                            <Field name={'title'} type={'text'} placeholder={'Service Title'}
                                   onChange={propsF.handleChange}
                                   value={propsF.values.title}/>
                            <ErrorMessage name='title'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'condition_0'}
                                type={'text'}
                                onChange={propsF.handleChange}
                                value={propsF.values.condition_0}/>
                            <ErrorMessage name='condition_0'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'condition_1'}
                                type={'text'}
                                onChange={propsF.handleChange}
                                value={propsF.values.condition_1}/>
                            <ErrorMessage name='condition_1'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'condition_2'}
                                type={'text'}
                                onChange={propsF.handleChange}
                                value={propsF.values.condition_2}/>
                            <ErrorMessage name='condition_2'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'condition_3'}
                                type={'text'}
                                onChange={propsF.handleChange}
                                value={propsF.values.condition_3}/>
                            <ErrorMessage name='condition_3'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'condition_4'}
                                type={'text'}
                                onChange={propsF.handleChange}
                                value={propsF.values.condition_4}/>
                            <ErrorMessage name='condition_4'>
                                {ErrorMessageWrapper}
                            </ErrorMessage>
                        </div>
                        <div className="form__input-wrap">
                            <Field
                                name={'condition_5'}
                                type={'text'}
                                onChange={propsF.handleChange}
                                value={propsF.values.condition_5}/>
                            <ErrorMessage name='condition_5'>
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
}
