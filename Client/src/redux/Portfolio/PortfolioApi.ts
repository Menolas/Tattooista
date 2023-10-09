import axios, { CreateAxiosDefaults } from 'axios'
import { GalleryItemType, TattooStyleType } from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'

const instance = axios.create({
    baseURL: SERVER_URL
} as CreateAxiosDefaults)

type AdminUpdateGalleryResponseType = {
    resultCode: number
    message?: string
    gallery: Array<GalleryItemType>
}

type DeleteGalleryItemResponseType = {
    resultCode: number
    message?: string
}

type GetGalleryItemsResponseType = {
    resultCode: number
    message?: string
    gallery: Array<GalleryItemType>
    totalCount: number
}

type GetTattooStylesResponseType = {
    resultCode: number
    message?: string
    tattooStyles: Array<TattooStyleType>
}

type AddTattooStylesResponseType = {
    resultCode: number
    message?: string
    tattooStyle: TattooStyleType
}

type EditTattooStyleResponseType = {
    resultCode: number
    message?: string
    tattooStyle: TattooStyleType
}

export const portfolioApi = {

    getTattooStyles() {
        return instance.get<GetTattooStylesResponseType>('tattooStyle/')
            .then(response => {
                return response.data
            })
    },

    addTattooStyle(
        values: FormData
    ) {
        return instance.post<AddTattooStylesResponseType>('tattooStyle/', values)
            .then(response => {
                return response.data
            })

    },

    editTattooStyle(
        id: string,
        values: FormData
    ) {
        return instance.post<EditTattooStyleResponseType>(`tattooStyle/${id}`, values)
            .then(response => {
                return response.data
            })

    },

    deleteTattooStyle(id: string) {
        return instance.delete(`tattooStyle/${id}`)
            .then(response => {
                return response.data
            })
    },

    getGalleryItems(
      style: string,
      currentPage: number,
      pageSize: number
    ) {
        return instance.get<GetGalleryItemsResponseType>(`gallery?&style=${style}&page=${currentPage}&limit=${pageSize}`)
            .then(response => {
                return response.data
            })
    },

    getArchivedGalleryItems(
        currentPage: number,
        pageSize: number
    ) {
        return instance.get<GetGalleryItemsResponseType>(`gallery/archive?&page=${currentPage}&limit=${pageSize}`)
            .then(response => {
                return response.data
            })
    },

    deleteGalleryItem(
      itemId: string
    ) {
        return instance.delete<DeleteGalleryItemResponseType>(`gallery/${itemId}`)
          .then(response => {
              return response.data
          })
    },

    deleteArchivedGalleryItem(
        itemId: string
    ) {
        return instance.delete<DeleteGalleryItemResponseType>(`gallery/archive/${itemId}`)
            .then(response => {
                return response.data
            })
    },

    adminUpdateGallery(style: string, gallery: FormData) {
        console.log(gallery)
        return instance.post<AdminUpdateGalleryResponseType>(`gallery/${style}`,
          gallery
        ).then(response => {
            //console.log(response.data + "API !!!!!!!")
            return response.data
        })
    },

    archiveGalleryItem(id: string) {
        return instance.post(`gallery/archive/${id}`)
            .then(response => {
                return response.data
            })
    },

    reactivateArchivedGalleryItem(id: string) {
        return instance.get(`gallery/archive/${id}`)
            .then(response => {
                return response.data
            })
    }
}
