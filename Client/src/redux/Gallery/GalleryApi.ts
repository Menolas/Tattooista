import {GalleryItemType, CommonResponseFields} from "../../types/Types";
import $api from "../../http";
import {ACTIVE_TATTOO_STYLE_FALLBACK} from "../../utils/constants";

type AdminUpdateGalleryResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>;
}

type ArchiveGalleryItemResponseType = CommonResponseFields;

type DeleteGalleryItemResponseType = CommonResponseFields;

type GetGalleryItemsResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>;
    totalCount: number;
};

type UpdateGalleryItemResponseType = CommonResponseFields & {
    galleryItem: GalleryItemType;
};

export const galleryApi = {

    async getGalleryItems(
      style = ACTIVE_TATTOO_STYLE_FALLBACK as string,
      currentPage: number,
      pageSize: number
    ) {
        return await $api.get<GetGalleryItemsResponseType>(
            `gallery?&style=${style}&page=${currentPage}&limit=${pageSize}`
        )
            .then(response => response.data);
    },

    async deleteGalleryItem(
        token: string | null,
      itemId: string
    ) {
        return await $api.delete<DeleteGalleryItemResponseType>(
            `gallery/${itemId}`,
            {headers: {Authorization: `Bearer ${token}`}}
        )
          .then(response => response.data);
    },

    async adminUpdateGallery(
        token: string | null,
        style: string,
        gallery: FormData
    ) {
        return await $api.post<AdminUpdateGalleryResponseType>(
            `gallery/${style}`,
            gallery,
            {headers: {Authorization: `Bearer ${token}`}}
        ).then(response => response.data);
    },

    async archiveGalleryItem(
        token: string | null,
        id: string) {
        return await $api.get<ArchiveGalleryItemResponseType>(
            `gallery/archive/${id}`,
            {headers: {Authorization: `Bearer ${token}`}}
        )
            .then(response => response.data);
    },

    async updateGalleryItem(
        token: string | null,
        id: string,
        values: object
    ) {
        return await $api.patch<UpdateGalleryItemResponseType>(
            `gallery/updateGalleryItem/${id}`,
            {values},
            {headers: {Authorization: `Bearer ${token}`}}
        )
            .then(response => response.data);
    },
};
