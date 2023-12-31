import {useField} from "formik"
import Select from "react-select"
import * as React from "react"
import {useState} from "react"

export const FormSelect = ({ name, options, handleChange, placeholder }) => {
    const [field, meta, helpers] = useField(name)
    const { setValue, setTouched, setError } = helpers
    const [selectedOption, setSelectedOption] = useState("none")
    const setFieldProps = (selectedOption) => {
        setTouched(true)
        handleChange(selectedOption.value)
        setSelectedOption(selectedOption.value)
        setValue(selectedOption.value)
        //setError(undefined)
    }

    return (
        <Select
            className={"select-block"}
            name={name}
            onChange={setFieldProps}
            options={options}
            onBlur={() => helpers.setTouched(true)}
            value={options.filter(function(option) {
                return option.value === selectedOption;
            })}
            placeholder={placeholder}
            //isMulti
        />
    )
}
