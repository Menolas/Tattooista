import {instance} from "../../http";
import {PageType, CommonResponseFields} from "../../types/Types";

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
