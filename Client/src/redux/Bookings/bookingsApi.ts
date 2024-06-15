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
        `bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
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

  addConsultation(values: AddConsultationFormValues | BookConsultationFormValues) {
    return instance.post<AddBookingResponseType>(`bookings`, values)
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
    return instance.get<ArchiveBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },
}
