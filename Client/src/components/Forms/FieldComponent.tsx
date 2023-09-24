import * as React from "react";
import {ErrorMessage, Field} from 'formik'
import {ErrorMessageWrapper} from '../../utils/validators'

type PropsType = {
    name: string
    type: string
    placeholder: string
    label?: string
    value: string
    onChange?: (e: any) => void
}

export const FieldComponent:React.FC<PropsType> = ({
   name,
   type,
   placeholder,
   label,
   onChange,
   value
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
            />
            <ErrorMessage name={name}>
                {ErrorMessageWrapper}
            </ErrorMessage>
        </div>
    )
}
