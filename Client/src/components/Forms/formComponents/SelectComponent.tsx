import {Field, FieldProps, useField} from "formik";
import * as React from "react";
import {useState} from "react";

type OptionType = {
    value: string;
    label: string;
}

type PropsType = FieldProps & {
    name: string;
    options: OptionType[];
    handleChange: (input: string) => void;
    placeholder?: string;
}

export const SelectComponent: React.FC<PropsType> = ({
    form,
    name,
    options,
    handleChange,
    placeholder,
}) => {
    const [ field, meta, helpers] = useField(name);
    let [menuIsOpen, setMenuIsOpen] = useState(false);

    return (
        <select
            {...field}
            name={name}
            className={ !menuIsOpen ? "select-block" : "select-block menuOpen" }
            autoComplete="off"
            onBlur={() => helpers.setTouched(true)}
            // onMenuOpen={() => {
            //     setMenuIsOpen(true)
            // }}
            // onMenuClose={() => {
            //     setMenuIsOpen(false)
            // }}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
