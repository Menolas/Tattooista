import * as React from 'react'
import { useState } from "react";
import {Form, Formik} from 'formik'
//import {ErrorMessageWrapper} from '../../utils/validators'
// @ts-ignore
import tattooMachine from '../../assets/img/tattoo-machine.webp'

type PropsType = {
  activeStyle: string
  updateGallery: (values: any) => void
  closeModal: () => void
}

export const AdminGalleryUploadFormFormik: React.FC<PropsType> = React.memo(({
  updateGallery,
  closeModal
}) => {

  const [imageURL, setImageURL] = useState()
  const fileReader = new FileReader()
  fileReader.onloadend = () => {
    // @ts-ignore
    setImageURL(fileReader.result)
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
      onSubmit={submit}
    >
      {propsF => {
        return (
          <Form className="form" encType={"multipart/form-data"}>
            <div className="form__input-wrap">
              <img
                className="client-profile__gallery-image"
                src={imageURL ? imageURL : tattooMachine}
                alt="preview"
                height="50"
              />
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
                  }
                }}
              />
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
