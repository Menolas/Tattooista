import axios, { CreateAxiosDefaults } from 'axios'
import {FaqType, ServiceType, PageType, BookedConsultationType, BookConsultationFormValues} from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'

const instance = axios.create({
    baseURL: SERVER_URL
} as CreateAxiosDefaults)

type GetPagesResponseType = {
    resultCode: number
    pages: Array<PageType>
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

    getPages() {
        return instance.get<GetPagesResponseType>('pages/')
            .then(response => {
                return response.data
            })
    },

    editAboutPage(
        id: string,
        values: FormData,
    ) {
        return instance.post(`pages/${id}`, values)
            .then(response => {
                return response.data
            })
    },

    changePageVisibility(
        pageId: string,
        isActive: boolean
    ) {
        return instance.patch(`pages/visibility/${pageId}`, {isActive: isActive})
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
