import {AxiosRequestConfig} from "axios";
import {BookingType, SearchFilterType, CommonResponseFields} from "../../types/Types";
import {instance} from "../../http";

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
      currentPage: number,
      pageSize: number,
      filter: SearchFilterType,
  ) {
    return await instance.get<GetArchivedBookingsResponseType>(
        `bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  async deleteArchivedBooking(id: string) {
    return await instance.delete<DeleteBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },

  async reactivateBooking(
      id: string
  ) {
    return await instance.get<ReactivateBookingResponseType>(`bookings/reactivate/${id}`)
        .then(response => response.data);
  }
}
