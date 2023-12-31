import axios, { CreateAxiosDefaults } from "axios"
import { BookedConsultationType, ContactsType } from "../../types/Types"
import {API_URL} from "../../http"
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
    currentPage: number,
    pageSize: number,
    filter: BookedConsultationsFilterType
  ) {
    return instance.get<GetBookedConsultationsResponseType>(`bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`)
      .then(response => response.data)
  },

  getArchivedConsultations(
      currentPage: number,
      pageSize: number,
      filter: BookedConsultationsFilterType
  ) {
    return instance.get<GetArchivedConsultationsResponseType>(`bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.condition}`)
        .then(response => response.data)
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

  addConsultation(values: any) {
    return instance.post<AddConsultationResponseType>('bookings', values)
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
