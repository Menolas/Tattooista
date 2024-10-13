import {BookingType, SearchFilterType, CommonResponseFields} from "../../types/Types";
import $api from "../../http";

type DeleteBookingResponseType = CommonResponseFields;

type ReactivateBookingResponseType = CommonResponseFields;

type GetBookingsResponseType = CommonResponseFields & {
  bookings: Array<BookingType>;
  totalCount: number;
};

type GetArchivedBookingsResponseType = GetBookingsResponseType;

export const archivedBookingsApi = {

  async getArchivedBookings(
      token: string | null,
      currentPage = 1,
      pageSize: number,
      filter: SearchFilterType,
  ) {
    return await $api.get<GetArchivedBookingsResponseType>(
        `bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },

  async deleteArchivedBooking(
      token: string | null,
      id: string
  ) {
    return await $api.delete<DeleteBookingResponseType>(
        `bookings/archive/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
        .then(response => response.data);
  },

  async reactivateBooking(
      token: string | null,
      id: string
  ) {
    return await $api.get<ReactivateBookingResponseType>(
        `bookings/reactivate/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
        .then(response => response.data);
  }
};
