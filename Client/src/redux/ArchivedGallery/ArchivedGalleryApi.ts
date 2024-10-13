import $api from "../../http";
import {GalleryItemType, CommonResponseFields} from "../../types/Types";

type DeleteGalleryItemResponseType = CommonResponseFields;

type GetGalleryItemsResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>;
    totalCount: number;
}

type UpdateArchiveGalleryItemResponseType = CommonResponseFields & {
    archivedGalleryItem: GalleryItemType;
}

type ReactivateArchivedGalleryItemResponseType = CommonResponseFields;

export const archivedGalleryApi = {

    async getArchivedGalleryItems(
        token: string | null,
        currentPage: number,
        pageSize: number
    ) {
        return await $api.get<GetGalleryItemsResponseType>(
            `gallery/archive?&page=${currentPage}&limit=${pageSize}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async deleteArchivedGalleryItem(
        token: string | null,
        itemId: string
    ) {
        return await $api.delete<DeleteGalleryItemResponseType>(
            `gallery/archive/${itemId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async updateArchivedGalleryItem(
        token: string | null,
        id: string,
        values: object
    ) {
        return await $api.patch<UpdateArchiveGalleryItemResponseType>(
            `gallery/updateArchivedGalleryItem/${id}`,
            {values},
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async reactivateArchivedGalleryItem(
        token: string | null,
        id: string
    ) {
        return await $api.get<ReactivateArchivedGalleryItemResponseType>(
            `gallery/reactivate/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    }
};
