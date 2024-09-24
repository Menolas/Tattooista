import {AxiosRequestConfig} from "axios";
import {
  AddConsultationFormValues,
  BookingType,
  SearchFilterType,
  CommonResponseFields,
  BookConsultationFormValues
} from "../../types/Types";
import {instance} from "../../http";

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
    return await instance.get<GetBookingsResponseType>(
        `bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  async changeConsultationStatus(id: string) {
    return await instance.patch<ChangeBookingStatusResponseType>(`bookings/status/${id}`)
      .then(response => response.data);
  },

  async deleteConsultation(id: string) {
    return await instance.delete<DeleteBookingResponseType>(`bookings/${id}`)
      .then(response => response.data);
  },

  async addConsultation(values: AddConsultationFormValues | BookConsultationFormValues) {
    return await instance.post<AddBookingResponseType>(`bookings`, values)
        .then(response => response.data);
  },

  async turnBookingToClient(
    id: string,
  ) {
    return await instance.get<TurnBookingToClientResponseType>(`bookings/bookingToClient/${id}`)
        .then(response => response.data);
  },

  async archiveBooking(
      id: string,
  ) {
    return await instance.get<ArchiveBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },
};
