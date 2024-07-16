import {useField} from "formik";
import Select from "react-select";
import * as React from "react";
import {useState} from "react";

type OptionType = {
    value: string;
    label: string;
};

type PropsType = {
    name: string;
    options: OptionType[];
    handleChange: (value: string) => void;
    placeholder?: string;
}

export const FormSelect: React.FC<PropsType> = ({
    name,
    options,
    handleChange,
    placeholder,
}) => {

    const [field, meta, helpers] = useField(name);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

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
            onChange={(newValue) => {
                if (newValue !== null) {
                    helpers.setValue(newValue.value);
                    handleChange(newValue.value);
                }
            }}
            value={options.find((option: OptionType) => option.value === field.value)}
        />
    );
};
