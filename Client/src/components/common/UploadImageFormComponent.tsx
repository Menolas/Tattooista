import * as React from "react";
import { Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {isFileSizeValid, isFileTypesValid, MAX_FILE_SIZE, VALID_FILE_EXTENSIONS} from "../../utils/validators";
import {useState} from "react";
import {FieldWrapper} from "../Forms/formComponents/FieldWrapper";

type PropsType = {
    imgUrl?: string;
    defaultImage: MediaImage;
    onChangeCallBack: () => void;
}

export const UploadImageFormComponent: React.FC<PropsType> = React.memo(({
    imgUrl,
    defaultImage,
    onChangeCallBack,
}) => {
    const validationSchema = Yup.object().shape({
        wallPaper: Yup.mixed()
            .test('fileSize', 'Max allowed size is 1024*1024', (value: File) => {
                if (!value) return true;
                return isFileSizeValid([value], MAX_FILE_SIZE);
            })
            .test('fileType', 'Invalid file type', (value: File) => {
                if (!value) return true;
                return isFileTypesValid([value], VALID_FILE_EXTENSIONS);
            }),
    });

    const [imageURL, setImageURL] = useState('');

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        // @ts-ignore
        setImageURL(fileReader.result);
    }

    const handleOnChange = (event) => {
        console.log("handleOnChange !!!!!!!!!!!!!!!!!")
        event.preventDefault();
        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0];
            fileReader.readAsDataURL(file);
        }
    }

    return (
        <div className="form__input-wrap form__input-wrap--uploadFile">
            <div className={"form__input-wrap--uploadFile-img"}>
                <img
                    src={
                        imageURL ? imageURL
                            : imgUrl
                                ? imgUrl
                                : defaultImage
                    }
                    alt="preview"
                />
            </div>
            <label className="btn btn--sm" htmlFor={"wallPaper"}>Pick File</label>
            <FieldWrapper name={'wallPaper'}>
                <Field
                    className="hidden"
                    id="wallPaper"
                    name={'wallPaper'}
                    type={'file'}
                    accept='image/*,.png,.jpg,.web,.jpeg'
                    value={undefined}
                    onChange={(e) => {
                        onChangeCallBack();
                        handleOnChange(e);
                    }}
                />
            </FieldWrapper>
        </div>
    );
});
