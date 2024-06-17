import * as React from "react";
import {ErrorMessage} from "formik";
import {ErrorMessageWrapper} from "./ErrorMessageWrapper";

type PropsType = {
    wrapperClass?: string;
    name: string;
    label?: string;
    children: any;
}

export const FieldWrapper:React.FC<PropsType> = ({
     wrapperClass = '',
     name,
     label,
     children
 }) => {
    return (
        <div className={`form__input-wrap ${wrapperClass}`}>
            { label &&
                <label className="form__input-label">{label}</label>
            }
            {children}
            <ErrorMessage name={name}>
                {ErrorMessageWrapper}
            </ErrorMessage>
        </div>
    )
};
