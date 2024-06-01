import {useField} from "formik";
import Select, { components } from "react-select";
import * as React from "react";
import {useState} from "react";

type PropsType = {
    name: string;
    options: any;
    value: string;
    handleChange: any;
    placeholder?: string;
}

const CustomInput = (props: any) => (
    <components.Input {...props} autoComplete="nope" />
);

export const FormSelect2: React.FC<PropsType> = ({
    name,
    options,
    value,
    handleChange,
    placeholder,
}) => {

    const [field, meta, helpers] = useField(name);
    let [menuIsOpen, setMenuIsOpen] = useState(false);

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
    };

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
            onChange={(selectedOption) => {
                helpers.setValue(selectedOption.value);
                handleChange(selectedOption.value);
            }}
            value={options.find((option) => option.value === field.value)}
            components={{ Input: CustomInput }}
            onMouseDown={handleMouseDown}
        />
    )
}
