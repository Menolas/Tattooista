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
        id: string,
        values: FormData
    ) {
        return await $api.post<EditServiceResponseType>(`services/${id}`, values)
            .then(response => response.data);
    },

    async addService(values: FormData) {
        return await $api.post<AddServiceResponseType>('services/', values)
            .then(response => response.data);
    },

    async deleteService(
        id: string
    ) {
        return await $api.delete<DeleteServiceResponseType>(`services/${id}`)
            .then(response => response.data);
    },
};
