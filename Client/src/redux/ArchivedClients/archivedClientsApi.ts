import axios, {CreateAxiosDefaults} from "axios";
import {ClientType, SearchFilterType, CommonResponseFields} from "../../types/Types";
import {API_URL} from "../../http";

const instance = axios.create({
  withCredentials: false,
  baseURL: API_URL
} as CreateAxiosDefaults)

type DeleteClientResponseType = CommonResponseFields

type ReactivateClientResponseType = CommonResponseFields

type GetClientsResponseType = CommonResponseFields & {
    clients: Array<ClientType>,
    totalCount: number
}

export const archivedClientsAPI = {

  getArchivedClients(
      currentPage = 1,
      pageSize = 5,
      filter: SearchFilterType
  ) {
      return instance.get<GetClientsResponseType>(
          `clients/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}`)
          .then(response => response.data)
  },

  deleteArchivedClient(clientId: string) {
    return instance.delete<DeleteClientResponseType>(`clients/archive/${clientId}`)
        .then(response => response.data)
  },

  reactivateClient(
    clientId: string
  ) {
    return instance.get<ReactivateClientResponseType>(`clients/archive/${clientId}`)
        .then(response => response.data)
  }
}
