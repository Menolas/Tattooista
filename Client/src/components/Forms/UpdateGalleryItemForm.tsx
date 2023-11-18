import * as React from 'react'
import { Form, Formik, FormikHelpers, FormikValues, useField } from 'formik'
import { GalleryItemType, TattooStyleType} from "../../types/Types"
import {FormSelect} from "./FormSelect"
import {FieldWrapper} from "./FieldWrapper"
import {SERVER_URL} from "../../utils/constants"

type PropsType = {
    galleryItem: GalleryItemType
    styles: Array<TattooStyleType>
    updateGalleryItem: (values: GalleryItemType) => void
    closeModal?: () => void
}

export const UpdateGalleryItemForm: React.FC<PropsType> = ({
    galleryItem,
    styles,
    updateGalleryItem,
    closeModal
}) => {

    const options = styles.map(style => style.value)

    const handleChange = (input: string) => {
        console.log(options)
    }

    const submit = (values: any) => {
        console.log(options)
    }

    const initialValues = {
        styles: []
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
        >
            {(propsF) => {
                let {isSubmitting} = propsF

                return (
                    <Form
                        id={"updateGalleryItem"}
                        className={"form"}
                        >
                        <div
                            style={{ backgroundImage: `url(${SERVER_URL}gallery/${galleryItem.fileName})` }}
                        >

                        </div>
                        <FieldWrapper
                            wrapperClass={''}
                            name={'styles'}
                        >
                            <FormSelect
                                name={'styles'}
                                options={options}
                                handleChange={handleChange}
                                placeholder={'Choose tattoo styles for this image'}
                            />

                        </FieldWrapper>
                    </Form>
                )

            }}
        </Formik>
    )

}
