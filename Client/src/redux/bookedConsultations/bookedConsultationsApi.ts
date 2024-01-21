import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios"
import {AddConsultationFormValues, BookedConsultationType, ContactsType} from "../../types/Types"
import $api, {API_URL} from "../../http"
import { BookedConsultationsFilterType } from "./bookedConsultations-reducer"

const instance = axios.create({
  baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
  resultCode: number
  message?: string
}

type DeleteConsultationResponseType = CommonResponseFields

type TurnConsultationToClientResponseType = CommonResponseFields

type ArchiveConsultationResponseType = CommonResponseFields

type ReactivateConsultationResponseType = CommonResponseFields

type GetBookedConsultationsResponseType = CommonResponseFields & {
  bookings: Array<BookedConsultationType>
  totalCount: number
}

type GetArchivedConsultationsResponseType = GetBookedConsultationsResponseType

type ChangeConsultationStatusResponseType = CommonResponseFields & {
  status: boolean
}

type AddConsultationResponseType = CommonResponseFields & {
  booking: BookedConsultationType
}

export const bookedConsultationsAPI = {

  getBookedConsultations(
    token: string | null,
    currentPage: number,
    pageSize: number,
    filter: BookedConsultationsFilterType
  ) {
    return instance.get<GetBookedConsultationsResponseType>(
        `${API_URL}/bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data)
  },

  // getBookedConsultationsWithoutToken(
  //     currentPage: number,
  //     pageSize: number,
  //     filter: BookedConsultationsFilterType
  // ) {
  //   return $api.get<GetBookedConsultationsResponseType>(
  //       `${API_URL}/bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
  //       {withCredentials: true}
  //   ).then(response => response.data)
  // },

  getArchivedConsultations(
      token: string,
      currentPage: number,
      pageSize: number,
      filter: BookedConsultationsFilterType
  ) {
    return instance.get<GetArchivedConsultationsResponseType>(`bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`,
        { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig
    ).then(response => response.data)
  },

  changeConsultationStatus(id: string, status: boolean) {
    return instance.patch<ChangeConsultationStatusResponseType>(`bookings/status/${id}`, {status: status})
      .then(response => response.data)
  },

  deleteConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/${id}`)
      .then(response => response.data)
  },

  deleteArchivedConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data)
  },

  addConsultation(values: AddConsultationFormValues) {
    return instance.post<AddConsultationResponseType>(`${API_URL}/bookings`, values)
        .then(response => response.data)
  },

  turnConsultationToClient(
    id: string,
    fullName: string,
    contacts: ContactsType | {}
  ) {
    return instance.post<TurnConsultationToClientResponseType>(`bookings/bookingToClient/${id}`, {
      fullName,
      contacts
    }).then(response => response.data)
  },

  archiveConsultation(
      id: string
  ) {
    return instance.post<ArchiveConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data)
  },

  reactivateConsultation(
      id: string
  ) {
    return instance.get<ReactivateConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => response.data)
  }
}
