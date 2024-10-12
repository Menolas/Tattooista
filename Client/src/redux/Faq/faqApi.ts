import $api from "../../http";
import {FaqType, CommonResponseFields, UpdateFaqValues} from "../../types/Types";

type GetFaqItemsResponseType = CommonResponseFields & {
    faqItems: Array<FaqType>;
};

type UpdateFaqItemResponseType = CommonResponseFields & {
    faqItem: FaqType;
};

type AddFaqItemResponseType = UpdateFaqItemResponseType;

type DeleteFaqItemResponseType = CommonResponseFields;

export const faqApi = {

    async getFaqItems() {
        const response = await $api.get<GetFaqItemsResponseType>('faq/');
        return response.data;
    },

    async addFaqItem(values: UpdateFaqValues) {
        const response = await $api.post<AddFaqItemResponseType>('faq', values);
        return response.data;
    },

    async updateFaqItem(id: string, values: UpdateFaqValues) {
        const response = await $api.post<UpdateFaqItemResponseType>(`faq/${id}`, values);
        return response.data;
    },

    async deleteFaqItem(id: string) {
        const response = await $api.delete<DeleteFaqItemResponseType>(`faq/${id}`);
        return response.data;
    },
};
