import * as React from 'react'
import { useState } from 'react'
import { Field, Form, Formik} from 'formik'
import * as Yup from "yup";
// @ts-ignore
import tattooMachine from '../../assets/img/tattoo-machine.webp'
import {FieldWrapper} from "./FieldWrapper";

type PropsType = {
  activeStyle: string
  updateGallery: (values: any) => void
  closeModal: () => void
}

const validationSchema = Yup.object().shape({
  gallery: Yup.array()
      .max(5, 'You can upload up to 5 files') // Adjust the maximum number of files as needed
      .of(
          Yup.mixed()
              .test('fileSize', 'Max allowed size is 2MB', (value: File) => {
                if (!value) return true; // If no file is provided, it's considered valid
                return value.size <= 1024 * 1024; // Adjust the file size limit as needed (2MB in this example)
              })
              .test('fileType', 'Invalid file type', (value: File) => {
                if (!value) return true; // If no file is provided, it's considered valid
                return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Adjust the allowed file types
              })
      ),
});

export const AdminGalleryUploadFormFormik: React.FC<PropsType> = React.memo(({
  updateGallery,
  closeModal
}) => {

  const [imageURLS, setImageURLS] = useState([])

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files && event.target.files.length) {
      setImageURLS([])
      // @ts-ignore
      let files = [...event.target.files] || []
      files.forEach((item, index) => {
        let reader = new FileReader()
        reader.onloadend = () => {
          setImageURLS(_=>[..._,reader.result]); // <-
        }
        reader.readAsDataURL(item)
      })
    }
  }

  const submit = (values: any) => {
    const formData = new FormData()
    values['gallery'].forEach((file: File) => formData.append(file.name, file))
    formData.append('gallery', values['gallery'])
    updateGallery(formData)
    closeModal()
  }

  const initialValues = {
    gallery: []
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnSubmit={true}
      onSubmit={submit}
    >
      {propsF => {
        return (
          <Form className="form form--galleryUpload" encType={"multipart/form-data"}>
            { imageURLS &&
                <ul className={"list gallery__uploadedImgPreviews"}>
                  {
                    imageURLS?.map((item, index) => {
                      return (
                          <li className={"gallery__uploadedImgPreviews-item"} key={index}>
                            <img
                                src={item}
                                alt="preview"
                                height="50"
                            />
                          </li>
                      )
                    })
                  }
                </ul>
            }

            <FieldWrapper
                name={'gallery'}
                wrapperClass={''}
            >
              <label className="btn btn--sm" htmlFor={"gallery"}>Pick File</label>
              <Field
                  className="hidden"
                  id="gallery"
                  name={'gallery'}
                  type={'file'}
                  accept="image/*,.png,.jpg,.web,.jpeg,.webp"
                  value={undefined}
                  multiple
                  onChange={(e) => {
                    propsF.setFieldValue('gallery', Array.from(e.currentTarget.files))
                    handleOnChange(e)
                  }}
              />
            </FieldWrapper>
            <button
              type="submit"
              disabled={propsF.isSubmitting}
              className="btn btn--bg btn--transparent form__submit-btn"
            >
              {propsF.isSubmitting
                ? 'Please wait...'
                : 'Upload Gallery'
              }
            </button>
          </Form>
        )
      }}
    </Formik>
  )
})
