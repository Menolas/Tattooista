export type RoleType = {
    _id: string;
    value: string;
    description?: string;
}

export type UserType = {
    _id: string;
    displayName: string | undefined;
    isActivated: boolean;
    email: string;
    roles: Array<any>;
    avatar?: string;
} | null;

export type ReviewType = {
    _id: string;
    rate: number;
    content: string;
    createdAt: Date;
    gallery: Array<string>;
    user: {
      _id: string;
      displayName: string;
      avatar: string;
    }
}

export interface ContactType {
    [key: string]: string;
}

export type ClientType = {
    _id: string;
    fullName: string;
    isFavourite: boolean;
    createdAt: Date;
    contacts: ContactType;
    avatar?: File | string;
    gallery: Array<string>;
}

export type BookingType = {
    _id: string;
    fullName: string;
    message?: string;
    status?: boolean;
    createdAt: Date;
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

export type UpdateReviewFormValues = {
    rate: number;
    content: string;
}

export type StyleType = {
    _id: string;
    value: string;
    wallPaper?: string;
    description: string;
    nonStyle: boolean;
    createdAt: Date;
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
    createdAt: CreatedAtType;
}

export interface RegistrationFormValues {
    avatar?: File | string | null
    displayName: string;
    email: string;
    password: string;
    consent: boolean;
}

export interface UpdateUserFormValues {
    avatar?: File | string | null;
    displayName: string;
    email: string;
    password?: string;
    roles?: { [key: string]: boolean };
    [key: string]: any;
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
    isFavourite?: boolean;
}

export type CommonResponseFields = {
    resultCode: number;
    message?: string;
    refresh?: boolean;
}

export interface ApiErrorType {
    response: {
        data: {
            message: string;
        };
        status?: number;
    };
}
