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
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async getBookingProfile(
      token: string | null,
      bookingId: string
  ) {
    return await $api.get<AddBookingResponseType>(
        `bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async changeConsultationStatus(
      token: string | null,
      id: string) {
    return await $api.patch<ChangeBookingStatusResponseType>(
        `bookings/status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async deleteConsultation(
      token: string | null,
      id: string) {
    return await $api.delete<DeleteBookingResponseType>(
        `bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async addConsultation(
      token: string | null,
      isAdmin: boolean,
      values: AddConsultationFormValues | BookConsultationFormValues
  ) {
    return await $api.post<AddBookingResponseType>(
        `bookings?&isAdmin=${isAdmin}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async turnBookingToClient(
    token: string | null,
    id: string,
  ) {
    return await $api.get<TurnBookingToClientResponseType>(
        `bookings/bookingToClient/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async archiveBooking(
      token: string | null,
      id: string,
  ) {
    return await $api.get<ArchiveBookingResponseType>(
        `bookings/archive/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },
};
