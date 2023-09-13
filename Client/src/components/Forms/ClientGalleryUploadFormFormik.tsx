import * as React from 'react'
import { useState } from 'react'
import {Form, Formik} from 'formik'
//import {ErrorMessageWrapper} from '../../utils/validators'
// @ts-ignore
import tattooMachine from '../../assets/img/tattoo-machine.webp'
import { SERVER_URL } from '../../utils/constants'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'

type PropsType = {
  profileId: string
  gallery?: Array<string>
  isDeletingInProcess: Array<string>
  closeModal: () => void
  updateClientGallery: (clientId: string, values: any) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
}

export const ClientGalleryUploadFormFormik: React.FC<PropsType> = React.memo(({
profileId,
gallery,
isDeletingInProcess,
updateClientGallery,
deleteClientGalleryPicture,
closeModal
}) => {

  console.log(isDeletingInProcess + "isDeletingInProcess!!!!!!!!")

  const [imageURLS, setImageURLS] = useState([])

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files && event.target.files.length) {
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
    values['gallery'].forEach((file) => formData.append(file.name, file))
    formData.append('gallery', values['gallery'])
    updateClientGallery(profileId, formData)
    closeModal()
  }

  const initialValues = {
    gallery: null
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submit}
    >
      {propsF => {
        return (
          <Form className="form form--galleryUpload" encType={"multipart/form-data"}>
            <ul className={"list client-gallery"}>
              {
                gallery?.map((item,i) => {
                  return (
                      <li className={"client-gallery__item"} key={i}>
                        <button
                            className={"btn btn--icon btn--icon--light"}
                            disabled={isDeletingInProcess?.some(id => id === item)}
                            onClick={(event) => {
                              console.log(isDeletingInProcess + "isDeletingInProcess!!!!!!!!")
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
            <div className="form__input-wrap">
              <ul className={"list client-gallery"}>
                { imageURLS?.length === 0 &&
                  <li className={"client-gallery__item"}>
                    <img
                        className="client-profile__gallery-image"
                        src={tattooMachine}
                        alt="preview"
                        height="50"
                    />
                  </li>
                }
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
                  propsF.setFieldValue('gallery', Array.from(e.currentTarget.files))
                  handleOnChange(e)
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
