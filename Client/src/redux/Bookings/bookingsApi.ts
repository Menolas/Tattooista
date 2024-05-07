import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios";
import {
  AddConsultationFormValues,
  BookingType,
  ContactsType,
  SearchFilterType,
  CommonResponseFields,
  BookConsultationFormValues
} from "../../types/Types";
import $api, {API_URL} from "../../http";

const instance = axios.create({
  baseURL: API_URL
} as CreateAxiosDefaults);

type DeleteBookingResponseType = CommonResponseFields;

type TurnBookingToClientResponseType = CommonResponseFields;

type ArchiveBookingResponseType = CommonResponseFields;

type GetBookingsResponseType = CommonResponseFields & {
  bookings: Array<BookingType>;
  totalCount: number;
};

type ChangeBookingStatusResponseType = CommonResponseFields & {
  status: boolean;
};

type AddBookingResponseType = CommonResponseFields & {
  booking: BookingType
};

export const bookingsApi = {

  getBookings(
    token: string | null,
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
  ) {
    return instance.get<GetBookingsResponseType>(
        `${API_URL}/bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  changeConsultationStatus(id: string, status: boolean) {
    return instance.patch<ChangeBookingStatusResponseType>(`bookings/status/${id}`, {status: status})
      .then(response => response.data);
  },

  deleteConsultation(id: string) {
    return instance.delete<DeleteBookingResponseType>(`bookings/${id}`)
      .then(response => response.data);
  },

  deleteArchivedConsultation(id: string) {
    return instance.delete<DeleteBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },

  addConsultation(values: AddConsultationFormValues | BookConsultationFormValues) {
    return instance.post<AddBookingResponseType>(`${API_URL}/bookings`, values)
        .then(response => response.data);
  },

  turnBookingToClient(
    id: string,
  ) {
    return instance.get<TurnBookingToClientResponseType>(`bookings/bookingToClient/${id}`)
        .then(response => response.data);
  },

  archiveBooking(
      id: string,
  ) {
    return instance.post<ArchiveBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },
}
