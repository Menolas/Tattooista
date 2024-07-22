import {archivedBookingsApi} from "./archived-bookingsApi";
import {ResultCodesEnum} from "../../utils/constants";
import {ApiErrorType, BookingType, SearchFilterType} from "../../types/Types";
import {AppStateType} from "../redux-store";
import {ThunkAction} from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
} from "../General/general-reducer";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_FILTER = 'SET_FILTER';
const SET_ARCHIVED_BOOKINGS = 'SET_ARCHIVED_BOOKINGS';
const ADD_ARCHIVED_BOOKING = 'ADD_ARCHIVED_BOOKING';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const DELETE_ARCHIVED_BOOKING = 'DELETE_ARCHIVED_BOOKING';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_ARCHIVED_BOOKING_API_ERROR = 'SET_ARCHIVED_BOOKING_API_ERROR';

const RESTORE_BOOKING_FROM_ARCHIVE = "Congratulations! You just restored this consultation!";

const initialState = {
  archivedBookings: [] as Array<BookingType>,
  totalCount: 0 as number,
  pageSize: 5 as number,
  archivedBookingsCurrentPage: 1 as number,
  isFetching: false,
  isDeletingInProcess: [] as Array<string>,
  filter: {
    term: '',
    condition: 'any',
  } as SearchFilterType,
  accessError: null as null | string,
  archivedBookingApiError: null as null | string,
}

export type InitialStateType = typeof initialState;

export const archivedBookingsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.pageSize,
        archivedBookingsCurrentPage: 1,
      }

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      }

    case SET_ARCHIVED_BOOKINGS:
      return {
        ...state,
        archivedBookings: action.archivedBookings,
        totalCount: action.total,
      }

    case ADD_ARCHIVED_BOOKING:
      return {
        ...state,
        archivedBookings: [action.booking, ...state.archivedBookings],
        totalCount: state.totalCount + 1,
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        archivedBookingsCurrentPage: action.currentPage,
      }

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
          ? [...state.isDeletingInProcess, action.id]
          : state.isDeletingInProcess.filter(id => id !== action.id),
      }

    case DELETE_ARCHIVED_BOOKING:
      if (state.archivedBookings.length > 1) {
        return {
          ...state,
          archivedBookings: state.archivedBookings.filter(archivedBooking => archivedBooking._id !== action.id),
          totalCount: state.totalCount - 1,
        }
      } else {
        return {
          ...state,
          archivedBookingsCurrentPage: state.archivedBookingsCurrentPage - 1,
        }
      }

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error,
      }

    case SET_ARCHIVED_BOOKING_API_ERROR:
      return {
        ...state,
        archivedBookingApiError: action.error,
      }

    default: return state
  }
}

type ActionsTypes = SetSuccessModalAT | SetPageSizeAT |
    SetFilterAT | SetArchivedBookingsAT | SetCurrentPageAT | SetIsFetchingAT
    | ToggleIsDeletingInProcessAT | DeleteArchivedConsultationAT | SetAccessErrorAT
    | SetArchivedBookingApiErrorAT | AddArchivedBookingAT;

// actions creators

type SetArchivedBookingApiErrorAT = {
  type: typeof SET_ARCHIVED_BOOKING_API_ERROR;
  error: string | null;
};

export const setArchivedBookingApiErrorAC = (error: string | null): SetArchivedBookingApiErrorAT => ({
  type: SET_ARCHIVED_BOOKING_API_ERROR, error
});

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR;
  error: string | null;
};

export const setAccessErrorAC = (error: string | null): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetPageSizeAT = {
  type: typeof SET_PAGE_SIZE;
  pageSize: number;
};

export const setPageSizeAC = (pageSize: number): SetPageSizeAT => ({
  type: SET_PAGE_SIZE, pageSize
});

type SetFilterAT = {
  type: typeof SET_FILTER;
  filter: SearchFilterType;
};

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
  type: SET_FILTER, filter
});

type SetArchivedBookingsAT = {
  type: typeof SET_ARCHIVED_BOOKINGS;
  archivedBookings: Array<BookingType>;
  total: number
};

const setArchivedBookingsAC = (archivedBookings: Array<BookingType>, total: number): SetArchivedBookingsAT => ({
  type: SET_ARCHIVED_BOOKINGS, archivedBookings, total
});

export type AddArchivedBookingAT = {
    type: typeof ADD_ARCHIVED_BOOKING;
    booking: BookingType;
};

export const addArchivedBookingAC = (booking: BookingType): AddArchivedBookingAT => ({
    type: ADD_ARCHIVED_BOOKING, booking
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE;
  currentPage: number;
};

export const setArchiveBookingsCurrentPageAC = (currentPage: number): SetCurrentPageAT => ({
  type: SET_CURRENT_PAGE, currentPage
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
  });

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
  isFetching: boolean;
  id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type DeleteArchivedConsultationAT = {
  type: typeof DELETE_ARCHIVED_BOOKING;
  id: string;
};

export const deleteArchivedBookingAC = (id: string): DeleteArchivedConsultationAT => ({
  type: DELETE_ARCHIVED_BOOKING, id
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>;

const deleteArchivedBookingThunk = (
    token: string,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (bookings.length > 1) {
    dispatch(deleteArchivedBookingAC(id));
  } else {
    const newPage = getNewPage(currentPage)
    if (currentPage === newPage) {
      await dispatch(getArchivedBookings(token, newPage, pageLimit, filter));
    }
    dispatch(deleteArchivedBookingAC(id));
    dispatch(setArchiveBookingsCurrentPageAC(newPage));
  }
};

export const getArchivedBookings = (
    token: string,
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    const response = await archivedBookingsApi.getArchivedBookings(
        token,
        currentPage,
        pageSize,
        filter
    );
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAccessErrorAC(''));
      dispatch(setArchivedBookingsAC(response.bookings, response.totalCount));
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setAccessErrorAC(error.response?.data?.message));
    console.log(error);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const deleteArchivedBooking = (
    token: string,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await archivedBookingsApi.deleteArchivedBooking(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedBookingThunk(token, id, bookings, currentPage, pageLimit, filter));
      dispatch(setArchivedBookingApiErrorAC(null));
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setArchivedBookingApiErrorAC(error.response?.data?.message));
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const reactivateBooking = (
    token: string,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await archivedBookingsApi.reactivateBooking(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedBookingThunk(
          token,
          id,
          bookings,
          currentPage,
          pageLimit,
          filter,
      ));
      dispatch(setArchivedBookingApiErrorAC(null));
      dispatch(setSuccessModalAC(true, RESTORE_BOOKING_FROM_ARCHIVE));
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setArchivedBookingApiErrorAC(error.response?.data?.message));
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};
