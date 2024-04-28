import * as React from "react";
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import {MAX_FILE_SIZE, VALID_FILE_EXTENSIONS, isFileSizeValid, isFileTypesValid } from "../../utils/validators";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {API_URL} from "../../http";
import {FieldWrapper} from "./FieldWrapper";
import * as Yup from "yup";
import {ClientType} from "../../types/Types";

const filesUploadingValidationSchema = Yup.object().shape({
  gallery: Yup.array()
      .max(5, "You can upload up to 5 files")
      .of(
          Yup.mixed()
              .test('fileSize', "Max allowed size is 2MB ", (value: File) => {
                if (!value) return true
                return isFileSizeValid([value], MAX_FILE_SIZE)
              })
              .test('fileType', "Invalid file type", (value: File) => {
                if (!value) return true
                return isFileTypesValid([value], VALID_FILE_EXTENSIONS)
              })
      ),
});

type PropsType = {
  isEditPortfolio: boolean;
  client?: ClientType;
  isDeletingPicturesInProcess?: Array<string>;
  closeModal: () => void;
  updatePortfolio?: (values: FormData) => void;
  updateGallery?: (clientId: string, values: FormData) => void;
  deleteClientGalleryPicture?: (clientId: string, picture: string) => void;
}

export const GalleryUploadForm: React.FC<PropsType> = ({
  isEditPortfolio,
  client,
  isDeletingPicturesInProcess,
  updatePortfolio,
  updateGallery,
  deleteClientGalleryPicture,
  closeModal
}) => {

  const [imageURLS, setImageURLS] = useState([]);
  //const [clientGallery, setClientGallery] = useState(null);

  // useEffect(() => {
  //   if (client)
  //   setClientGallery(client?.gallery);
  // }, [client]);

  const handleOnFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>, setImageURLS) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      setImageURLS([]);
      // @ts-ignore
      let files = [...event.target.files] || [];
      files.forEach((item, index) => {
        let reader = new FileReader();
        reader.onloadend = () => {
          setImageURLS(_=>[..._,reader.result]);
        }
        reader.readAsDataURL(item);
      });
    }
  }

  const submit = (values) => {
    const formData = new FormData();
    values['gallery'].forEach((file: File) => formData.append(file.name, file));
    formData.append('gallery', values['gallery']);
    if (isEditPortfolio) updatePortfolio(formData);
    if (!isEditPortfolio) updateGallery(client._id, formData);
    closeModal();
  }

  const initialValues = {
    gallery: []
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={filesUploadingValidationSchema}
      onSubmit={submit}
    >
      {propsF => {
        return (
          <Form className="form form--galleryUpload" encType={"multipart/form-data"}>
            {
                client?.gallery &&
                <ul className={"list client-gallery"}>
                  {
                    client.gallery.map((item,i) => {
                      return (
                          <li className={"client-gallery__item"} key={i}>
                            <button
                                className={"btn btn--icon btn--icon--light"}
                                disabled={isDeletingPicturesInProcess?.some(id => id === item)}
                                onClick={(event) => {
                                  event.preventDefault();
                                  deleteClientGalleryPicture(client._id, item);
                                }}
                            >
                              <svg><use href={`${Sprite}#trash`}/></svg>
                            </button>
                            <img src={`${API_URL}/clients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
                          </li>
                      )
                    })
                  }
                </ul>
            }

            <FieldWrapper
                name={'gallery'}
                wrapperClass={'form__input-wrap--uploadFile'}
            >
              {
                imageURLS &&
                  <ul className={"list gallery__uploadedImgPreviews"}>
                    {
                      imageURLS?.map((item, index) => {
                        return (
                            <li className={"gallery__uploadedImgPreviews-item"} key={index}>
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
              <label className="btn btn--sm btn--dark-bg" htmlFor={"gallery"}>Pick File</label>
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
                  handleOnFileUploadChange(e, setImageURLS)
                }}
              />
            </FieldWrapper>
            <button
              type="submit"
              disabled={!propsF.dirty || propsF.isSubmitting}
              className="btn btn--bg btn--dark-bg form__submit-btn"
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
}
