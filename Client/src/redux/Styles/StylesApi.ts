import {AxiosRequestConfig} from "axios";
import {StyleType, CommonResponseFields} from "../../types/Types";
import {instance} from "../../http";

type GetTattooStylesResponseType = CommonResponseFields & {
    tattooStyles: Array<StyleType>;
    noStyleLength: number;
}

type AddTattooStylesResponseType = CommonResponseFields & {
    tattooStyle: StyleType
}

type EditTattooStyleResponseType = AddTattooStylesResponseType;

type DeleteTattooStyleResponseType = GetTattooStylesResponseType;

export const stylesApi = {

    async getStyles(token: string | null) {
        const response = await instance.get<GetTattooStylesResponseType>('tattooStyle/',
            {headers: {Authorization: `Bearer ${token}`}} as AxiosRequestConfig
        );
        return response.data;
    },

    async addStyle(
        values: FormData
    ) {
        const response = await instance.post<AddTattooStylesResponseType>('tattooStyle/', values);
        return response.data;
    },

    async editStyle(
        id: string,
        values: FormData
    ) {
        const response = await instance.post<EditTattooStyleResponseType>(`tattooStyle/${id}`, values);
        return response.data;
    },

    async deleteStyle(id: string) {
        const response = await instance.delete<DeleteTattooStyleResponseType>(`tattooStyle/${id}`);
        return response.data;
    },
}
