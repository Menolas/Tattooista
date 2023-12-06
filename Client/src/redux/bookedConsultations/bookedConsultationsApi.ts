import axios, { CreateAxiosDefaults } from 'axios'
import { BookedConsultationType, ContactsType, ClientType } from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'
import { BookedConsultationsFilterType } from './bookedConsultations-reducer'

const instance = axios.create({
  baseURL: SERVER_URL
} as CreateAxiosDefaults)

type GetBookedConsultationsResponseType = {
  resultCode: number
  bookings: Array<BookedConsultationType>
  totalCount: number
  page: number
  message?: string
}

type TurnConsultationToClientResponseType = {
  resultCode: number
  client: ClientType
  message?: string
}

type ChangeConsultationStatusResponseType = {
  resultCode: number
  status: boolean
  message?: string
}

type AddConsultationResponseType = {
  resultCode: number
  booking: BookedConsultationType
  message?: string
}

type DeleteConsultationResponseType = {
  resultCode: number
  message?: string
}

export const bookedConsultationsAPI = {

  getBookedConsultations(
    currentPage: number,
    pageSize: number,
    filter: BookedConsultationsFilterType
  ) {
    return instance.get<GetBookedConsultationsResponseType>(`bookings?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.status}`)
      .then(response => {
        return response.data
      })
  },

  getArchivedConsultations(
      currentPage: number,
      pageSize: number,
      filter: BookedConsultationsFilterType
  ) {
    return instance.get(`bookings/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.status}`)
        .then(response => {
          return response.data
        })
  },

  changeConsultationStatus(id: string, status: boolean) {
    return instance.patch<ChangeConsultationStatusResponseType>(`bookings/status/${id}`, {status: status})
      .then(response => {
        return response.data
      })
  },

  deleteConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/${id}`)
      .then(response => {
        return response.data
      })
  },

  deleteArchivedConsultation(id: string) {
    return instance.delete<DeleteConsultationResponseType>(`bookings/archive/${id}`)
        .then(response => {
          return response.data
        })
  },

  addConsultation(values: any) {
    return instance.post<AddConsultationResponseType>('bookings', values)
      .then(response => {
        return response.data
      })
  },

  turnConsultationToClient(
    id: string,
    fullName: string,
    contacts: ContactsType | {}
  ) {
    return instance.post<TurnConsultationToClientResponseType>(`bookings/bookingToClient/${id}`, {
      fullName,
      contacts
    }).then(response => {
      //console.log(response)
        return response.data
    })
  },

  archiveConsultation(
      id: string
  ) {
    return instance.post(`bookings/archive/${id}`)
        .then(response => {
          return response.data
        })
  },

  reactivateConsultation(
      id: string
  ) {
    return instance.get(`bookings/archive/${id}`)
        .then(response => {
          return response.data
        })
  }
}
