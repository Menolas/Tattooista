import axios, { CreateAxiosDefaults } from "axios";
import {PageType,} from "../../types/Types";
import {API_URL} from "../../http";

const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults);

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type GetPagesResponseType = CommonResponseFields & {
    page: PageType
}

type EditAboutPageResponseType = GetPagesResponseType;

type ChangeAboutPageVisibilityResponseType = GetPagesResponseType;

export const aboutApi = {

    getAboutPage() {
        return instance.get<GetPagesResponseType>('pages/about')
            .then(response => response.data);
    },

    editAboutPage(values: FormData) {
        return instance.post<EditAboutPageResponseType>(`pages/about`, values)
            .then(response => response.data);
    },

    changeAboutPageVisibility(isActive: boolean) {
        return instance.patch<ChangeAboutPageVisibilityResponseType>(`pages/visibility/about`, {isActive: isActive})
            .then(response => response.data);
    },
}
