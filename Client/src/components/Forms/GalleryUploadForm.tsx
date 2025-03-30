import * as React from "react";
import { useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { MAX_FILE_SIZE, VALID_FILE_EXTENSIONS, isFileSizeValid, isFileTypesValid } from "../../utils/validators";
import { API_URL } from "../../http";
import { FieldWrapper } from "./formComponents/FieldWrapper";
import { ClientType } from "../../types/Types";
import { useDispatch, useSelector } from "react-redux";
import { deleteClientGalleryPicture, updateClientGallery } from "../../redux/Clients/clients-reducer";
import { updateGallery } from "../../redux/Gallery/gallery-reducer";
import { ApiErrorMessage } from "./formComponents/ApiErrorMessage";
import { getTokenSelector } from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";

type FormValues = {
  gallery: File[];
};

type PropsType = {
  apiError: null | string;
  styleID?: string;
  isEditPortfolio: boolean;
  client?: ClientType | null;
  isDeletingPicturesInProcess?: Array<string>;
  refreshClientData?: (updatedClient: ClientType | null) => void;
  closeModal: () => void;
};

export const GalleryUploadForm: React.FC<PropsType> = React.memo(({
  apiError,
  styleID,
  isEditPortfolio,
  client,
  isDeletingPicturesInProcess,
  refreshClientData,
  closeModal,
}) => {

  const token = useSelector(getTokenSelector);
  const [isGalleryModified, setIsGalleryModified] = useState(false);
  const [imageURLs, setImageURLs] = useState<{ url: string | ArrayBuffer | null, file: File }[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleOnFileUploadChange = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    if (event.target.files && event.target.files.length) {
      setImageURLs([]);
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageURLs((prev) => [...prev, { url: reader.result, file }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeletePreview = (event: React.MouseEvent<HTMLButtonElement>, fileToDelete: File) => {
    event.preventDefault();
    setImageURLs((currentFiles) => currentFiles.filter(({ file }) => file !== fileToDelete));
  };

  const filesUploadingValidationSchema = Yup.object().shape({
    gallery: Yup.array()
        .max(5, "You can upload up to 5 files")
        .of(
            Yup.mixed()
                .test('fileSize', "Max allowed size is 2MB", (value) => {
                  if (!(value instanceof File)) return true;
                  return isFileSizeValid([value], MAX_FILE_SIZE);
                })
                .test('fileType', "Invalid file type", (value) => {
                  if (!(value instanceof File)) return true;
                  return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
                })
        )
        .when([], {
          is: () => isEditPortfolio, // Using the isEditPortfolio prop here
          then: (schema) => schema.min(1, "You must select at least one file"),
          otherwise: (schema) => schema.notRequired(),
        }),
  });

  const submit = async (
      values: FormValues,
      formikHelpers: FormikHelpers<FormValues>
  ) => {
    const { setSubmitting, setErrors } = formikHelpers;

    const formData = new FormData();
    imageURLs.forEach(({ file }) => formData.append(file.name, file));

    let success;
    if (isEditPortfolio && styleID !== undefined) {
      success = await dispatch(updateGallery(token, styleID, formData));
    } else if (client) {
      if (imageURLs.length > 0) {
        success = await dispatch(updateClientGallery(token, client._id, formData));
      } else if (isGalleryModified) {
        closeModal();
      }
    }

    if (success) {
      closeModal();
    }
    setSubmitting(false);
  };

  const initialValues: FormValues = {
    gallery: [],
  };

  return (
      <Formik
          initialValues={initialValues}
          validationSchema={filesUploadingValidationSchema}
          onSubmit={submit}
      >
        {(propsF) => (
            <Form className="form form--galleryUpload" encType={"multipart/form-data"}>
              <FieldWrapper name={'gallery'} wrapperClass={'form__input-wrap--uploadFile'}>
                <div className='form__uploadFile-galleries-wrap'>
                  {client?.gallery && client.gallery.length > 0 && (
                      <ul className={"list client-gallery"}>
                        {client?.gallery.map((item, i) => (
                            <li className={"client-gallery__item"} key={i}>
                              <button
                                  className={"btn btn--icon btn--icon--light close-button"}
                                  disabled={isDeletingPicturesInProcess?.some((id) => id === item)}
                                  onClick={async (event) => {
                                    event.preventDefault();
                                    if (client?.gallery && deleteClientGalleryPicture) {
                                      let success = await dispatch(deleteClientGalleryPicture(token, client._id, item));
                                      if (success && refreshClientData) {
                                        const updatedGallery = client.gallery.filter((picture) => picture !== item);
                                        const updatedClient = { ...client, gallery: updatedGallery };
                                        refreshClientData(updatedClient);

                                        setIsGalleryModified(true);
                                      }
                                    }
                                  }}
                              ></button>
                              <img src={`${API_URL}/clients/${client._id}/doneTattooGallery/${item}`} alt={''} />
                            </li>
                        ))}
                      </ul>
                  )}
                  {imageURLs.length > 0 && (
                    <ul className={"list gallery__uploadedImgPreviews"}>
                      {imageURLs.map((item, index) => (
                          <li className={"gallery__uploadedImgPreviews-item"} key={index}>
                            <button
                                className="btn btn--icon close-button"
                                onClick={(event) => handleDeletePreview(event, item.file)}
                            ></button>
                            <img className="client-profile__gallery-image" src={item.url as string} alt="preview" height="50" />
                          </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                      propsF.setFieldValue('gallery', Array.from(e.currentTarget.files || []));
                      handleOnFileUploadChange(e);
                    }}
                />
              </FieldWrapper>
              {apiError && <ApiErrorMessage message={apiError} />}
              <button
                  type="submit"
                  disabled={(!propsF.dirty && !isGalleryModified) || propsF.isSubmitting}
                  className="btn btn--bg btn--dark-bg form__submit-btn"
              >
                {propsF.isSubmitting ? 'Please wait...' : 'Update Gallery'}
              </button>
            </Form>
        )}
      </Formik>
  );
});

GalleryUploadForm.displayName = 'GalleryUploadForm';
