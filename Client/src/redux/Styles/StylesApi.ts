import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import {StyleType} from "../../types/Types";
import {API_URL} from "../../http";

const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults);

type CommonResponseFields = {
    resultCode: number;
    message?: string;
}

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

    getTattooStyles(token: string | null) {
        return instance.get<GetTattooStylesResponseType>('tattooStyle/',
            { headers: {Authorization: `Bearer ${token}`}} as AxiosRequestConfig
            ).then(response => response.data);
    },

    addTattooStyle(
        values: FormData
    ) {
        return instance.post<AddTattooStylesResponseType>('tattooStyle/', values)
            .then(response => response.data);

    },

    editTattooStyle(
        id: string,
        values: FormData
    ) {
        return instance.post<EditTattooStyleResponseType>(`tattooStyle/${id}`, values)
            .then(response => response.data);

    },

    deleteTattooStyle(id: string) {
        return instance.delete<DeleteTattooStyleResponseType>(`tattooStyle/${id}`)
            .then(response => response.data);
    },
}
