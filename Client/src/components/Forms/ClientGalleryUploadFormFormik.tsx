import * as React from 'react'
import { useState } from 'react'
import {Field, Form, Formik} from 'formik'
// @ts-ignore
import tattooMachine from '../../assets/img/tattoo-machine.webp'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import { SERVER_URL } from '../../utils/constants'
import {FieldWrapper} from './FieldWrapper'
import * as Yup from 'yup'

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
})

type PropsType = {
  profileId: string
  gallery?: Array<string>
  closeModal: () => void
  updateClientGallery: (clientId: string, values: any) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
}

export const ClientGalleryUploadFormFormik: React.FC<PropsType> = React.memo(({
  profileId,
  gallery,
  updateClientGallery,
  deleteClientGalleryPicture,
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

  const submit = (values) => {
    const formData = new FormData()
    values['gallery'].forEach((file: File) => formData.append(file.name, file))
    formData.append('gallery', values['gallery'])
    updateClientGallery(profileId, formData)
    closeModal()
  }

  const initialValues = {
    gallery: []
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submit}
    >
      {propsF => {
        return (
          <Form className="form form--galleryUpload" encType={"multipart/form-data"}>
            {
              gallery &&
                <ul className={"list client-gallery"}>
                  {
                    gallery?.map((item,i) => {
                      return (
                          <li className={"client-gallery__item"} key={i}>
                            <button
                                className={"btn btn--icon btn--icon--light"}
                                //disabled={isDeletingPicturesInProcess?.some(id => id === item)}
                                onClick={(event) => {
                                  event.preventDefault()
                                  deleteClientGalleryPicture(profileId, item)
                                }}
                            >
                              <svg><use href={`${Sprite}#trash`}/></svg>
                            </button>
                            <img src={`${SERVER_URL}/clients/${profileId}/doneTattooGallery/${item}`} alt={''}/>
                          </li>
                      )
                    })
                  }
                </ul>
            }

            {
              imageURLS &&
                <ul className={"list client-gallery"}>
                  {
                    imageURLS?.map((item, index) => {
                      return (
                          <li className={"client-gallery__item"} key={index}>
                            <img
                                className="client-profile__gallery-image"
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
