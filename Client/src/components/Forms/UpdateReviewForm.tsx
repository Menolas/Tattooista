import * as React from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import {ReviewType, UpdateReviewFormValues,} from "../../types/Types";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {ApiErrorMessage} from "./formComponents/ApiErrorMessage";
import {useDispatch, useSelector} from "react-redux";
import {addReview, deleteReviewGalleryPicture, updateReview} from "../../redux/Reviews/reviews-reducer";
import {handleEnterClick} from "../../utils/functions";
import {getTokenSelector, getUserProfileSelector} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {isFileSizeValid, isFileTypesValid, MAX_FILE_SIZE, VALID_FILE_EXTENSIONS} from "../../utils/validators";
import {useState} from "react";
import {API_URL} from "../../http";
import {getIsDeletingReviewPicturesInProcessSelector} from "../../redux/Reviews/reviews-selectors";
import {addReviewFromProfile, deleteReviewGalleryPictureFromProfile} from "../../redux/Auth/auth-reducer";

const validationSchema = Yup.object().shape({
    rate: Yup.number()
        .moreThan(0, "Please rate your experience")
        .required("Please rate your experience"),
    content: Yup.string()
        .required("Please shortly describe your experience"),
    gallery: Yup.array()
        .max(3, "You can upload up to 3 files")
        .of(
            Yup.mixed()
                .test('fileSize', "Max allowed size is 1MB", (value) => {
                    if (!(value instanceof File)) return true;
                    return isFileSizeValid([value], MAX_FILE_SIZE);
                })
                .test('fileType', "Invalid file type", (value) => {
                    if (!(value instanceof File)) return true;
                    return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
                })
        ),
});

type PropsType = {
    isFromProfile?: boolean;
    apiError: null | string;
    isEditing: boolean;
    review?: ReviewType;
    closeModal: () => void;
};
export const UpdateReviewForm: React.FC<PropsType> = React.memo(({
    isFromProfile,
    apiError,
    isEditing,
    review,
    closeModal,
}) => {
    const token = useSelector(getTokenSelector);
    const user = useSelector(getUserProfileSelector);
    const isDeletingPicturesInProcess = useSelector(getIsDeletingReviewPicturesInProcessSelector);
    const [imageURLs, setImageURLs] = useState<{ url: string | ArrayBuffer | null, file: File }[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    const handleOnFileUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
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

    const initialValues: UpdateReviewFormValues = {
        rate: isEditing && review ? review.rate : 0,
        content: isEditing && review ? review.content : '',
        gallery: [],
    };

    const submit = async (
        values: UpdateReviewFormValues,
        actions: FormikHelpers<UpdateReviewFormValues>
    ) => {
        const formData = new FormData();

        formData.append('rate', values.rate.toString());
        formData.append('content', values.content);

        imageURLs.forEach(({ file }) => {
            formData.append('gallery', file);
        });

        let success;

        try {
            if (isEditing && review) {
                console.log(user?._id + " " + review._id + " ids!!!!!!!!");
                success = await dispatch(updateReview(token, review._id, formData));
            } else {
                if (isFromProfile) {
                    success = await dispatch(addReviewFromProfile(user?._id, token, formData));
                } else {
                    success = await dispatch(addReview(user?._id, token, formData));
                }
            }
            if (success) {
                closeModal();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        actions.setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submit}
        >
            {propsF => {

                return (
                    <Form className="form form--updateReview" encType={"multipart/form-data"}>
                        <FieldWrapper
                            name={'rate'}
                            label="Rate your experience"
                        >
                            <div className="rate">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        className={`btn btn--icon rate ${num <= propsF.values.rate ? "selected" : ""}`}
                                        onClick={() => propsF.setFieldValue("rate", num)}
                                    >
                                        <StarFilled />
                                    </button>
                                ))}
                            </div>
                        </FieldWrapper>

                        <FieldWrapper
                            name={'content'}
                        >
                            <Field
                                name={'content'}
                                component="textarea"
                                rows={6}
                                placeholder={"Please describe your experience"}
                                value={propsF.values.content ?? ''}
                                onChange={propsF.handleChange}
                                onKeyDown={(event: React.KeyboardEvent) => {
                                    handleEnterClick(event, propsF.handleSubmit)
                                }}
                            />
                        </FieldWrapper>
                        <FieldWrapper name={'gallery'} wrapperClass={'form__input-wrap--uploadFile'}>
                            <div className='form__uploadFile-galleries-wrap'>
                                {review?.gallery && review.gallery.length > 0 && (
                                    <ul className={"list client-gallery"}>
                                        {review?.gallery.map((item, i) => (
                                            <li className={"client-gallery__item"} key={i}>
                                                <button
                                                    className={"btn btn--icon btn--icon--light close-button"}
                                                    disabled={isDeletingPicturesInProcess?.some((id) => id === item)}
                                                    onClick={async (event) => {
                                                        event.preventDefault();
                                                        if (review?.gallery && deleteReviewGalleryPicture) {
                                                            let success = !isFromProfile
                                                                ? await dispatch(deleteReviewGalleryPicture(token, review._id, item))
                                                                : await dispatch(deleteReviewGalleryPictureFromProfile(token, review._id, item));
                                                            // if (success && refreshClientData) {
                                                            //     const updatedGallery = review.gallery.filter((picture) => picture !== item);
                                                            //     const updatedClient = { ...review, gallery: updatedGallery };
                                                            //     refreshClientData(updatedClient);
                                                            //
                                                            //     setIsGalleryModified(true);
                                                            // }
                                                        }
                                                    }}
                                                ></button>
                                                <img src={`${API_URL}/reviews/${review._id}/${item}`} alt={''} />
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
                                    const newFiles = Array.from(e.currentTarget.files || []);
                                    const existingFiles = propsF.values.gallery || [];
                                    const updatedFiles = [...existingFiles, ...newFiles];

                                    propsF.setFieldValue('gallery', updatedFiles);
                                    handleOnFileUploadChange(e);
                                }}
                            />
                        </FieldWrapper>
                        {!!apiError &&
                            <ApiErrorMessage message={apiError}/>
                        }

                        <button
                            type="submit"
                            disabled={!propsF.dirty || propsF.isSubmitting}
                            className="btn btn--bg btn--dark-bg form__submit-btn">
                            {propsF.isSubmitting
                                ? 'Please wait...'
                                : 'SUBMIT'
                            }
                        </button>
                    </Form>
                );
            }}
        </Formik>
    );
});

UpdateReviewForm.displayName = 'UpdateServiceItemForm';
