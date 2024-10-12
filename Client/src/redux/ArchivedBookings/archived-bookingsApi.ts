import {AxiosRequestConfig} from "axios";
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
      token: string,
      currentPage = 1,
      pageSize: number,
      filter: SearchFilterType,
  ) {
    return await $api.get<GetArchivedBookingsResponseType>(
        `bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  async deleteArchivedBooking(id: string) {
    return await $api.delete<DeleteBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },

  async reactivateBooking(
      id: string
  ) {
    return await $api.get<ReactivateBookingResponseType>(`bookings/reactivate/${id}`)
        .then(response => response.data);
  }
};
