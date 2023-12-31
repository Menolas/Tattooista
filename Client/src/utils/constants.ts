import * as React from "react";

export enum ResultCodesEnum {
    Success = 0,
    Error = 1
}

export const bookingFilterSelectOptions = [
    { value: "any", label: "All" },
    { value: "true", label: "Only contacted" },
    { value: "false", label: "Only not contacted" },
]

export const clientFilterSelectOptions = [
    { value: "any", label: "All" },
    { value: "true", label: "Only with Tattoos Gallery" },
    { value: "false", label: "Only without Tattoos Gallery" },
]

export const usersFilterSelectOptions = [
    { value: "any", label: "All" },
    { value: "true", label: "Only with Admin Role" },
    { value: "false", label: "Only with User Role" },
]
