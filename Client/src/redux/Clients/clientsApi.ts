import {AxiosRequestConfig} from "axios";
import {ClientType, SearchFilterType, CommonResponseFields,} from "../../types/Types";
import $api from "../../http";

type DeleteClientResponseType = CommonResponseFields;

type GetClientsResponseType = CommonResponseFields & {
    clients: Array<ClientType>;
    totalCount: number;
};

type UpdateClientResponseType = CommonResponseFields & {
  client: ClientType;
};

type ArchiveClientResponseType = UpdateClientResponseType;

type GetClientProfileResponseType = UpdateClientResponseType;

type DeleteClientGalleryPictureResponseType = UpdateClientResponseType;

export const clientsAPI = {

  async getClients(
    token: string | null,
    currentPage = 1,
    pageSize = 5,
    filter: SearchFilterType
  ) {
    return await $api.get<GetClientsResponseType>(
        `clients?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}&isFavourite=${filter.isFavourite}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig)
            .then(response => response.data);
  },

  async getClientProfile(clientId: string) {
    return await $api.get<GetClientProfileResponseType>(`clients/${clientId}`)
        .then(response => response.data);
  },

  async updateClientGallery(clientId: string, values: FormData) {
    return await $api.post<UpdateClientResponseType>(`clients/updateGallery/${clientId}`,
        values
    ).then(response => response.data);
  },

  async deleteClient(clientId: string) {
    return await $api.delete<DeleteClientResponseType>(`clients/${clientId}`)
        .then(response => response.data);
  },

  async addClient(
    values: FormData,
  ) {
    return await $api.post<UpdateClientResponseType>('clients', values)
      .then(response => response.data)
  },

  async editClient(
    clientId: string,
    values: FormData,
  ) {
     return await $api.post<UpdateClientResponseType>(`clients/edit/${clientId}`, values)
        .then(response => response.data);
  },

  async toggleIsFavorite(
    clientId: string
  ) {
    return await $api.patch<UpdateClientResponseType>(`clients/favourite/${clientId}`)
        .then(response => response.data);
  },

  async deleteClientGalleryPicture(
      clientId: string,
      picture: string
  ) {
      return await $api.delete<DeleteClientGalleryPictureResponseType>(`clients/updateGallery/${clientId}?&picture=${picture}`)
          .then(response => response.data);
  },

  async archiveClient(
      clientId: string
  ) {
      return await $api.post<ArchiveClientResponseType>(`clients/archive/${clientId}`)
          .then(response => response.data);
  },
};
