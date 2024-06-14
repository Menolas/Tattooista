import * as React from "react";
import {Field, Form, Formik} from "formik";
import { GalleryItemType, StyleType} from "../../types/Types";
import {FieldWrapper} from "./formComponents/FieldWrapper";
import {API_URL} from "../../http";
import {useDispatch} from "react-redux";
import {updateGalleryItem} from "../../redux/Gallery/gallery-reducer";

type PropsType = {
    activeStyleId: string;
    folder: string;
    galleryItem: GalleryItemType;
    styles: Array<StyleType>;
    closeModal?: () => void;
}

export const UpdateGalleryItemForm: React.FC<PropsType> = React.memo(({
    activeStyleId,
    folder,
    galleryItem,
    styles,
    closeModal
}) => {

    const dispatch = useDispatch();

    const submit = async (values: any) => {
        await dispatch(updateGalleryItem(galleryItem._id, values, activeStyleId));
        closeModal();
    }

    let initialValues = {};
    styles.forEach((style) => {
        initialValues[style._id] = galleryItem?.tattooStyles?.includes(style._id);
    });

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
        >
            {(propsF) => {
                let {isSubmitting} = propsF;

                const tattooStyles = styles.map((style) => {
                        return (
                            <FieldWrapper
                                key={style._id}
                                wrapperClass={'form__input-wrap--checkbox'}
                                name={style._id}
                            >
                                <Field
                                    type="checkbox"
                                    name={style._id}
                                    id={style._id}
                                    onChange={propsF.handleChange}
                                />
                                <label htmlFor={style._id}>
                                    <span className="checkbox">{''}</span>
                                    {style.value}
                                </label>
                            </FieldWrapper>
                        )
                });

                return (
                    <Form
                        id={"updateGalleryItem"}
                        className={"form form--updateGalleryItem"}
                        >
                        <div
                            className={'galleryItem-illustration'}
                            style={{ backgroundImage: `url(${API_URL}/${folder}/${galleryItem?.fileName})` }}
                        >

                        </div>
                        {tattooStyles}
                        <button
                            type="submit"
                            disabled={!propsF.dirty || isSubmitting}
                            className="btn btn--bg btn--dark-bg form__submit-btn"
                        >
                            {isSubmitting
                                ? 'Please wait...'
                                : 'Update Gallery Item Styles'
                            }
                        </button>
                    </Form>
                )

            }}
        </Formik>
    )
});
