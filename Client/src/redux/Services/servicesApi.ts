import {ServiceType} from "../../types/Types";
import {instance} from "../../http";
import {CommonResponseFields} from "../../types/Types";

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
        return await instance.get<GetServicesResponseType>('services/')
            .then(response => response.data)
    },

    async editService(
        id: string,
        values: FormData
    ) {
        return await instance.post<EditServiceResponseType>(`services/${id}`, values)
            .then(response => response.data);
    },

    async addService(values: FormData) {
        return await instance.post<AddServiceResponseType>('services/', values)
            .then(response => response.data);
    },

    async deleteService(
        id: string
    ) {
        return await instance.delete<DeleteServiceResponseType>(`services/${id}`)
            .then(response => response.data);
    },
};
