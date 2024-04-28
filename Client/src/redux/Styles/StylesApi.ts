import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import { GalleryItemType, TattooStyleType } from "../../types/Types";
import {API_URL} from "../../http";
import {ACTIVE_TATTOO_STYLE_FALLBACK} from "../../utils/constants";

const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type AdminUpdateGalleryResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>
}

type DeleteGalleryItemResponseType = CommonResponseFields

type GetGalleryItemsResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>
    totalCount: number
}

type ArchiveGalleryItemResponseType = CommonResponseFields

type UpdateGalleryItemResponseType = CommonResponseFields & {
    galleryItem: GalleryItemType
}

type GetTattooStylesResponseType = CommonResponseFields & {
    tattooStyles: Array<TattooStyleType>
    noStyleLength: number
}

type AddTattooStylesResponseType = CommonResponseFields & {
    tattooStyle: TattooStyleType
}

type EditTattooStyleResponseType = AddTattooStylesResponseType

type DeleteTattooStyleResponseType = GetTattooStylesResponseType

type UpdateArchiveGalleryItemResponseType = CommonResponseFields & {
    archivedGalleryItem: GalleryItemType
}

type ReactivateArchivedGalleryItemResponseType = CommonResponseFields

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
