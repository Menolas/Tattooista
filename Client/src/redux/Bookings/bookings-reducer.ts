import { bookingsApi } from "./bookingsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {AddConsultationFormValues, BookConsultationFormValues, BookingType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_PAGE_SIZE = 'SET_BOOKINGS_PAGE_SIZE';
const SET_FILTER = 'SET_BOOKINGS_FILTER';
const SET_STATUS = 'SET_BOOKINGS_STATUS';
const SET_BOOKINGS = 'SET_BOOKINGS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE_FOR_BOOKINGS';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS = 'TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const DELETE_BOOKING = 'DELETE_BOOKING';
const ADD_BOOKING = 'ADD_BOOKING';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_BOOKING_API_ERROR = 'SET_BOOKING_API_ERROR';

const BOOKING_SUCCESS = "Congratulation! You've just submitted new request for consultation.";
const BOOKING_INTO_CLIENT_SUCCESS = "Congratulation! You've just created a client from a consultation request.";

let initialState = {
  bookings: [] as Array<BookingType>,
  total: 0 as number,
  pageSize: 5 as number,
  currentPage: 1 as number,
  isFetching: false,
  isStatusChanging: [] as Array<string>,
  isDeletingInProcess: [] as Array<string>,
  filter: {
    term: '' as string | null,
    condition: 'any' as string | null
  } as SearchFilterType,
  accessError: '' as string | undefined,
  bookingApiError: null as null | string,
};

export type InitialStateType = typeof initialState;

export const bookingsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.pageSize,
        currentPage: 1
      }

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter
      }

    case SET_BOOKINGS:
      return {
        ...state,
        bookings: action.bookings,
        total: action.total,
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page,
      }

    case SET_STATUS:
      return {
        ...state,
        bookings: state.bookings.map(booking => {
          if (booking._id === action.id) {
            return { ...booking, status: action.status }
          }
          return booking
        })
      }
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
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

    case DELETE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.id),
        total: state.total - 1,
      }

    case ADD_BOOKING:
      return {
        ...state,
        bookings: [{...action.consultation}, ...state.bookings],
        total: state.total + 1,
      }

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    case SET_BOOKING_API_ERROR:
      return {
        ...state,
        bookingApiError: action.error
      }

    default: return state
  }
}

type ActionsTypes = SetApiErrorAT | SetSuccessModalAT | SetPageSizeAT |
     SetFilterAT | SetBookingsAT | SetCurrentPageAT |
     ChangeStatusAT | SetIsFetchingAT |
    ToggleIsStatusChangingAT | ToggleIsDeletingInProcessAT | DeleteBookingAT |
    AddBookingAT | SetAccessErrorAT | SetBookingApiErrorAT;

// actions creators

type SetBookingApiErrorAT = {
  type: typeof SET_BOOKING_API_ERROR
  error: string | null
}

export const setBookingApiErrorAC = (error: string | null): SetBookingApiErrorAT => ({
  type: SET_BOOKING_API_ERROR, error
});

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR
  error: string | undefined
}

export const setAccessErrorAC = (error: string | undefined): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetPageSizeAT = {
  type: typeof  SET_PAGE_SIZE
  pageSize: number
}

export const setPageSizeAC = (pageSize: number): SetPageSizeAT => ({
    type: SET_PAGE_SIZE, pageSize
});

type SetFilterAT = {
  type: typeof  SET_FILTER
  filter: SearchFilterType
}

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
    type: SET_FILTER, filter
  });

type SetBookingsAT = {
  type: typeof SET_BOOKINGS,
  bookings: Array<BookingType>,
  total: number,
}

const setBookingsAC = (bookings: Array<BookingType>, total: number): SetBookingsAT => ({
      type: SET_BOOKINGS, bookings, total
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE,
  page: number
}

export const setCurrentPageAC = (page: number): SetCurrentPageAT => ({
      type: SET_CURRENT_PAGE, page
});

type ChangeStatusAT = {
  type: typeof SET_STATUS,
  id: string,
  status: boolean
}

const changeStatusAC = (id: string, status: boolean): ChangeStatusAT => ({
    type: SET_STATUS, id, status
  });

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
  });

type ToggleIsStatusChangingAT = {
  type: typeof TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS,
  isFetching: boolean,
  id: string
}

const toggleIsStatusChangingAC = (isFetching: boolean, id: string): ToggleIsStatusChangingAT => ({
    type: TOGGLE_IS_STATUS_CHANGING_IN_PROGRESS, isFetching, id
  });

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
  });

type DeleteBookingAT = {
  type: typeof DELETE_BOOKING,
  id: string
}

const deleteBookingAC = (id: string): DeleteBookingAT => ({
    type: DELETE_BOOKING, id
});

type AddBookingAT = {
  type: typeof ADD_BOOKING,
  consultation: BookingType
}

const addBookingAC = (consultation: BookingType): AddBookingAT => ({
    type: ADD_BOOKING, consultation
});

// thunks

type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>

const deleteBookingThunk = (
    token: string | null,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (bookings.length > 1) {
    dispatch(deleteBookingAC(id));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getBookings(token, newPage, pageLimit, filter));
    }
    dispatch(deleteBookingAC(id));
    dispatch(setCurrentPageAC(newPage));
  }
  return true;
}

export const getBookings = (
  token: string | null,
  currentPage: number,
  pageSize: number,
  filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await bookingsApi.getBookings(
      token,
      currentPage,
      pageSize,
      filter
    );
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAccessErrorAC(''));
      dispatch(setBookingsAC(response.bookings, response.totalCount));
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    dispatch(setAccessErrorAC(e.response?.data?.message));
    console.log(e);
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const changeStatus = (
  id: string,
  status: boolean
): ThunkType => async (dispatch) => {

  try {
    dispatch(toggleIsStatusChangingAC(true, id));
    let response = await bookingsApi.changeConsultationStatus(id, status);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(changeStatusAC(id, response.status));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsStatusChangingAC(false, id));
  }
}

export const deleteBooking = (
    token: string | null,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await bookingsApi.deleteConsultation(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteBookingThunk(token, id, bookings, currentPage, pageLimit, filter));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const addBooking = (
  values: AddConsultationFormValues | BookConsultationFormValues,
): ThunkType => async (dispatch) => {
  try {
    let response = await bookingsApi.addConsultation(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addBookingAC(response.booking));
      dispatch(setSuccessModalAC(true, BOOKING_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response.data.message));
    return false;
  }
}

export const turnBookingToClient = (
    token: string | null,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await bookingsApi.turnBookingToClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteBookingThunk(token, id, bookings, currentPage, pageLimit, filter));
      dispatch(setBookingApiErrorAC(null));
      dispatch(setSuccessModalAC(true, BOOKING_INTO_CLIENT_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    dispatch(setBookingApiErrorAC(e.response.data.message));
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const archiveBooking = (
    token: string | null,
    id: string,
    bookings: Array<BookingType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await bookingsApi.archiveBooking(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteBookingThunk(token, id, bookings, currentPage, pageLimit, filter));
      dispatch(setBookingApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    console.log(e);
    dispatch(setBookingApiErrorAC(e.response.data.message));
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}
