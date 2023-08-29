import { customersAPI } from './customerApi'
import { ResultCodesEnum } from '../../utils/constants'
import { CustomerType } from '../../types/Types'
import { AppStateType } from '../redux-store'
import { ThunkAction } from 'redux-thunk'
import type {} from 'redux-thunk/extend-redux'

const SET_CUSTOMERS_PAGE_SIZE = 'SET_CUSTOMERS_PAGE_SIZE'
const SET_ARCHIVED_CUSTOMERS_PAGE_SIZE = 'SET_ARCHIVED_CUSTOMERS_PAGE_SIZE'
const SET_CUSTOMERS_FILTER = 'SET_CUSTOMERS_FILTER'
const SET_ARCHIVED_CUSTOMERS_FILTER = 'SET_ARCHIVED_CUSTOMERS_FILTER'
const SET_CUSTOMER_STATUS = 'SET_CUSTOMER_STATUS'
const SET_CUSTOMERS = 'SET_CUSTOMERS'
const SET_ARCHIVED_CUSTOMERS = 'SET_ARCHIVED_CUSTOMERS'
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
const SET_CURRENT_PAGE_FOR_ARCHIVED_CUSTOMERS = 'SET_CURRENT_PAGE_FOR_ARCHIVED_CUSTOMERS'
const SET_TOTAL_CUSTOMERS_COUNT = 'SET_TOTAL_CUSTOMERS_COUNT'
const SET_TOTAL_ARCHIVED_CUSTOMERS_COUNT = 'SET_TOTAL_ARCHIVED_CUSTOMERS_COUNT'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS = 'TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS'
const TOGGLE_IS_CUSTOMER_DELETING_IN_PROCESS = 'TOGGLE_IS_CUSTOMER_DELETING_IN_PROCESS'
const DELETE_CUSTOMER = 'DELETE_CUSTOMER'
const DELETE_ARCHIVED_CUSTOMER = 'DELETE_ARCHIVED_CUSTOMER'
const ADD_CUSTOMER = 'ADD_CUSTOMER'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'

let initialState = {
  customers: [] as Array<CustomerType>,
  archivedCustomers: [] as Array<CustomerType>,
  totalCustomersCount: 0 as number,
  totalArchivedCustomersCount: 0 as number,
  customersPageSize: 5 as number,
  archivedCustomersPageSize: 5 as number,
  currentCustomersPage: 1 as number,
  currentArchivedCustomersPage: 1 as number,
  customersIsFetching: false,
  isStatusChanging: [] as Array<string>,
  isCustomerDeletingInProcess: [] as Array<string>,
  customersFilter: {
    term: '' as string | null,
    status: 'null' as string | null
  },
  archivedCustomersFilter: {
    term: '' as string | null,
    status: 'null' as string | null
  },
  isSuccess: false as boolean
}

export type InitialStateType = typeof initialState
export type CustomersFilterType = typeof initialState.customersFilter

export const customersReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_CUSTOMERS_PAGE_SIZE:
      return {
        ...state,
        customersPageSize: action.pageSize
      }

    case SET_ARCHIVED_CUSTOMERS_PAGE_SIZE:
      return {
        ...state,
        archivedCustomersPageSize: action.pageSize
      }

    case SET_CUSTOMERS_FILTER:
      return {
        ...state,
        customersFilter: action.filter
      }

    case SET_ARCHIVED_CUSTOMERS_FILTER:
      return {
        ...state,
        archivedCustomersFilter: action.filter
      }

    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.customers,
      }

    case SET_ARCHIVED_CUSTOMERS:
      return {
        ...state,
        archivedCustomers: action.archivedCustomers
      }
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentCustomersPage: action.currentPage,
      }

    case SET_CURRENT_PAGE_FOR_ARCHIVED_CUSTOMERS:
      return {
        ...state,
        currentArchivedCustomersPage: action.currentPage
      }

    case SET_TOTAL_CUSTOMERS_COUNT:
      return {
        ...state,
        totalCustomersCount: action.count,
      }

    case SET_TOTAL_ARCHIVED_CUSTOMERS_COUNT:
      return {
        ...state,
        totalArchivedCustomersCount: action.count
      }
    case SET_CUSTOMER_STATUS:
      return {
        ...state,
        customers: state.customers.map(customer => {
          if (customer._id === action.customerId) {
            return { ...customer, status: action.status }
          }
          return customer
        })
      }
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        customersIsFetching: action.isFetching,
      }
    case TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS:
      return {
        ...state,
        isStatusChanging: action.isFetching
          ? [...state.isStatusChanging, action.customerId]
          : state.isStatusChanging.filter(id => id !== action.customerId)
      }
    case TOGGLE_IS_CUSTOMER_DELETING_IN_PROCESS:
      return {
        ...state,
        isCustomerDeletingInProcess: action.isFetching
          ? [...state.isCustomerDeletingInProcess, action.customerId]
          : state.isCustomerDeletingInProcess.filter(id => id !== action.customerId)
      }
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.customerId)
      }

    case DELETE_ARCHIVED_CUSTOMER:
      return {
        ...state,
        archivedCustomers: state.archivedCustomers.filter(customer => customer._id !== action.customerId)
      }

    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, {...action.customer}]
      }

    case SET_IS_SUCCESS:
      console.log(state.isSuccess)
      return {
        ...state,
        isSuccess: action.isSuccess
      }

    default: return state
  }
}

type ActionsTypes = SetIsSuccessAT | SetCustomersPageSizeActionType | SetArchivedCustomersPageSizeAT |
    SetCustomersFilterActionType | SetArchivedCustomersFilterAT
    | SetCustomersActionType | SetArchivedCustomersAT | SetCurrentPageActionType |
    SetCurrentPageForArchivedCustomersAT | SetCustomersTotalCountActionType | SetArchivedCustomersTotalCountAT |
    ChangeCustomerStatusActionType | SetIsFetchingActionType | ToggleIsStatusChangingActionType |
    ToggleIsCustomerDeletingInProcessActionType | DeleteCustomerActionType | DeleteArchivedCustomerAT | AddCustomerActionType

// actions creators

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  isSuccess: boolean
}

export const setIsSuccessAC = (isSuccess: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, isSuccess
})

type SetCustomersPageSizeActionType = {
  type: typeof  SET_CUSTOMERS_PAGE_SIZE
  pageSize: number
}

export const setCustomersPageSize = (pageSize: number): SetCustomersPageSizeActionType => ({
    type: SET_CUSTOMERS_PAGE_SIZE, pageSize
})

type SetArchivedCustomersPageSizeAT = {
  type: typeof SET_ARCHIVED_CUSTOMERS_PAGE_SIZE
  pageSize: number
}

export const setArchivedCustomersPageSizeAC = (pageSize: number) => ({
  type: SET_ARCHIVED_CUSTOMERS_PAGE_SIZE, pageSize
})

type SetCustomersFilterActionType = {
  type: typeof  SET_CUSTOMERS_FILTER
  filter: CustomersFilterType
}

const setCustomersFilter = (filter: CustomersFilterType): SetCustomersFilterActionType => ({
    type: SET_CUSTOMERS_FILTER, filter
  })

type SetArchivedCustomersFilterAT = {
  type: typeof SET_ARCHIVED_CUSTOMERS_FILTER
  filter: CustomersFilterType
}

export const setArchivedCustomersFilterAC = (filter: CustomersFilterType): SetArchivedCustomersFilterAT => ({
  type: SET_ARCHIVED_CUSTOMERS_FILTER, filter
})

type SetCustomersActionType = {
  type: typeof SET_CUSTOMERS,
  customers: Array<CustomerType>
}

const setCustomers = (customers: Array<CustomerType>): SetCustomersActionType => ({
      type: SET_CUSTOMERS, customers
})

type SetArchivedCustomersAT = {
  type: typeof SET_ARCHIVED_CUSTOMERS,
  archivedCustomers: Array<CustomerType>
}

const setArchivedCustomersAC = (archivedCustomers: Array<CustomerType>): SetArchivedCustomersAT => ({
  type: SET_ARCHIVED_CUSTOMERS, archivedCustomers
})

type SetCurrentPageActionType = {
  type: typeof SET_CURRENT_PAGE,
  currentPage: number
}

export const setCurrentPageAC = (currentPage: number): SetCurrentPageActionType => ({
      type: SET_CURRENT_PAGE, currentPage
})

type SetCurrentPageForArchivedCustomersAT = {
  type: typeof SET_CURRENT_PAGE_FOR_ARCHIVED_CUSTOMERS,
  currentPage: number
}

export const SetCurrentPageForArchivedCustomersAC = (currentPage: number) => ({
  type: SET_CURRENT_PAGE_FOR_ARCHIVED_CUSTOMERS,currentPage
})

type SetCustomersTotalCountActionType = {
  type: typeof SET_TOTAL_CUSTOMERS_COUNT,
  count: number
}

const setCustomersTotalCount = (count: number): SetCustomersTotalCountActionType => (
    {
      type: SET_TOTAL_CUSTOMERS_COUNT, count
    }
)

type SetArchivedCustomersTotalCountAT = {
  type: typeof SET_TOTAL_ARCHIVED_CUSTOMERS_COUNT,
  count: number
}

const setTotalArchivedCustomersCountAC = (count: number): SetArchivedCustomersTotalCountAT => ({
  type: SET_TOTAL_ARCHIVED_CUSTOMERS_COUNT, count
})

type ChangeCustomerStatusActionType = {
  type: typeof SET_CUSTOMER_STATUS,
  customerId: string,
  status: boolean
}

const changeCustomerStatusAC = (customerId: string, status: boolean): ChangeCustomerStatusActionType => (
  {
    type: SET_CUSTOMER_STATUS, customerId, status
  }
)

type SetIsFetchingActionType = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetching = (isFetching: boolean): SetIsFetchingActionType => (
  {
    type: TOGGLE_IS_FETCHING, isFetching
  }
)

type ToggleIsStatusChangingActionType = {
  type: typeof TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS,
  isFetching: boolean,
  customerId: string
}

const toggleIsStatusChanging = (isFetching: boolean, customerId: string): ToggleIsStatusChangingActionType => (
  {
    type: TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS, isFetching, customerId
  }
)

type ToggleIsCustomerDeletingInProcessActionType = {
  type: typeof TOGGLE_IS_CUSTOMER_DELETING_IN_PROCESS,
  isFetching: boolean,
  customerId: string
}

const toggleIsCustomerDeletingInProcess = (isFetching: boolean, customerId: string): ToggleIsCustomerDeletingInProcessActionType => (
  {
    type: TOGGLE_IS_CUSTOMER_DELETING_IN_PROCESS, isFetching, customerId
  }
)

type DeleteCustomerActionType = {
  type: typeof DELETE_CUSTOMER,
  customerId: string
}

const deleteCustomerAC = (customerId: string): DeleteCustomerActionType => (
  {
    type: DELETE_CUSTOMER, customerId
  }
)

type DeleteArchivedCustomerAT = {
  type: typeof DELETE_ARCHIVED_CUSTOMER
  customerId: string
}

export const deleteArchivedCustomerAC = (customerId: string): DeleteArchivedCustomerAT => ({
  type: DELETE_ARCHIVED_CUSTOMER, customerId
})

type AddCustomerActionType = {
  type: typeof ADD_CUSTOMER,
  customer: CustomerType
}

const addCustomerAC = (customer: CustomerType): AddCustomerActionType => (
  {
    type: ADD_CUSTOMER, customer
  }
)

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getCustomers = (
  currentCustomersPage: number,
  customersPageSize: number,
  customersFilter: CustomersFilterType
): ThunkType => async (
    dispatch,
    getState
) => {
  try {
    dispatch(setIsFetching(true))
    let response = await customersAPI.getCustomers(
      currentCustomersPage,
      customersPageSize,
      customersFilter
    )
    dispatch(setCustomers(response.customers))
    dispatch(setCustomersTotalCount(response.totalCount))
    dispatch(setIsFetching(false))
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const getArchivedCustomers = (
    currentPage: number,
    customersPageSize: number,
    customersFilter: CustomersFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetching(true))
    let response = await customersAPI.getArchivedCustomers(
        currentPage,
        customersPageSize,
        customersFilter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setTotalArchivedCustomersCountAC(response.totalCount))
      dispatch(setArchivedCustomersAC(response.customers))
      dispatch(setIsFetching(false))
    }
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const customersOnFilterChanged = (
  customersPageSize: number,
  filter: CustomersFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(setCustomersFilter(filter))
    dispatch(setCurrentPageAC(1))
    await dispatch(getCustomers(1, customersPageSize, filter))
  } catch (e) {
    console.log(e)
  }
}

export const changeCustomerStatus = (
  customerId: string,
  status: boolean
): ThunkType => async (dispatch) => {

  try {
    dispatch(toggleIsStatusChanging(true, customerId))
    let response = await customersAPI.changeCustomerStatus(customerId, status)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(changeCustomerStatusAC(customerId, response.status))
      dispatch(toggleIsStatusChanging(false, customerId))
    }
  } catch (e) {
    dispatch(toggleIsStatusChanging(false, customerId))
    console.log(e)
  }
}

export const deleteCustomer = (
    customerId: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsCustomerDeletingInProcess(true, customerId))
    let response = await customersAPI.deleteCustomer(customerId)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteCustomerAC(customerId))
      dispatch(toggleIsCustomerDeletingInProcess(false, customerId))
    }
  } catch (e) {
    dispatch(toggleIsCustomerDeletingInProcess(false, customerId))
    console.log(e)
  }
}

export const deleteArchivedCustomer = (
    customerId: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsCustomerDeletingInProcess(true, customerId))
    let response = await customersAPI.deleteArchivedCustomer(customerId)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedCustomerAC(customerId))
      dispatch(toggleIsCustomerDeletingInProcess(false, customerId))
    }
  } catch (e) {
    dispatch(toggleIsCustomerDeletingInProcess(false, customerId))
    console.log(e)
  }
}

export const addCustomer = (
  values: any
): ThunkType => async (dispatch) => {
  try {
    let response = await customersAPI.addCustomer(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addCustomerAC(response.customer))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e)
  }

}

export const turnCustomerToClient = (
    customerId: string,
    fullName: string,
    contacts: {}
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetching(true))
    let response = await customersAPI.turnCustomerToClient(
      customerId,
      fullName,
      contacts
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteCustomerAC(customerId))
      dispatch(setIsFetching(false))
    }
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const archiveCustomer = (
    customerId: string
): ThunkType => async (dispatch) => {
  console.log("it is a hit!!!!!")
  try {
    let response = await customersAPI.archiveCustomer(customerId)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteCustomerAC(customerId))
    }
  } catch (e) {
    console.log(e)
  }
}

export const reactivateCustomer = (
    customerId: string
): ThunkType => async (dispatch) => {
  try {
    let response = await customersAPI.reactivateCustomer(customerId)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedCustomerAC(customerId))
      dispatch(addCustomerAC(response.customer))
    }
  } catch (e) {
    console.log(e)
  }
}
