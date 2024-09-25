import {useField} from "formik";
import Select, { components, InputProps } from "react-select";
import * as React from "react";
import {useState} from "react";

type OptionType = {
    value: string;
    label: string;
};

type PropsType = {
    name: string;
    options: OptionType[];
    handleChange?: (value: string) => void;
    placeholder?: string;
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const CustomInput = (props: InputProps<OptionType>) => (
    <components.Input {...props} autoComplete="nope" />
);

export const FormSelect: React.FC<PropsType> = ({
    name,
    options,
    handleChange,
    placeholder,
    onKeyDown,
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
                if (newValue && !Array.isArray(newValue)) {
                    const option = newValue as OptionType; // Cast newValue to OptionType
                    helpers.setValue(option.value);
                    if (handleChange) handleChange(option.value);
                }
            }}
            value={options.find((option: OptionType) => option.value === field.value)}
            components={{ Input: CustomInput }}
            onKeyDown={(event) => {
                onKeyDown(event)
            }}
            classNamePrefix={meta.touched && meta.error ? "has-error" : ""}
        />
    );
};
