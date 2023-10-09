import * as React from 'react'
import { useState } from 'react'
import {ErrorMessage, Form, Formik, FormikHelpers, FormikValues} from 'formik'
import * as yup from "yup";
import {ErrorMessageWrapper} from '../../utils/validators'
// @ts-ignore
import tattooMachine from '../../assets/img/tattoo-machine.webp'

type PropsType = {
  activeStyle: string
  updateGallery: (values: any) => void
  closeModal: () => void
}

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png"
];

const validationSchema = yup.object().shape({
  gallery: yup
      .mixed()
      .required("Pick some files")
      // .test(
      //     "fileSize",
      //     "File too large",
      //     value => value && value.size <= FILE_SIZE
      // )
      // .test(
      //     "fileFormat",
      //     "Unsupported Format",
      //     value => value && SUPPORTED_FORMATS.includes(value.type)
      // )
});

export const AdminGalleryUploadFormFormik: React.FC<PropsType> = React.memo(({
  updateGallery,
  closeModal
}) => {

  const [imageURLS, setImageURLS] = useState([])

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files && event.target.files.length) {
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

  const initialValues: any = {
    gallery: null
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
            <div className="form__input-wrap">
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
              <label className="btn btn--sm" htmlFor={"gallery"}>Pick File</label>
              <input
                className="hidden"
                id="gallery"
                name={'gallery'}
                type={'file'}
                accept="image/*,.png,.jpg,.web,.jpeg,.webp"
                value={undefined}
                multiple
                onChange={(e) => {
                  if (e.currentTarget.files) {
                    propsF.setFieldValue('gallery', Array.from(e.currentTarget.files))
                    handleOnChange(e)
                  }
                }}
              />
              <ErrorMessage name='gallery'>
                {ErrorMessageWrapper}
              </ErrorMessage>
            </div>
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
