import {ErrorMessage, useField} from "formik";
import Select from "react-select";
import * as React from "react";

export const FormSelect = ({ name, options, handleChange }) => {
    const [field, meta, helpers] = useField(name)
    const { setValue, setTouched, setError } = helpers
    const setFieldProps = (selectedOption) => {
        console.log("setFieldProps", selectedOption.value)
        setTouched(true)
        handleChange(selectedOption.value)
        setValue(selectedOption.value)
        //setError(undefined)
    }
    return (
        <Select
            name={name}
            onChange={setFieldProps}
            options={options}
            onBlur={() => helpers.setTouched(true)}
            value={field.value}
        />
    )
}