import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import {AddConsultationFormValues, BookedConsultationType, ContactsType, SearchFilterType} from "../../types/Types";
import $api, {API_URL} from "../../http";

const instance = axios.create({
  baseURL: API_URL
} as CreateAxiosDefaults);

type CommonResponseFields = {
  resultCode: number;
  message?: string;
}

type DeleteConsultationResponseType = CommonResponseFields;

type ReactivateConsultationResponseType = CommonResponseFields;

type GetBookedConsultationsResponseType = CommonResponseFields & {
  bookings: Array<BookedConsultationType>;
  totalCount: number;
};

type GetArchivedConsultationsResponseType = GetBookedConsultationsResponseType;

export const archivedBookingsApi = {

  getArchivedConsultations(
      token: string,
      currentPage: number,
      pageSize: number,
      filter: SearchFilterType,
  ) {
    return instance.get<GetArchivedConsultationsResponseType>(`bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  deleteArchivedConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },

  reactivateConsultation(
      id: string
  ) {
    return instance.get<ReactivateConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  }
}
