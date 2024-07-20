import {instance} from "../../http";
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
        const response = await instance.get<GetFaqItemsResponseType>('faq/');
        return response.data;
    },

    async addFaqItem(values: UpdateFaqValues) {
        const response = await instance.post<AddFaqItemResponseType>('faq', values);
        return response.data;
    },

    async updateFaqItem(id: string, values: UpdateFaqValues) {
        const response = await instance.post<UpdateFaqItemResponseType>(`faq/${id}`, values);
        return response.data;
    },

    async deleteFaqItem(id: string) {
        const response = await instance.delete<DeleteFaqItemResponseType>(`faq/${id}`);
        return response.data;
    },
};
