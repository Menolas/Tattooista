import {GalleryItemType, CommonResponseFields} from "../../types/Types";
import {instance} from "../../http";
import {ACTIVE_TATTOO_STYLE_FALLBACK} from "../../utils/constants";

type AdminUpdateGalleryResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>
}

type ArchiveGalleryItemResponseType = CommonResponseFields;

type DeleteGalleryItemResponseType = CommonResponseFields;

type GetGalleryItemsResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>
    totalCount: number
}

type UpdateGalleryItemResponseType = CommonResponseFields & {
    galleryItem: GalleryItemType
}

export const galleryApi = {

    getGalleryItems(
      style = ACTIVE_TATTOO_STYLE_FALLBACK as string,
      currentPage: number,
      pageSize: number
    ) {
        return instance.get<GetGalleryItemsResponseType>(`gallery?&style=${style}&page=${currentPage}&limit=${pageSize}`)
            .then(response => response.data);
    },

    deleteGalleryItem(
      itemId: string
    ) {
        return instance.delete<DeleteGalleryItemResponseType>(`gallery/${itemId}`)
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
}
