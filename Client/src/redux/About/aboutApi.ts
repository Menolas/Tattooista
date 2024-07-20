import {instance} from "../../http";
import {PageType, CommonResponseFields} from "../../types/Types";

export type GetPagesResponseType = CommonResponseFields & {
    page: PageType;
}

type EditAboutPageResponseType = GetPagesResponseType;

type ChangeAboutPageVisibilityResponseType = GetPagesResponseType;

export const aboutApi = {

    async getAboutPage() {
        return await instance.get<GetPagesResponseType>('pages/about')
            .then(response => response.data);
    },

    async editAboutPage(values: FormData) {
        return await instance.post<EditAboutPageResponseType>(`pages/about`, values)
            .then(response => response.data);
    },

    async changeAboutPageVisibility(isActive: boolean) {
        return await instance.patch<ChangeAboutPageVisibilityResponseType>(`pages/visibility/about`, {isActive: isActive})
            .then(response => response.data);
    },
};
