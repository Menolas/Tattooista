import { bookedConsultationsAPI } from "./bookedConsultationsApi"
import { ResultCodesEnum } from "../../utils/constants"
import { BookedConsultationType } from "../../types/Types"
import { AppStateType } from "../redux-store"
import { ThunkAction } from "redux-thunk"
import type {} from "redux-thunk/extend-redux"

const SET_BOOKED_CONSULTATIONS_PAGE_SIZE = 'SET_BOOKED_CONSULTATIONS_PAGE_SIZE'
const SET_ARCHIVED_CONSULTATIONS_PAGE_SIZE = 'SET_ARCHIVED_CONSULTATIONS_PAGE_SIZE'
const SET_BOOKED_CONSULTATIONS_FILTER = 'SET_BOOKED_CONSULTATIONS_FILTER'
const SET_ARCHIVED_CONSULTATIONS_FILTER = 'SET_ARCHIVED_CONSULTATIONS_FILTER'
const SET_CONSULTATION_STATUS = 'SET_CONSULTATION_STATUS'
const SET_BOOKED_CONSULTATIONS = 'SET_BOOKED_CONSULTATIONS'
const SET_ARCHIVED_CONSULTATIONS = 'SET_ARCHIVED_CONSULTATIONS'
const SET_CURRENT_PAGE_FOR_BOOKED_CONSULTATIONS = 'SET_CURRENT_PAGE_FOR_BOOKED_CONSULTATIONS'
const SET_CURRENT_PAGE_FOR_ARCHIVED_CONSULTATIONS = 'SET_CURRENT_PAGE_FOR_ARCHIVED_CONSULTATIONS'
const SET_TOTAL_BOOKED_CONSULTATIONS_COUNT = 'SET_TOTAL_BOOKED_CONSULTATIONS_COUNT'
const SET_TOTAL_ARCHIVED_CONSULTATIONS_COUNT = 'SET_TOTAL_ARCHIVED_CONSULTATIONS_COUNT'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS = 'TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS'
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS'
const DELETE_CONSULTATION = 'DELETE_CONSULTATION'
const DELETE_ARCHIVED_CONSULTATION = 'DELETE_ARCHIVED_CONSULTATION'
const ADD_CONSULTATION = 'ADD_CONSULTATION'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'
const SET_ADD_BOOKING_API_ERROR = 'SET_ADD_BOOKING_API_ERROR'

let initialState = {
  bookedConsultations: [] as Array<BookedConsultationType>,
  archivedConsultations: [] as Array<BookedConsultationType>,
  totalBookedConsultationsCount: 0 as number,
  totalArchivedConsultationsCount: 0 as number,
  bookedConsultationsPageSize: 5 as number,
  archivedConsultationsPageSize: 5 as number,
  currentBookedConsultationsPage: 1 as number,
  currentArchivedConsultationsPage: 1 as number,
  bookedConsultationsIsFetching: false,
  isStatusChanging: [] as Array<string>,
  isDeletingInProcess: [] as Array<string>,
  bookedConsultationsFilter: {
    term: '' as string | null,
    status: 'null' as string | null
  },
  archivedConsultationsFilter: {
    term: '' as string | null,
    status: 'null' as string | null
  },
  isSuccess: false as boolean,
  addBookingApiError: '' as string | undefined
}

export type InitialStateType = typeof initialState
export type BookedConsultationsFilterType = typeof initialState.bookedConsultationsFilter

export const bookedConsultationsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_BOOKED_CONSULTATIONS_PAGE_SIZE:
      return {
        ...state,
        bookedConsultationsPageSize: action.pageSize,
        currentBookedConsultationsPage: 1
      }

    case SET_ARCHIVED_CONSULTATIONS_PAGE_SIZE:
      return {
        ...state,
        archivedConsultationsPageSize: action.pageSize,
        currentArchivedConsultationsPage: 1
      }

    case SET_BOOKED_CONSULTATIONS_FILTER:
      return {
        ...state,
        bookedConsultationsFilter: action.filter
      }

    case SET_ARCHIVED_CONSULTATIONS_FILTER:
      return {
        ...state,
        archivedConsultationsFilter: action.filter
      }

    case SET_BOOKED_CONSULTATIONS:
      return {
        ...state,
        bookedConsultations: action.bookedConsultations,
      }

    case SET_ARCHIVED_CONSULTATIONS:
      return {
        ...state,
        archivedConsultations: action.archivedConsultations
      }
    case SET_CURRENT_PAGE_FOR_BOOKED_CONSULTATIONS:
      return {
        ...state,
        currentBookedConsultationsPage: action.page,
      }

    case SET_CURRENT_PAGE_FOR_ARCHIVED_CONSULTATIONS:
      return {
        ...state,
        currentArchivedConsultationsPage: action.currentPage
      }

    case SET_TOTAL_BOOKED_CONSULTATIONS_COUNT:
      return {
        ...state,
        totalBookedConsultationsCount: action.count,
      }

    case SET_TOTAL_ARCHIVED_CONSULTATIONS_COUNT:
      return {
        ...state,
        totalArchivedConsultationsCount: action.count
      }
    case SET_CONSULTATION_STATUS:
      return {
        ...state,
        bookedConsultations: state.bookedConsultations.map(consultation => {
          if (consultation._id === action.id) {
            return { ...consultation, status: action.status }
          }
          return consultation
        })
      }
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        bookedConsultationsIsFetching: action.isFetching,
      }
    case TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS:
      return {
        ...state,
        isStatusChanging: action.isFetching
          ? [...state.isStatusChanging, action.id]
          : state.isStatusChanging.filter(id => id !== action.id)
      }
    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
          ? [...state.isDeletingInProcess, action.id]
          : state.isDeletingInProcess.filter(id => id !== action.id)
      }

    case DELETE_CONSULTATION:
      return {
        ...state,
        bookedConsultations: state.bookedConsultations.filter(consultation => consultation._id !== action.id),
        totalBookedConsultationsCount: state.totalBookedConsultationsCount - 1
      }

    case DELETE_ARCHIVED_CONSULTATION:
      if (state.archivedConsultations.length > 1) {
        return {
          ...state,
          archivedConsultations: state.archivedConsultations.filter(consultation => consultation._id !== action.id),
          totalArchivedConsultationsCount: state.totalArchivedConsultationsCount - 1
        }
      } else {
        return {
          ...state,
          currentArchivedConsultationsPage: state.currentArchivedConsultationsPage - 1
        }
      }


    case ADD_CONSULTATION:
      return {
        ...state,
        bookedConsultations: [{...action.consultation}, ...state.bookedConsultations]
      }

    case SET_IS_SUCCESS:
      return {
        ...state,
        isSuccess: action.isSuccess
      }

    case SET_ADD_BOOKING_API_ERROR:
      return {
        ...state,
        addBookingApiError: action.error
      }

    default: return state
  }
}

type ActionsTypes = SetAddBookingApiErrorAT | SetIsSuccessAT | SetBookedConsultationsPageSizeAT | SetArchivedConsultationsPageSizeAT |
    SetBookedConsultationsFilterAT | SetArchivedConsultationsFilterAT
    | SetBookedConsultationsAT | SetArchivedConsultationsAT | SetCurrentPageForBookedConsultationsAT |
    SetCurrentPageForArchivedConsultationsAT | SetBookedConsultationsTotalCountAT | SetArchivedConsultationsTotalCountAT |
    ChangeBookedConsultationStatusAT | SetIsFetchingAT | ToggleIsStatusChangingAT |
    ToggleIsDeletingInProcessAT | DeleteBookedConsultationAT | DeleteArchivedConsultationAT | AddBookedConsultationAT

// actions creators

type SetAddBookingApiErrorAT = {
  type: typeof SET_ADD_BOOKING_API_ERROR
  error: string | undefined
}

export const setAddBookingApiErrorAC = (error: string | undefined): SetAddBookingApiErrorAT => ({
  type: SET_ADD_BOOKING_API_ERROR, error
})

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  isSuccess: boolean
}

export const setIsSuccessAC = (isSuccess: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, isSuccess
})

type SetBookedConsultationsPageSizeAT = {
  type: typeof  SET_BOOKED_CONSULTATIONS_PAGE_SIZE
  pageSize: number
}

export const setBookedConsultationsPageSizeAC = (pageSize: number): SetBookedConsultationsPageSizeAT => ({
    type: SET_BOOKED_CONSULTATIONS_PAGE_SIZE, pageSize
})

type SetArchivedConsultationsPageSizeAT = {
  type: typeof SET_ARCHIVED_CONSULTATIONS_PAGE_SIZE
  pageSize: number
}

export const setArchivedConsultationsPageSizeAC = (pageSize: number): SetArchivedConsultationsPageSizeAT => ({
  type: SET_ARCHIVED_CONSULTATIONS_PAGE_SIZE, pageSize
})

type SetBookedConsultationsFilterAT = {
  type: typeof  SET_BOOKED_CONSULTATIONS_FILTER
  filter: BookedConsultationsFilterType
}

export const setBookedConsultationsFilterAC = (filter: BookedConsultationsFilterType): SetBookedConsultationsFilterAT => ({
    type: SET_BOOKED_CONSULTATIONS_FILTER, filter
  })

type SetArchivedConsultationsFilterAT = {
  type: typeof SET_ARCHIVED_CONSULTATIONS_FILTER
  filter: BookedConsultationsFilterType
}

export const setArchivedConsultationsFilterAC = (filter: BookedConsultationsFilterType): SetArchivedConsultationsFilterAT => ({
  type: SET_ARCHIVED_CONSULTATIONS_FILTER, filter
})

type SetBookedConsultationsAT = {
  type: typeof SET_BOOKED_CONSULTATIONS,
  bookedConsultations: Array<BookedConsultationType>
}

const setBookedConsultationsAC = (bookedConsultations: Array<BookedConsultationType>): SetBookedConsultationsAT => ({
      type: SET_BOOKED_CONSULTATIONS, bookedConsultations
})

type SetArchivedConsultationsAT = {
  type: typeof SET_ARCHIVED_CONSULTATIONS,
  archivedConsultations: Array<BookedConsultationType>
}

const setArchivedConsultationsAC = (archivedConsultations: Array<BookedConsultationType>): SetArchivedConsultationsAT => ({
  type: SET_ARCHIVED_CONSULTATIONS, archivedConsultations
})

type SetCurrentPageForBookedConsultationsAT = {
  type: typeof SET_CURRENT_PAGE_FOR_BOOKED_CONSULTATIONS,
  page: number
}

export const setCurrentPageForBookedConsultationsAC = (page: number): SetCurrentPageForBookedConsultationsAT => ({
      type: SET_CURRENT_PAGE_FOR_BOOKED_CONSULTATIONS, page
})

type SetCurrentPageForArchivedConsultationsAT = {
  type: typeof SET_CURRENT_PAGE_FOR_ARCHIVED_CONSULTATIONS,
  currentPage: number
}

export const setCurrentPageForArchivedConsultationsAC = (currentPage: number): SetCurrentPageForArchivedConsultationsAT => ({
  type: SET_CURRENT_PAGE_FOR_ARCHIVED_CONSULTATIONS,currentPage
})

type SetBookedConsultationsTotalCountAT = {
  type: typeof SET_TOTAL_BOOKED_CONSULTATIONS_COUNT,
  count: number
}

const setBookedConsultationsTotalCountAC = (count: number): SetBookedConsultationsTotalCountAT => (
    {
      type: SET_TOTAL_BOOKED_CONSULTATIONS_COUNT, count
    }
)

type SetArchivedConsultationsTotalCountAT = {
  type: typeof SET_TOTAL_ARCHIVED_CONSULTATIONS_COUNT,
  count: number
}

const setArchivedConsultationsTotalCountAC = (count: number): SetArchivedConsultationsTotalCountAT => ({
  type: SET_TOTAL_ARCHIVED_CONSULTATIONS_COUNT, count
})

type ChangeBookedConsultationStatusAT = {
  type: typeof SET_CONSULTATION_STATUS,
  id: string,
  status: boolean
}

const changeBookedConsultationStatusAC = (id: string, status: boolean): ChangeBookedConsultationStatusAT => (
  {
    type: SET_CONSULTATION_STATUS, id, status
  }
)

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => (
  {
    type: TOGGLE_IS_FETCHING, isFetching
  }
)

type ToggleIsStatusChangingAT = {
  type: typeof TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS,
  isFetching: boolean,
  id: string
}

const toggleIsStatusChangingAC = (isFetching: boolean, id: string): ToggleIsStatusChangingAT => (
  {
    type: TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS, isFetching, id
  }
)

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
  {
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
  }
)

type DeleteBookedConsultationAT = {
  type: typeof DELETE_CONSULTATION,
  id: string
}

const deleteBookedConsultationAC = (id: string): DeleteBookedConsultationAT => (
  {
    type: DELETE_CONSULTATION, id
  }
)

type DeleteArchivedConsultationAT = {
  type: typeof DELETE_ARCHIVED_CONSULTATION
  id: string
}

export const deleteArchivedConsultationAC = (id: string): DeleteArchivedConsultationAT => ({
  type: DELETE_ARCHIVED_CONSULTATION, id
})

type AddBookedConsultationAT = {
  type: typeof ADD_CONSULTATION,
  consultation: BookedConsultationType
}

const addBookedConsultationAC = (consultation: BookedConsultationType): AddBookedConsultationAT => (
  {
    type: ADD_CONSULTATION, consultation
  }
)

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getBookedConsultations = (
  currentPage: number,
  pageSize: number,
  filter: BookedConsultationsFilterType
): ThunkType => async (
    dispatch,
    getState
) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await bookedConsultationsAPI.getBookedConsultations(
      currentPage,
      pageSize,
      filter
    )
    dispatch(setBookedConsultationsAC(response.bookings))
    dispatch(setBookedConsultationsTotalCountAC(response.totalCount))
    dispatch(setCurrentPageForBookedConsultationsAC(response.page))
    dispatch(setIsFetchingAC(false))
  } catch (e) {
    dispatch(setIsFetchingAC(false))
    console.log(e)
  }
}

export const getArchivedConsultations = (
    currentPage: number,
    pageSize: number,
    filter: BookedConsultationsFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await bookedConsultationsAPI.getArchivedConsultations(
        currentPage,
        pageSize,
        filter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedConsultationsTotalCountAC(response.totalCount))
      dispatch(setArchivedConsultationsAC(response.bookings))
      dispatch(setIsFetchingAC(false))
    }
  } catch (e) {
    dispatch(setIsFetchingAC(false))
    console.log(e)
  }
}

export const changeBookedConsultationStatus = (
  id: string,
  status: boolean
): ThunkType => async (dispatch) => {

  try {
    dispatch(toggleIsStatusChangingAC(true, id))
    let response = await bookedConsultationsAPI.changeConsultationStatus(id, status)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(changeBookedConsultationStatusAC(id, response.status))
      dispatch(toggleIsStatusChangingAC(false, id))
    }
  } catch (e) {
    dispatch(toggleIsStatusChangingAC(false, id))
    console.log(e)
  }
}

export const deleteBookedConsultation = (
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: BookedConsultationsFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await bookedConsultationsAPI.deleteConsultation(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      if (bookings.length > 1) {
        dispatch(deleteBookedConsultationAC(id))
        dispatch(setBookedConsultationsTotalCountAC(total - 1))
      } else {
        let newPage =
            currentPage > 1
                ? currentPage - 1
                : (total - 1) > pageLimit
                    ? currentPage + 1
                    : 1
        await dispatch(getBookedConsultations(newPage, pageLimit, filter))
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const deleteArchivedConsultation = (
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: BookedConsultationsFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await bookedConsultationsAPI.deleteArchivedConsultation(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      if (bookings.length > 1) {
        dispatch(deleteArchivedConsultationAC(id))
        dispatch(setArchivedConsultationsTotalCountAC(total - 1))
      } else {
        let newPage =
            currentPage > 1
                ? currentPage - 1
                : (total - 1) > pageLimit
                    ? currentPage + 1
                    : 1
        await dispatch(getArchivedConsultations(newPage, pageLimit, filter))
      }

    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const addBookedConsultation = (
  values: any,
  total: number
): ThunkType => async (dispatch) => {
  try {
    let response = await bookedConsultationsAPI.addConsultation(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addBookedConsultationAC(response.booking))
      dispatch(setBookedConsultationsTotalCountAC(total + 1))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAddBookingApiErrorAC(e.response.data.message))
    console.log(e)
  }
}

export const turnConsultationToClient = (
    id: string,
    fullName: string,
    contacts: {}
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await bookedConsultationsAPI.turnConsultationToClient(
      id,
      fullName,
      contacts
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteBookedConsultationAC(id))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const archiveConsultation = (
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: BookedConsultationsFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await bookedConsultationsAPI.archiveConsultation(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      if (bookings.length > 1) {
        dispatch(deleteBookedConsultationAC(id))
        dispatch(setBookedConsultationsTotalCountAC(total - 1))
      } else {
        let newPage =
            currentPage > 1
                ? currentPage - 1
                : (total - 1) > pageLimit
                    ? currentPage + 1
                    : 1
        await dispatch(getBookedConsultations(newPage, pageLimit, filter))
      }

    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const reactivateConsultation = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await bookedConsultationsAPI.reactivateConsultation(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedConsultationAC(id))
      dispatch(addBookedConsultationAC(response.booking))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}
