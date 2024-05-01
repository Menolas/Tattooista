import axios, { CreateAxiosDefaults } from "axios";
import {FaqType,} from "../../types/Types";
import {API_URL} from "../../http";


const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type GetFaqItemsResponseType = CommonResponseFields & {
    faqItems: Array<FaqType>
}

type AddFaqItemResponseType = GetFaqItemsResponseType

type UpdateFaqItemResponseType = GetFaqItemsResponseType

type DeleteFaqItemResponseType = GetFaqItemsResponseType

export const faqApi = {

    getFaqItems() {
        return instance.get<GetFaqItemsResponseType>('faq/')
            .then(response => response.data);
    },

    addFaqItem(values: FaqType) {
        return instance.post<AddFaqItemResponseType>('faq', values)
            .then(response => response.data);
    },

    updateFaqItem(id: string, values: any) {
        return instance.post<UpdateFaqItemResponseType>(`faq/${id}`, values)
            .then(response => response.data);
    },

    deleteFaqItem(id: string) {
        return instance.delete<DeleteFaqItemResponseType>(`faq/${id}`)
            .then(response => response.data);
    },
}
