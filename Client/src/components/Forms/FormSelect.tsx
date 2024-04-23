import {useField} from "formik";
import Select from "react-select";
import * as React from "react";
import {useState} from "react";

type PropsType = {
    name: string;
    options: any;
    handleChange: any
    placeholder?: string;
}

export const FormSelect: React.FC<PropsType> = ({
    name,
    options,
    handleChange,
    placeholder,
}) => {

    const [field, meta, helpers] = useField(name);
    //const { setValue, setTouched} = helpers;
    // [selectedOption, setSelectedOption] = useState("none");
    let [menuIsOpen, setMenuIsOpen] = useState(false);

    // const setFieldProps = async (selectedOption) => {
    //     await setTouched(true);
    //     handleChange(selectedOption.value);
    //     setSelectedOption(selectedOption.value);
    //     await setValue(selectedOption.value);
    // }

    return (
        <Select
            className={ !menuIsOpen ? "select-block" : "select-block menuOpen" }
            name={name}
            options={options}
            onBlur={() => helpers.setTouched(true)}
            placeholder={placeholder}
            onMenuOpen={() => {
                setMenuIsOpen(true)
            }}
            onMenuClose={() => {
                setMenuIsOpen(false)
            }}
            //onChange={setFieldProps}
            onChange={(selectedOption) => {
                helpers.setValue(selectedOption.value);
                handleChange(selectedOption.value);
            }}
            value={options.find((option) => option.value === field.value)}
            // value={
            //     options.filter(function(option) {
            //         return option.value === selectedOption;
            //     })
            // }
        />
    )
}
