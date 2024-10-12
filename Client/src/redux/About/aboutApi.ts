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

    async editAboutPage(values: FormData) {
        return await $api.post<EditAboutPageResponseType>(`pages/about`, values)
            .then(response => response.data);
    },

    async changeAboutPageVisibility(isActive: boolean) {
        return await $api.patch<ChangeAboutPageVisibilityResponseType>(`pages/visibility/about`, {isActive: isActive})
            .then(response => response.data);
    },
};
