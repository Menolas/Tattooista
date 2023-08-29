import axios, {CreateAxiosDefaults} from 'axios'
import {ClientType, AddClientFormValues } from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'
import {ClientsFilterType} from "./clients-reducer";

const instance = axios.create({
  withCredentials: false,
  baseURL: SERVER_URL
} as CreateAxiosDefaults)

type GetClientsResponseType = {
    resultCode: number,
    clients: Array<ClientType>,
    totalCount: number
}

type DeleteClientResponseType = {
  resultCode: number,
  message?: string
}

type UpdateClientResponseType = {
  client: ClientType
  resultCode: number,
  message?: string
}

export const clientsAPI = {

  getClients(
    currentPage = 1,
    pageSize = 5,
    filter: ClientsFilterType
  ) {
    return instance.get<GetClientsResponseType>(`clients?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.gallery}`)
        .then(response => {
          return response.data
        })
  },

  getArchivedClients(
      currentPage = 1,
      pageSize = 5,
      filter: ClientsFilterType
  ) {
      return instance.get<GetClientsResponseType>(`clients/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.gallery}`)
          .then(response => {
              return response.data
          })
  },

  getClientProfile(clientId: string) {
    return instance.get<ClientType>(`clients/${clientId}`)
        .then(response => {
            return response.data
        })
  },

  updateClientGallery(clientId: string, values: FormData) {
    return instance.post<UpdateClientResponseType>(`clients/updateGallery/${clientId}`,
        values
    ).then(response => {
        return response.data
    })
  },

  deleteClient(clientId: string) {
    return instance.delete<DeleteClientResponseType>(`clients/${clientId}`)
        .then(response => {
          return response.data
        })
  },

  deleteArchivedClient(clientId: string) {
    return instance.delete<DeleteClientResponseType>(`clients/archive/${clientId}`)
        .then(response => {
            return response.data
        })
  },

  addClient(
    values: FormData,
    //values: AddClientFormValues
  ) {
    return instance.post<UpdateClientResponseType>('clients', values)
      .then(response => {
        return response.data
      })
  },

  editClient(
    clientId: string,
    values: FormData,
  ) {
     return instance.post<UpdateClientResponseType>(`clients/edit/${clientId}`, values)
        .then(response => {
            return response.data
        })
  },

  deleteClientGalleryPicture(
      clientId: string,
      picture: string
  ) {
      return instance.delete(`clients/updateGallery/${clientId}?&picture=${picture}`)
          .then(response => {
              return response.data
          })
  },

  archiveClient(
      clientId: string
  ) {
      return instance.post(`clients/archive/${clientId}`)
          .then(response => {
              return response.data
          })
  },

  reactivateClient(
    clientId: string
  ) {
    return instance.get(`clients/archive/${clientId}`)
        .then(response => {
            return response.data
        })
  }
}
