import {instance} from "../../http";
import {GalleryItemType, CommonResponseFields} from "../../types/Types";

type AdminUpdateGalleryResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>
}

type DeleteGalleryItemResponseType = CommonResponseFields

type GetGalleryItemsResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>
    totalCount: number
}

type UpdateArchiveGalleryItemResponseType = CommonResponseFields & {
    archivedGalleryItem: GalleryItemType
}

type ReactivateArchivedGalleryItemResponseType = CommonResponseFields

export const archivedGalleryApi = {

    getArchivedGalleryItems(
        currentPage: number,
        pageSize: number
    ) {
        return instance.get<GetGalleryItemsResponseType>(`gallery/archive?&page=${currentPage}&limit=${pageSize}`)
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

    updateArchiveGalleryItem(id: string, values: object) {
        return instance.patch<UpdateArchiveGalleryItemResponseType>(`gallery/updateArchivedGalleryItem/${id}`, {values})
            .then(response => response.data);
    },

    reactivateArchivedGalleryItem(id: string) {
        return instance.get<ReactivateArchivedGalleryItemResponseType>(`gallery/reactivate/${id}`)
            .then(response => response.data);
    }
}
