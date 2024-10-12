import {AxiosRequestConfig} from "axios";
import {
  AddConsultationFormValues,
  BookingType,
  SearchFilterType,
  CommonResponseFields,
  BookConsultationFormValues
} from "../../types/Types";
import $api from "../../http";

type DeleteBookingResponseType = CommonResponseFields;

type TurnBookingToClientResponseType = CommonResponseFields;

type GetBookingsResponseType = CommonResponseFields & {
  bookings: Array<BookingType>;
  totalCount: number;
};

type ChangeBookingStatusResponseType = CommonResponseFields & {
  status: boolean;
};

type AddBookingResponseType = CommonResponseFields & {
  booking: BookingType;
};

type ArchiveBookingResponseType = AddBookingResponseType;

export const bookingsApi = {

  async getBookings(
    token: string | null,
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
  ) {
    return await $api.get<GetBookingsResponseType>(
        `bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  async getBookingProfile(bookingId: string) {
    return await $api.get<AddBookingResponseType>(`bookings/${bookingId}`)
        .then(response => response.data);
  },

  async changeConsultationStatus(id: string) {
    return await $api.patch<ChangeBookingStatusResponseType>(`bookings/status/${id}`)
      .then(response => response.data);
  },

  async deleteConsultation(id: string) {
    return await $api.delete<DeleteBookingResponseType>(`bookings/${id}`)
      .then(response => response.data);
  },

  async addConsultation(values: AddConsultationFormValues | BookConsultationFormValues) {
    return await $api.post<AddBookingResponseType>(`bookings`, values)
        .then(response => response.data);
  },

  async turnBookingToClient(
    id: string,
  ) {
    return await $api.get<TurnBookingToClientResponseType>(`bookings/bookingToClient/${id}`)
        .then(response => response.data);
  },

  async archiveBooking(
      id: string,
  ) {
    return await $api.get<ArchiveBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },
};
