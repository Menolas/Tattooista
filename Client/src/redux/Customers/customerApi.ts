import axios, { CreateAxiosDefaults } from 'axios'
import { CustomerType, ContactsType, ClientType } from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'
import { CustomersFilterType } from './customers-reducer'

const instance = axios.create({
  baseURL: SERVER_URL
} as CreateAxiosDefaults)

type GetCustomersResponseType = {
  resultCode: number
  customers: Array<CustomerType>
  totalCount: number
  message?: string
}

type TurnCustomerToClientResponseType = {
  resultCode: number
  client: ClientType
  message?: string
}

type ChangeCustomerStatusResponseType = {
  resultCode: number
  status: boolean
  message?: string
}

type AddCustomerResponseType = {
  resultCode: number
  customer: CustomerType
  message?: string
}

type DeleteCustomerResponseType = {
  resultCode: number
  message?: string
}

export const customersAPI = {

  getCustomers(
    currentPage: number,
    pageSize: number,
    filter: CustomersFilterType
  ) {
    return instance.get<GetCustomersResponseType>(`customers?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.status}`)
      .then(response => {
        return response.data
      })
  },

  getArchivedCustomers(
      currentPage: number,
      pageSize: number,
      filter: CustomersFilterType
  ) {
    return instance.get(`customers/archive?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&status=${filter.status}`)
        .then(response => {
          return response.data
        })
  },

  changeCustomerStatus(customerId: string, status: boolean) {
    return instance.patch<ChangeCustomerStatusResponseType>(`customers/status/${customerId}`, {status: status})
      .then(response => {
        return response.data
      })
  },

  deleteCustomer(customerId: string) {
    return instance.delete<DeleteCustomerResponseType>(`customers/${customerId}`)
      .then(response => {
        return response.data
      })
  },

  deleteArchivedCustomer(customerId: string) {
    console.log("it is a hit!!!!!!!!!!!!")
    return instance.delete<DeleteCustomerResponseType>(`customers/archive/${customerId}`)
        .then(response => {
          return response.data
        })
  },

  addCustomer(values: any) {
    return instance.post<AddCustomerResponseType>('customers', values)
      .then(response => {
        return response.data
      })
  },

  turnCustomerToClient(
    customerId: string,
    fullName: string,
    contacts: ContactsType | {}
  ) {
    return instance.post<TurnCustomerToClientResponseType>(`customers/customerToClient/${customerId}`, {
      fullName,
      contacts
    }).then(response => {
      console.log(response)
        return response.data
    })
  },

  archiveCustomer(
      customerId: string
  ) {
    console.log("it is a hit!!!!!")
    return instance.post(`customers/archive/${customerId}`)
        .then(response => {
          return response.data
        })
  },

  reactivateCustomer(
      customerId: string
  ) {
    return instance.get(`customers/archive/${customerId}`)
        .then(response => {
          return response.data
        })
  }
}
