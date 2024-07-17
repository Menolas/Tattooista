import * as React from "react";
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import {MAX_FILE_SIZE, VALID_FILE_EXTENSIONS, isFileSizeValid, isFileTypesValid } from "../../utils/validators";
import {ReactComponent as TrashIcon} from "../../assets/svg/trash.svg";
import {API_URL} from "../../http";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import * as Yup from "yup";
import {ClientType} from "../../types/Types";
import {useDispatch} from "react-redux";
import {updateClientGallery} from "../../redux/Clients/clients-reducer";
import {updateGallery} from "../../redux/Gallery/gallery-reducer";

const filesUploadingValidationSchema = Yup.object().shape({
  gallery: Yup.array()
      .max(5, "You can upload up to 5 files")
      .of(
          Yup.mixed()
              .test('fileSize', "Max allowed size is 2MB ", (value) => {
                if (!(value instanceof File)) return true
                return isFileSizeValid([value], MAX_FILE_SIZE)
              })
              .test('fileType', "Invalid file type", (value) => {
                if (!(value instanceof File)) return true
                return isFileTypesValid([value], VALID_FILE_EXTENSIONS)
              })
      )
      .min(1, "You must select at least one file"),
});

type FormValues = {
  gallery: File[];
};

type PropsType = {
  styleID?: string;
  isEditPortfolio: boolean;
  client?: ClientType;
  isDeletingPicturesInProcess?: Array<string>;
  closeModal: () => void;
  deleteClientGalleryPicture?: (clientId: string, picture: string) => void;
}

export const GalleryUploadForm: React.FC<PropsType> = React.memo(({
  styleID,
  isEditPortfolio,
  client,
  isDeletingPicturesInProcess,
  deleteClientGalleryPicture,
  closeModal
}) => {

  const [imageURLs, setImageURLs] = useState<{url: string | ArrayBuffer | null, file: File}[]>([]);

  const dispatch = useDispatch();

  const handleOnFileUploadChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      //setImageURLS: React.Dispatch<React.SetStateAction<(string | ArrayBuffer | null)[]>>
  ) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      setImageURLs([]);
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageURLs(prev =>[...prev, {url: reader.result, file}]);
        }
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeletePreview = (event: React.MouseEvent<HTMLButtonElement>, fileToDelete: File) => {
    event.preventDefault();
    setImageURLs(currentFiles => currentFiles.filter(({file}) => file !== fileToDelete));
  };

  const submit = async (values: FormValues, formikHelpers: any) => {
    const { setSubmitting, setErrors } = formikHelpers;

    if (imageURLs.length === 0 && (isEditPortfolio || client?.gallery?.length === 0)) {
      setErrors({ gallery: "At least one file must be selected for upload." });
      setSubmitting(false);
      return;
    }
    const formData = new FormData();
    imageURLs.forEach(({file}) => formData.append(file.name, file));
    if (isEditPortfolio && styleID !== undefined) await dispatch(updateGallery(styleID, formData));
    if (!isEditPortfolio && client) await dispatch(updateClientGallery(client?._id, formData));
    closeModal();
  };

  const initialValues = {
    gallery: []
  };

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
                    client.gallery.map((item, i) => {
                      return (
                          <li className={"client-gallery__item"} key={i}>
                            <button
                                className={"btn btn--icon btn--icon--light"}
                                disabled={isDeletingPicturesInProcess?.some(id => id === item)}
                                onClick={(event) => {
                                  event.preventDefault();
                                  deleteClientGalleryPicture?.(client._id, item);
                                }}
                            >
                              <TrashIcon />
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
                imageURLs &&
                  <ul className={"list gallery__uploadedImgPreviews"}>
                    {
                      imageURLs.map((item, index) => {
                        return (
                            <li
                                className={"gallery__uploadedImgPreviews-item"}
                                key={index}
                            >
                              <button
                                  className="btn"
                                  onClick={(event) => handleDeletePreview(event, item.file)}
                              >
                                Delete
                              </button>
                              <img
                                  className="client-profile__gallery-image"
                                  src={item.url as string}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  propsF.setFieldValue('gallery', Array.from(e.currentTarget.files || []))
                  handleOnFileUploadChange(e)
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
  );
});

GalleryUploadForm.displayName = 'GalleryUploadForm';
