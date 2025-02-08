import {StyleType, CommonResponseFields} from "../../types/Types";
import $api from "../../http";

type GetTattooStylesResponseType = CommonResponseFields & {
    tattooStyles: Array<StyleType>;
    noStyleLength: number;
};

type AddTattooStylesResponseType = CommonResponseFields & {
    tattooStyle: StyleType;
};

type EditTattooStyleResponseType = AddTattooStylesResponseType;

type DeleteTattooStyleResponseType = CommonResponseFields;

export const stylesApi = {

    async getStyles(
        token: string | null = null,
        isSlider?: boolean
    ) {
        const response = await $api.get<GetTattooStylesResponseType>(`tattooStyle/?&isSlider=${isSlider}`,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    },

    async addStyle(
        token: string | null,
        values: FormData
    ) {
        const response = await $api.post<AddTattooStylesResponseType>(
            'tattooStyle/',
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    },

    async editStyle(
        token: string | null,
        id: string,
        values: FormData
    ) {
        const response = await $api.post<EditTattooStyleResponseType>(
            `tattooStyle/${id}`,
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    },

    async deleteStyle(
        token: string | null,
        id: string
    ) {
        const response = await $api.delete<DeleteTattooStyleResponseType>(
            `tattooStyle/${id}`,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    },
};
