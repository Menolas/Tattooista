export type RoleType = {
    _id: string
    value: string
}

export type IUser = {
    displayName: string | undefined
    isActivated: boolean
    roles: Array<string>
    avatar?: string
}

export type UserType = {
    "_id": string
    displayName: string
    email: string
    isActivated: boolean
    avatar: string
    roles: Array<RoleType> | Array<String>
}

export interface ContactType {
    [key: string]: string
}

export type ContactsType = {
    email: string | undefined
    insta: string | undefined
    messenger: string | undefined
    phone: string | undefined
    whatsapp: string | undefined
}

export type ClientType = {
    _id: string
    fullName: string
    createdAt?: any
    contacts: ContactType
    avatar?: File | string
    gallery?: Array<string>
}

export type BookedConsultationType = {
    _id: string
    fullName: string
    message?: string
    status?: boolean
    createdAt?: string
    contacts: {},
}

export type FaqType = {
    _id: string
    answer: string
    question: string
}

export type ServiceType = {
    _id: string
    title: string
    wallPaper?: string
    conditions: Array<string>
}

export type TattooStyleType = {
    _id: string
    value: string
    wallPaper: string
    description: string
    nonStyle: boolean
}

export type GalleryCreatedAtType = {
    $date: string
}

export type GalleryItemType = {
    _id: string
    fileName: string
    tattooStyles: Array<String>
    createdAt?: GalleryCreatedAtType
}

export interface RegistrationFormValues {
    avatar: File | string
    displayName: string
    email: string
    password: string
    consent: boolean
}

export interface LoginFormValues {
    email: string
    password: string
}

export interface BookConsultationFormValues  {
    bookingName: string
    contact: string
    email: string
    phone: string
    insta: string
    whatsapp: string
    messenger: string
    message: string
    consent: boolean
}

export interface AddConsultationFormValues  {
    bookingName: string
    email?: string
    phone?: string
    insta?: string
    whatsapp?: string
    messenger?: string
}

export interface AddClientFormValues {
    avatar: File | string | null
    clientName: string
    email: string | null
    insta: string | null
    messenger: string | null
    phone: string | null
    whatsapp: string | null
}

export interface UpdateUserFormValues {
    avatar?: File | string | null
    displayName: string
    email: string
    password?: string
    roles: Array<string>
}

export type PageType = {
    _id: string
    name: string
    isActive: boolean
    title: string
    content: string
    wallPaper: string
}

export type SelectOptionType = {
    value: string
    label: string
}
