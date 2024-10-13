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
        return  await $api.get<GetFaqItemsResponseType>('faq/')
            .then(response => response.data);
    },

    async addFaqItem(
        token: string | null,
        values: UpdateFaqValues
    ) {
        return await $api.post<AddFaqItemResponseType>(
            'faq',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async updateFaqItem(
        token: string | null,
        id: string,
        values: UpdateFaqValues
    ) {
        return await $api.post<UpdateFaqItemResponseType>(
            `faq/${id}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);

    },

    async deleteFaqItem(
        token: string | null,
        id: string
    ) {
        return $api.delete<DeleteFaqItemResponseType>(
            `faq/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);

    },
};
