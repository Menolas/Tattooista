import $api from "../../http";
import {PageType, CommonResponseFields} from "../../types/Types";

export type GetPagesResponseType = CommonResponseFields & {
    page: PageType;
}

type EditAboutPageResponseType = GetPagesResponseType;

type ChangeAboutPageVisibilityResponseType = GetPagesResponseType;

export const aboutApi = {

    async getAboutPage() {
        return await $api.get<GetPagesResponseType>('pages/about')
            .then(response => response.data);
    },

    async editAboutPage(
        token: string | null,
        values: FormData
    ) {
        return await $api.post<EditAboutPageResponseType>(
            `pages/about`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async changeAboutPageVisibility(
        token: string | null,
        isActive: boolean
    ) {
        return await $api.patch<ChangeAboutPageVisibilityResponseType>(
            `pages/visibility/about`,
            {isActive: isActive},
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },
};
