import {instance} from "../../http";
import {ClientType, SearchFilterType, CommonResponseFields} from "../../types/Types";

type DeleteClientResponseType = CommonResponseFields;

type ReactivateClientResponseType = CommonResponseFields;

type GetClientsResponseType = CommonResponseFields & {
    clients: Array<ClientType>;
    totalCount: number;
};

export const archivedClientsAPI = {

    async getArchivedClients(
      currentPage = 1,
      pageSize = 5,
      filter: SearchFilterType
  ) {
      return await instance.get<GetClientsResponseType>(
          `clients/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&gallery=${filter.condition}`)
          .then(response => response.data);
  },

    async deleteArchivedClient(clientId: string) {
    return await instance.delete<DeleteClientResponseType>(`clients/archive/${clientId}`)
        .then(response => response.data);
  },

    async reactivateClient(
    clientId: string
  ) {
    return await instance.get<ReactivateClientResponseType>(`clients/archive/${clientId}`)
        .then(response => response.data);
  }
};
