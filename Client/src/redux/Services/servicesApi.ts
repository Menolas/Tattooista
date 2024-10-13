import {ServiceType} from "../../types/Types";
import {CommonResponseFields} from "../../types/Types";
import $api from "../../http";

type GetServicesResponseType = CommonResponseFields & {
    services: Array<ServiceType>;
};

type EditServiceResponseType = CommonResponseFields & {
    service: ServiceType;
};

type AddServiceResponseType = EditServiceResponseType;

type DeleteServiceResponseType = CommonResponseFields;

export const servicesApi = {

    async getServices() {
        return await $api.get<GetServicesResponseType>('services/')
            .then(response => response.data)
    },

    async editService(
        token: string | null,
        id: string,
        values: FormData
    ) {
        return await $api.post<EditServiceResponseType>(
            `services/${id}`,
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        )
            .then(response => response.data);
    },

    async addService(
        token: string | null,
        values: FormData
    ) {
        return await $api.post<AddServiceResponseType>(
            'services/',
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        )
            .then(response => response.data);
    },

    async deleteService(
        token: string | null,
        id: string
    ) {
        return await $api.delete<DeleteServiceResponseType>(
            `services/${id}`,
            {headers: {Authorization: `Bearer ${token}`}}
        )
            .then(response => response.data);
    },
};
