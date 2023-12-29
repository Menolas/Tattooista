import axios, { CreateAxiosDefaults } from "axios"
import {
    FaqType,
    ServiceType,
    PageType,
    BookedConsultationType,
    BookConsultationFormValues
} from "../../types/Types"
import {API_URL} from "../../http"


const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type GetPagesResponseType = CommonResponseFields & {
    page: PageType
}

type EditAboutPageResponseType = GetPagesResponseType

type ChangeAboutPageVisibilityResponseType = GetPagesResponseType

type BookConsultationResponseType = CommonResponseFields & {
    booking: BookedConsultationType
}

type GetFaqItemsResponseType = CommonResponseFields & {
    faqItems: Array<FaqType>
}

type AddFaqItemResponseType = GetFaqItemsResponseType

type UpdateFaqItemResponseType = GetFaqItemsResponseType

type DeleteFaqItemResponseType = GetFaqItemsResponseType

type GetServicesResponseType = CommonResponseFields & {
    services: Array<ServiceType>
}

type EditServiceResponseType = GetServicesResponseType

type AddServiceResponseType = GetServicesResponseType

type DeleteServiceResponseType = GetServicesResponseType

export const generalSourcesApi = {

    getFaqItems() {
        return instance.get<GetFaqItemsResponseType>('faq/')
            .then(response => response.data)
    },

    addFaqItem(values: FaqType) {
        return instance.post<AddFaqItemResponseType>('faq', values)
            .then(response => response.data)
    },

    updateFaqItem(id: string, values: any) {
        return instance.post<UpdateFaqItemResponseType>(`faq/${id}`, values)
            .then(response => response.data)
    },

    deleteFaqItem(id: string) {
        return instance.delete<DeleteFaqItemResponseType>(`faq/${id}`)
            .then(response => response.data)
    },

    getServices() {
        return instance.get<GetServicesResponseType>('services/')
            .then(response => response.data)
    },

    getAboutPage() {
        return instance.get<GetPagesResponseType>('pages/about')
            .then(response => response.data)
    },

    editAboutPage(values: FormData) {
        return instance.post<EditAboutPageResponseType>(`pages/about`, values)
            .then(response => response.data)
    },

    changeAboutPageVisibility(isActive: boolean) {
        return instance.patch<ChangeAboutPageVisibilityResponseType>(`pages/visibility/about`, {isActive: isActive})
            .then(response => response.data)
    },

    editService(
        id: string,
        values: FormData
    ) {
        return instance.post<EditServiceResponseType>(`services/${id}`, values)
            .then(response => response.data)
    },

    addService(values: FormData) {
        return instance.post<AddServiceResponseType>('services/', values)
            .then(response => response.data)
    },

    deleteService(
        id: string
    ) {
        return instance.delete<DeleteServiceResponseType>(`services/${id}`)
            .then(response => response.data)
    },

    bookConsultation(values: BookConsultationFormValues) {
        return instance.post<BookConsultationResponseType>('bookings', values)
            .then(response => response.data)
    },
}
