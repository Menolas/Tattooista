import * as React from "react";
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {API_URL} from "../../http";
import {ServiceType} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import {FieldWrapper} from "./FieldWrapper";
import {
    validateFile
} from "../../utils/validators";

const validationSchema = Yup.object().shape({
    // wallPaper: Yup.mixed()
    //     .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
    //         if (!value) return true
    //         return isFileSizeValid([value], MAX_FILE_SIZE)
    //     })
    //     .test('fileType', 'Invalid file type', (value: File) => {
    //         if (!value) return true
    //         return isFileTypesValid([value], VALID_FILE_EXTENSIONS)
    //     }),
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
    service?: ServiceType
    editService?: (id: string, values: FormData) => void
    addService?: (values: FormData) => void
    setService?: (service: ServiceType | null) => void
    closeModal: () => void
}
export const UpdateServiceItemFormFormik: React.FC<PropsType> = ({
    service,
    editService,
    addService,
    setService,
    closeModal,
}) => {

    const [imageURL, setImageURL] = useState('');

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result);
    }

    const handleOnChange = (event) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            fileReader.readAsDataURL(file);
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

    const submit = async (values, actions) => {
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
        for (let value in values) {
            formData.append(value, values[value]);
        }
        try {
            if (service) {
                editService(service._id, formData);
                setService(null);
            } else {
                addService(formData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        closeModal();
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
                                            : service?.wallPaper
                                            ? `${API_URL}/serviceWallpapers/${service._id}/${service.wallPaper}`
                                            : "./uploads/ServicesWallpapers/service.jpg"
                                    }
                                    alt="preview"
                                />
                            </div>
                            <label className="btn btn--sm btn--dark-bg" htmlFor={"wallPaper"}>Pick File</label>
                            <FieldWrapper name={'wallPaper'}>
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
                            </FieldWrapper>
                        </div>

                        <FieldComponent
                            name={'title'}
                            type={'text'}
                            placeholder={"Service Title"}
                            value={propsF.values.title}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_0'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_0}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_1'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_1}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_2'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_2}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_3'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_3}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_4'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_4}
                            onChange={propsF.handleChange}
                        />

                        <FieldComponent
                            name={'condition_5'}
                            type={'text'}
                            placeholder={"Service condition"}
                            value={propsF.values.condition_5}
                            onChange={propsF.handleChange}
                        />

                        <button
                            type="submit"
                            disabled={propsF.isSubmitting}
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
