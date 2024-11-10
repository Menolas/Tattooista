import {
  ClientType,
  SearchFilterType,
  CommonResponseFields,
} from "../../types/Types";
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
    console.log('filter', filter);
    console.log(`Request URL: http://localhost:3030/clients?page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}&isFavourite=${filter.isFavourite}`);

    return await $api.get<GetClientsResponseType>(
        `clients/all?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}&isFavourite=${filter.isFavourite}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async getClientProfile(
      token: string | null,
      clientId: string) {
    return await $api.get<GetClientProfileResponseType>(
        `clients/${clientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async updateClientGallery(
      token: string | null, clientId: string,
      values: FormData) {
    return await $api.post<UpdateClientResponseType>(
        `clients/updateGallery/${clientId}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async deleteClient(
      token: string | null,
      clientId: string) {
    return await $api.delete<DeleteClientResponseType>(
        `clients/${clientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async addClient(
    token: string | null,
    values: FormData,
  ) {
    return await $api.post<UpdateClientResponseType>(
        'clients',
        values,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data)
  },

  async editClient(
    token: string | null,
    clientId: string,
    values: FormData,
  ) {
     return await $api.post<UpdateClientResponseType>(
         `clients/edit/${clientId}`,
         values,
         { headers: { Authorization: `Bearer ${token}` } }
     ).then(response => response.data);
  },

  async toggleIsFavorite(
    token: string | null,
    clientId: string
  ) {
    return await $api.patch<UpdateClientResponseType>(
        `clients/favourite/${clientId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async deleteClientGalleryPicture(
      token: string | null,
      clientId: string,
      picture: string
  ) {
      return await $api.delete<DeleteClientGalleryPictureResponseType>(
          `clients/updateGallery/${clientId}?&picture=${picture}`,
          { headers: { Authorization: `Bearer ${token}` } }
      ).then(response => response.data);
  },

  async archiveClient(
      token: string | null,
      clientId: string
  ) {
      return await $api.get<ArchiveClientResponseType>(
          `clients/archive/${clientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      ).then(response => response.data);
  },
};
