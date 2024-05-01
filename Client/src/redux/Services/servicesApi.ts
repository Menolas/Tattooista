import axios, { CreateAxiosDefaults } from "axios";
import {ServiceType} from "../../types/Types";
import {API_URL} from "../../http";

const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type GetServicesResponseType = CommonResponseFields & {
    services: Array<ServiceType>
}

type EditServiceResponseType = GetServicesResponseType

type AddServiceResponseType = GetServicesResponseType

type DeleteServiceResponseType = GetServicesResponseType

export const servicesApi = {

    getServices() {
        return instance.get<GetServicesResponseType>('services/')
            .then(response => response.data)
    },

    editService(
        id: string,
        values: FormData
    ) {
        return instance.post<EditServiceResponseType>(`services/${id}`, values)
            .then(response => response.data);
    },

    addService(values: FormData) {
        return instance.post<AddServiceResponseType>('services/', values)
            .then(response => response.data);
    },

    deleteService(
        id: string
    ) {
        return instance.delete<DeleteServiceResponseType>(`services/${id}`)
            .then(response => response.data);
    },
}
