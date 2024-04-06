import * as React from "react";
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {API_URL} from "../../http";
// @ts-ignore
import tattooMachine from "../../assets/img/tattoo-machine.webp";
import {TattooStyleType} from "../../types/Types";
import {FieldComponent} from "./FieldComponent";
import {FieldWrapper} from "./FieldWrapper";
import {isFileSizeValid, isFileTypesValid, MAX_FILE_SIZE, VALID_FILE_EXTENSIONS} from "../../utils/validators";

const validationSchema = Yup.object().shape({
    wallPaper: Yup.mixed()
        .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
            if (!value) return true
            return isFileSizeValid([value], MAX_FILE_SIZE)
        })
        .test('fileType', "Invalid file type", (value: File) => {
            if (!value) return true
            return isFileTypesValid([value], VALID_FILE_EXTENSIONS)
        }),
    value: Yup.string()
        .matches(/^([^0-9]*)$/, "Name should not contain numbers")
        .required("Name is a required field"),
    description: Yup.string()
        .required("Description is a required field")
})

type PropsType = {
    style?: TattooStyleType
    addTattooStyle?: (values: FormData) => void
    editTattooStyle?: (id: string, values: FormData) => void
    closeModal: () => void
}
export const UpdateTattooStyleFormFormik: React.FC<PropsType> = ({
    style,
    addTattooStyle,
    editTattooStyle,
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
        wallPaper: style && style.wallPaper ? style.wallPaper : '',
        value: style && style.value ? style.value : '',
        description: style && style.description ? style.description : ''
    }

    const submit = (values) => {
        const formData = new FormData();
        for (let value in values) {
            formData.append(value, values[value]);
        }
        if (style) {
            editTattooStyle(style._id, formData);
        } else {
            addTattooStyle(formData);
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
                                    src={imageURL ? imageURL
                                            : style && style.wallPaper
                                            ? `${API_URL}/styleWallpapers/${style._id}/${style.wallPaper}`
                                            : tattooMachine
                                    }
                                    alt="preview"
                                />
                            </div>
                            <label className="btn btn--sm btn--dark-bg" htmlFor={"wallPaper"}>Pick File</label>
                            <FieldWrapper name={'wallPaper'} wrapperClass={'form__input-wrap--uploadFile'}>
                                <Field
                                    className="hidden"
                                    id="wallPaper"
                                    name={'wallPaper'}
                                    type={'file'}
                                    value={undefined}
                                    onChange={(e) => {
                                        propsF.setFieldValue('wallPaper', e.currentTarget.files[0]);
                                        handleOnChange(e);
                                    }}
                                />
                            </FieldWrapper>
                        </div>
                        <FieldComponent
                            name={'value'}
                            type={'text'}
                            placeholder={"Tattoo style name"}
                            value={propsF.values.value}
                            onChange={propsF.handleChange}
                        />
                        <FieldWrapper
                            name={"description"}
                        >
                            <Field
                                name={'description'}
                                component="textarea"
                                rows={5}
                                placeholder={'Describe this Tattoo style'}
                                onChange={propsF.handleChange}
                                value={propsF.values.description}/>

                        </FieldWrapper>
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
