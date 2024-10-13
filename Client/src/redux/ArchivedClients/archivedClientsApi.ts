import $api from "../../http";
import {ClientType, SearchFilterType, CommonResponseFields} from "../../types/Types";

type DeleteClientResponseType = CommonResponseFields;

type ReactivateClientResponseType = CommonResponseFields;

type GetClientsResponseType = CommonResponseFields & {
    clients: Array<ClientType>;
    totalCount: number;
};

export const archivedClientsAPI = {

    async getArchivedClients(
      token: string | null,
      currentPage = 1,
      pageSize = 5,
      filter: SearchFilterType
  ) {
      return await $api.get<GetClientsResponseType>(
          `clients/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}`,
          { headers: { Authorization: `Bearer ${token}` } }
      )
          .then(response => response.data);
  },

    async deleteArchivedClient(
        token: string | null,
        clientId: string
    ) {
    return await $api.delete<DeleteClientResponseType>(
        `clients/archive/${clientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
        .then(response => response.data);
  },

    async reactivateClient(
        token: string | null,
        clientId: string
  ) {
    return await $api.get<ReactivateClientResponseType>(
        `clients/reactivate/${clientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
        .then(response => response.data);
  }
};
