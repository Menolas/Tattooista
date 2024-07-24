import * as React from "react";
import {ErrorMessage, Field, FieldProps} from "formik";
import {ErrorMessageWrapper} from "./ErrorMessageWrapper";

type PropsType = {
    name: string;
    type: string;
    placeholder: string;
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const FieldComponent:React.FC<PropsType> = ({
   name,
   type,
   placeholder,
   label,
   onChange,
   value,
   onKeyDown,
}) => {
    return (
        <div className="form__input-wrap">
            { label &&
                <label className="form__input-label">{label}</label>
            }
            <Field
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            >
                {({field}: FieldProps) => (
                <input
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    onKeyDown={(event) => {
                        if (onKeyDown) onKeyDown(event);
                    }}
                />
                )}
            </Field>
            <ErrorMessage name={name}>
                {ErrorMessageWrapper}
            </ErrorMessage>
        </div>
    );
};
