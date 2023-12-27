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

type GetPagesResponseType = {
    resultCode: number
    page: PageType
    message?: string
}

type BookConsultationResponseType = {
    resultCode: number
    booking: BookedConsultationType
    message?: string
}

export const generalSourcesApi = {

    getFaqItems() {
        return instance.get<FaqType[]>('faq/')
            .then(response => {
                return response.data
            })
    },

    addFaqItem(values: FaqType) {
        return instance.post('faq', values)
            .then(response => {
                return response.data
            })
    },

    updateFaqItem(id: string, values: any) {
        return instance.post(`faq/${id}`, values)
            .then(response => {
                return response.data
            })
    },

    deleteFaqItem(
        id: string
    ) {
        return instance.delete(`faq/${id}`)
            .then(response => {
                return response.data
            })
    },

    getServices() {
        return instance.get<ServiceType[]>('services/')
            .then(response => {
                return response.data
            })
    },

    getAboutPage() {
        return instance.get<GetPagesResponseType>('pages/about')
            .then(response => {
                return response.data
            })
    },

    editAboutPage(values: FormData) {
        return instance.post(`pages/about`, values)
            .then(response => {
                return response.data
            })
    },

    changeAboutPageVisibility(isActive: boolean) {
        return instance.patch(`pages/visibility/about`, {isActive: isActive})
            .then(response => {
                return response.data
            })
    },

    editService(
        id: string,
        values: FormData
    ) {
        return instance.post(`services/${id}`, values)
            .then(response => {
                return response.data
            })
    },

    addService(values: FormData) {
        return instance.post('services/', values)
            .then(response => {
                return response.data
            })
    },

    deleteService(
        id: string
    ) {
        return instance.delete(`services/${id}`)
            .then(response => {
                return response.data
            })
    },

    bookConsultation(values: BookConsultationFormValues) {
        return instance.post<BookConsultationResponseType>('bookings', values)
            .then(response => {
                console.log(response.data)
                return response.data
            })
    },
}
