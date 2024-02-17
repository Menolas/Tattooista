export const ADMIN_BUTTONS_DATA = [
    {
        btnText: "Booked Consultations",
        btnUrl: "bookedConsultations"
    },
    {
        btnText: "Clients",
        btnUrl: "clients"
    },
    {
        btnText: "Portfolio",
        btnUrl: "portfolio"
    },
    {
        btnText: "Archive",
        btnUrl: "archive/archivedConsultations"
    },
    {
        btnText: "Users",
        btnUrl: "users"
    }
]

export const SUPER_ADMIN = 'SUPER_ADMIN'
export const ADMIN = 'ADMIN'
export const USER = 'USER'

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
