import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import {AddConsultationFormValues, BookingType, ContactsType, SearchFilterType} from "../../types/Types";
import $api, {API_URL} from "../../http";

const instance = axios.create({
  baseURL: API_URL
} as CreateAxiosDefaults);

type CommonResponseFields = {
  resultCode: number;
  message?: string;
}

type DeleteConsultationResponseType = CommonResponseFields;

type TurnBookingToClientResponseType = CommonResponseFields;

type ArchiveConsultationResponseType = CommonResponseFields;

type GetBookedConsultationsResponseType = CommonResponseFields & {
  bookings: Array<BookingType>;
  totalCount: number;
};

type ChangeConsultationStatusResponseType = CommonResponseFields & {
  status: boolean;
};

type AddConsultationResponseType = CommonResponseFields & {
  booking: BookingType
};

export const bookingsApi = {

  getBookings(
    token: string | null,
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
  ) {
    return instance.get<GetBookedConsultationsResponseType>(
        `${API_URL}/bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  changeConsultationStatus(id: string, status: boolean) {
    return instance.patch<ChangeConsultationStatusResponseType>(`bookings/status/${id}`, {status: status})
      .then(response => response.data);
  },

  deleteConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/${id}`)
      .then(response => response.data);
  },

  deleteArchivedConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },

  addConsultation(values: AddConsultationFormValues) {
    return instance.post<AddConsultationResponseType>(`${API_URL}/bookings`, values)
        .then(response => response.data);
  },

  turnBookingToClient(
    id: string,
    fullName: string,
    contacts: ContactsType | {}
  ) {
    return instance.post<TurnBookingToClientResponseType>(`bookings/bookingToClient/${id}`, {
      fullName,
      contacts
    }).then(response => response.data);
  },

  archiveBooking(
      id: string
  ) {
    return instance.post<ArchiveConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },
}
