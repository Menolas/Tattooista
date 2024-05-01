import { archivedBookingsApi } from "./archived-bookingsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {AddConsultationFormValues, BookedConsultationType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";

const SET_ARCHIVED_BOOKINGS_PAGE_SIZE = 'SET_ARCHIVED_BOOKINGS_PAGE_SIZE';
const SET_ARCHIVED_BOOKINGS_FILTER = 'SET_ARCHIVED_BOOKINGS_FILTER';
const SET_ARCHIVED_BOOKINGS = 'SET_ARCHIVED_BOOKINGS';
const SET_CURRENT_PAGE_FOR_ARCHIVED_BOOKINGS = 'SET_CURRENT_PAGE_FOR_ARCHIVED_BOOKINGS';
const SET_TOTAL_ARCHIVED_BOOKINGS_COUNT = 'SET_TOTAL_ARCHIVED_BOOKINGS_COUNT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const DELETE_ARCHIVED_BOOKING = 'DELETE_ARCHIVED_BOOKING';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const SET_API_ERROR = 'SET_API_ERROR';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const RESTORE_BOOKING_FROM_ARCHIVE = "Congratulations! You just restored this consultation!";

let initialState = {
  archivedBookings: [] as Array<BookedConsultationType>,
  totalArchivedConsultationsCount: 0 as number,
  archivedConsultationsPageSize: 5 as number,
  currentArchivedConsultationsPage: 1 as number,
  bookedConsultationsIsFetching: false,
  isDeletingInProcess: [] as Array<string>,
  archivedConsultationsFilter: {
    term: '',
    condition: 'any',
  } as SearchFilterType,
  apiError: '' as string,
  accessError: '' as string | undefined,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  },
}

export type SuccessModalType = typeof initialState.successModal;
export type InitialStateType = typeof initialState;

export const archivedBookingsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case SET_ARCHIVED_BOOKINGS_PAGE_SIZE:
      return {
        ...state,
        archivedConsultationsPageSize: action.pageSize,
        currentArchivedConsultationsPage: 1
      }

    case SET_ARCHIVED_BOOKINGS_FILTER:
      return {
        ...state,
        archivedConsultationsFilter: action.filter
      }

    case SET_ARCHIVED_BOOKINGS:
      return {
        ...state,
        archivedBookings: action.archivedBookings
      }

    case SET_CURRENT_PAGE_FOR_ARCHIVED_BOOKINGS:
      return {
        ...state,
        currentArchivedConsultationsPage: action.currentPage
      }

    case SET_TOTAL_ARCHIVED_BOOKINGS_COUNT:
      return {
        ...state,
        totalArchivedConsultationsCount: action.count
      }

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        bookedConsultationsIsFetching: action.isFetching,
      }

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
          ? [...state.isDeletingInProcess, action.id]
          : state.isDeletingInProcess.filter(id => id !== action.id)
      }

    case DELETE_ARCHIVED_BOOKING:
      if (state.archivedBookings.length > 1) {
        return {
          ...state,
          archivedBookings: state.archivedBookings.filter(archivedBooking => archivedBooking._id !== action.id),
          totalArchivedConsultationsCount: state.totalArchivedConsultationsCount - 1
        }
      } else {
        return {
          ...state,
          currentArchivedConsultationsPage: state.currentArchivedConsultationsPage - 1
        }
      }

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
      }

    case SET_API_ERROR:
      return {
        ...state,
        apiError: action.error
      }

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    default: return state
  }
}

type ActionsTypes = SetApiErrorAT | SetSuccessModalAT | SetArchivedConsultationsPageSizeAT |
    SetArchivedConsultationsFilterAT | SetArchivedConsultationsAT | SetCurrentPageForArchivedConsultationsAT |
    SetArchivedConsultationsTotalCountAT | SetIsFetchingAT | ToggleIsDeletingInProcessAT |
    DeleteArchivedConsultationAT | SetAccessErrorAT;

// actions creators

type SetSuccessModalAT = {
  type: typeof SET_SUCCESS_MODAL
  isSuccess: boolean
  text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
  type: SET_SUCCESS_MODAL, isSuccess, text
});

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR
  error: string | undefined
}

export const setAccessErrorAC = (error: string | undefined): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetApiErrorAT = {
  type: typeof SET_API_ERROR
  error: string
}

export const setApiErrorAC = (error: string): SetApiErrorAT => ({
  type: SET_API_ERROR, error
});

type SetArchivedConsultationsPageSizeAT = {
  type: typeof SET_ARCHIVED_BOOKINGS_PAGE_SIZE
  pageSize: number
}

export const setArchivedConsultationsPageSizeAC = (pageSize: number): SetArchivedConsultationsPageSizeAT => ({
  type: SET_ARCHIVED_BOOKINGS_PAGE_SIZE, pageSize
});

type SetArchivedConsultationsFilterAT = {
  type: typeof SET_ARCHIVED_BOOKINGS_FILTER
  filter: SearchFilterType
}

export const setArchivedConsultationsFilterAC = (filter: SearchFilterType): SetArchivedConsultationsFilterAT => ({
  type: SET_ARCHIVED_BOOKINGS_FILTER, filter
});

type SetArchivedConsultationsAT = {
  type: typeof SET_ARCHIVED_BOOKINGS,
  archivedBookings: Array<BookedConsultationType>
}

const setArchivedConsultationsAC = (archivedBookings: Array<BookedConsultationType>): SetArchivedConsultationsAT => ({
  type: SET_ARCHIVED_BOOKINGS, archivedBookings
});

type SetCurrentPageForArchivedConsultationsAT = {
  type: typeof SET_CURRENT_PAGE_FOR_ARCHIVED_BOOKINGS,
  currentPage: number
}

export const setCurrentPageForArchivedConsultationsAC = (currentPage: number): SetCurrentPageForArchivedConsultationsAT => ({
  type: SET_CURRENT_PAGE_FOR_ARCHIVED_BOOKINGS, currentPage
});

type SetArchivedConsultationsTotalCountAT = {
  type: typeof SET_TOTAL_ARCHIVED_BOOKINGS_COUNT,
  count: number
}

const setArchivedConsultationsTotalCountAC = (count: number): SetArchivedConsultationsTotalCountAT => ({
  type: SET_TOTAL_ARCHIVED_BOOKINGS_COUNT, count
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
  });

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type DeleteArchivedConsultationAT = {
  type: typeof DELETE_ARCHIVED_BOOKING
  id: string
}

export const deleteArchivedConsultationAC = (id: string): DeleteArchivedConsultationAT => ({
  type: DELETE_ARCHIVED_BOOKING, id
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

const deleteArchivedBookingThunk = (
    token: string,
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (bookings.length > 1) {
    dispatch(deleteArchivedConsultationAC(id));
    dispatch(setArchivedConsultationsTotalCountAC(total - 1));
  } else {
    const newPage = getNewPage(currentPage)
    if (currentPage === newPage) {
      await dispatch(getArchivedConsultations(token, newPage, pageLimit, filter));
    }
    dispatch(deleteArchivedConsultationAC(id));
    dispatch(setCurrentPageForArchivedConsultationsAC(newPage));
  }
}

export const getArchivedConsultations = (
    token: string,
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await archivedBookingsApi.getArchivedConsultations(
        token,
        currentPage,
        pageSize,
        filter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAccessErrorAC(''));
      dispatch(setArchivedConsultationsTotalCountAC(response.totalCount));
      dispatch(setArchivedConsultationsAC(response.bookings));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAccessErrorAC(e.response.data.message));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const deleteArchivedConsultation = (
    token: string,
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await archivedBookingsApi.deleteArchivedConsultation(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedBookingThunk(token, id, bookings, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const reactivateConsultation = (
    token: string,
    id: string,
    bookings: Array<BookedConsultationType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await archivedBookingsApi.reactivateConsultation(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedBookingThunk(token, id, bookings, currentPage, total, pageLimit, filter));
      dispatch(setSuccessModalAC(true, RESTORE_BOOKING_FROM_ARCHIVE));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response.data.message));
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}
