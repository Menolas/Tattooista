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

  getArchivedBookings(
      token: string,
      currentPage: number,
      pageSize: number,
      filter: SearchFilterType,
  ) {
    return instance.get<GetArchivedBookingsResponseType>(
        `bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data);
  },

  deleteArchivedBooking(id: string) {
    return instance.delete<DeleteBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  },

  reactivateBooking(
      id: string
  ) {
    return instance.get<ReactivateBookingResponseType>(`bookings/archive/${id}`)
        .then(response => response.data);
  }
}
