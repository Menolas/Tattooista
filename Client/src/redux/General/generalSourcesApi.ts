import axios, { CreateAxiosDefaults } from "axios"
import {
    BookingType,
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

type BookConsultationResponseType = CommonResponseFields & {
    booking: BookingType
}

export const generalSourcesApi = {

    bookConsultation(values: BookConsultationFormValues) {
        return instance.post<BookConsultationResponseType>('bookings', values)
            .then(response => response.data)
    },
}
