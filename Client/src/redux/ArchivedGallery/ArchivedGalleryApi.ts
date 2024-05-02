import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import {GalleryItemType} from "../../types/Types";
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

type UpdateArchiveGalleryItemResponseType = CommonResponseFields & {
    archivedGalleryItem: GalleryItemType
}

type ReactivateArchivedGalleryItemResponseType = CommonResponseFields

export const archivedGalleryApi = {

    getGalleryItems(
      style = ACTIVE_TATTOO_STYLE_FALLBACK as string,
      currentPage: number,
      pageSize: number
    ) {
        return instance.get<GetGalleryItemsResponseType>(`gallery?&style=${style}&page=${currentPage}&limit=${pageSize}`)
            .then(response => response.data);
    },

    getArchivedGalleryItems(
        currentPage: number,
        pageSize: number
    ) {
        return instance.get<GetGalleryItemsResponseType>(`gallery/archive?&page=${currentPage}&limit=${pageSize}`)
            .then(response => response.data);
    },

    deleteGalleryItem(
      itemId: string
    ) {
        return instance.delete<DeleteGalleryItemResponseType>(`gallery/${itemId}`)
          .then(response => response.data);
    },

    deleteArchivedGalleryItem(
        itemId: string
    ) {
        return instance.delete<DeleteGalleryItemResponseType>(`gallery/archive/${itemId}`)
            .then(response => response.data);
    },

    adminUpdateGallery(style: string, gallery: FormData) {
        return instance.post<AdminUpdateGalleryResponseType>(`gallery/${style}`,
          gallery
        ).then(response => response.data);
    },

    archiveGalleryItem(id: string) {
        return instance.post<ArchiveGalleryItemResponseType>(`gallery/archive/${id}`)
            .then(response => response.data);
    },

    updateGalleryItem(id: string, values: object) {
        return instance.patch<UpdateGalleryItemResponseType>(`gallery/updateGalleryItem/${id}`, {values})
            .then(response => response.data);
    },

    updateArchiveGalleryItem(id: string, values: object) {
        return instance.patch<UpdateArchiveGalleryItemResponseType>(`gallery/updateArchivedGalleryItem/${id}`, {values})
            .then(response => response.data);
    },

    reactivateArchivedGalleryItem(id: string) {
        return instance.get<ReactivateArchivedGalleryItemResponseType>(`gallery/reactivate/${id}`)
            .then(response => response.data);
    }
}
