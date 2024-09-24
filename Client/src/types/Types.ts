export type RoleType = {
    _id: string;
    value: string;
}

export type IUser = {
    displayName: string | undefined;
    isActivated: boolean;
    roles: Array<string>;
    avatar?: string;
}

export type UserType = {
    "_id": string;
    displayName: string;
    email: string;
    isActivated: boolean;
    avatar: string;
    roles: Array<RoleType>;
}

export interface ContactType {
    [key: string]: string;
}

export type ContactsType = {
    email: string | undefined;
    insta: string | undefined;
    messenger: string | undefined;
    phone: string | undefined;
    whatsapp: string | undefined;
}

export type ClientType = {
    _id: string;
    fullName: string;
    isFavourite: boolean;
    createdAt?: Date;
    contacts: ContactType;
    avatar?: File | string;
    gallery?: Array<string>;
}

export type BookingType = {
    _id: string;
    fullName: string;
    message?: string;
    status?: boolean;
    createdAt?: string;
    contacts: ContactType;
}

export type FaqType = {
    _id: string;
    answer: string;
    question: string;
}

export type UpdateFaqValues = {
    answer: string;
    question: string;
}

export type ServiceType = {
    _id: string;
    title: string;
    wallPaper?: string;
    conditions: Array<string>;
}

export type UpdateServiceFormValues = {
    wallPaper: File | string | undefined;
    title: string;
    condition_0: string | undefined;
    condition_1: string | undefined;
    condition_2: string | undefined;
    condition_3: string | undefined;
    condition_4: string | undefined;
    condition_5: string | undefined;
    [key: string]: string | File | undefined;
}

export type StyleType = {
    _id: string;
    value: string;
    wallPaper?: string;
    description: string;
    nonStyle: boolean;
    createdAt?: Date;
}

export type UpdateStyleFormValues = {
    value: string;
    wallPaper?: File | string | null;
    description: string;
}

export type CreatedAtType = {
    $date: string;
}

export type GalleryItemType = {
    _id: string;
    fileName: string;
    tattooStyles: Array<string>;
    createdAt?: CreatedAtType;
}

export interface RegistrationFormValues {
    avatar: File | string;
    displayName: string;
    email: string;
    password: string;
    consent: boolean;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface BookConsultationFormValues  {
    fullName: string;
    contact: string;
    email: string;
    phone: string;
    insta: string;
    whatsapp: string;
    messenger: string;
    message: string;
    consent: boolean;
}

export interface AddConsultationFormValues  {
    fullName: string;
    email?: string;
    phone?: string;
    insta?: string;
    whatsapp?: string;
    messenger?: string;
}

export interface AddClientFormValues {
    avatar: File | string | null;
    fullName: string;
    email: string | null;
    insta: string | null;
    messenger: string | null;
    phone: string | null;
    whatsapp: string | null;
}

export interface UpdateUserFormValues {
    avatar?: File | string | null;
    displayName: string;
    email: string;
    password?: string;
    roles: { [key: string]: boolean };
    [key: string]: any;
}

export type PageType = {
    _id: string;
    name: string;
    isActive: boolean;
    title: string;
    content: string;
    wallPaper: string;
}

export type UpdateAboutPageFormValues = {
    aboutPageWallPaper: File | string;
    aboutPageTitle: string;
    aboutPageContent: string;
}

export type SelectOptionType = {
    value: string;
    label: string;
}

export type SearchFilterType = {
    term: string;
    condition: string;
}

export type CommonResponseFields = {
    resultCode: number;
    message?: string;
}

export interface ApiErrorType {
    response: {
        data: {
            message: string;
            // Include other properties as needed
        };
        status?: number;
    };
}
