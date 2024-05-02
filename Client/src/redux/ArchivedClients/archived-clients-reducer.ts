import { archivedClientsAPI } from "./archivedClientsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {ClientType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_ARCHIVED_CLIENTS = 'SET_ARCHIVED_CLIENTS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_FILTER = 'SET_FILTER';
const SET_TOTAL = 'SET_TOTAL';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const DELETE_ARCHIVED_CLIENT = 'DELETE_ARCHIVED_CLIENT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_API_ERROR = 'SET_ADD_CLIENT_API_ERROR';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';

const RESTORE_CLIENT_FROM_ARCHIVE_SUCCESS = "You successfully restored this client!";

let initialState = {
  archivedClients: [] as Array<ClientType>,
  total: 0 as number,
  pageSize: 5 as number,
  currentPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  filter: {
    term: '',
    condition: "any"
  } as SearchFilterType,
  apiError: '' as string,
  accessError: '' as string | undefined,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  },
}

export type InitialStateType = typeof initialState

export const archivedClientsReducer = (
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

    case SET_ARCHIVED_CLIENTS:
      return {
        ...state,
        archivedClients: action.clients
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page
      }

    case SET_TOTAL:
      return {
        ...state,
        total: action.count
      }

    case SET_FILTER:
      return {
        ...state,
        filter: {...action.filter}
      }

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case DELETE_ARCHIVED_CLIENT:
      if (state.archivedClients.length > 1) {
        return {
          ...state,
          archivedClients: state.archivedClients.filter(client => client._id !== action.clientId),
          total: state.total - 1
        }
      } else {
        return {
          ...state,
          currentPage: state.currentPage - 1
        }
      }

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
            ? [...state.isDeletingInProcess, action.id]
            : state.isDeletingInProcess.filter(id => id !== action.id)
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

type ActionsTypes = SetApiErrorAT | SetPageSizeAT | SetFilterAT |
    SetArchivedClientsAT | SetCurrentPageAT | SetTotalAT |
    ToggleIsDeletingInProcessAT | SetIsFetchingAT |
    DeleteArchivedClientAT | SetAccessErrorAT | SetSuccessModalAT;

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

type SetFilterAT = {
  type: typeof SET_FILTER
  filter: SearchFilterType
}

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
  type: SET_FILTER, filter
});

type SetPageSizeAT = {
  type: typeof SET_PAGE_SIZE
  pageSize: number
}

export const setPageSize = (pageSize: number): SetPageSizeAT => ({
  type: SET_PAGE_SIZE, pageSize
});


type SetArchivedClientsAT = {
  type: typeof SET_ARCHIVED_CLIENTS,
  clients: Array<ClientType>
}

const setArchivedClients = (clients: Array<ClientType>): SetArchivedClientsAT => ({
  type: SET_ARCHIVED_CLIENTS, clients
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE,
  page: number
}

export const setCurrentPageAC = (page: number): SetCurrentPageAT => ({
  type: SET_CURRENT_PAGE, page
});

type SetTotalAT = {
  type: typeof SET_TOTAL,
  count: number
}

const setTotalAC = (count: number): SetTotalAT => ({
  type: SET_TOTAL, count
});

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
  type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean,
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching,
});

type DeleteArchivedClientAT = {
  type: typeof DELETE_ARCHIVED_CLIENT,
  clientId: string
}

const deleteArchivedClientAC = (clientId: string): DeleteArchivedClientAT => ({
  type: DELETE_ARCHIVED_CLIENT, clientId
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

const deleteArchivedClientThunk = (
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (archivedClients.length > 1) {
    dispatch(deleteArchivedClientAC(id));
    dispatch(setTotalAC(total - 1));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getArchivedClients(newPage, pageLimit, filter));
    }
    dispatch(deleteArchivedClientAC(id));
    dispatch(setCurrentPageAC(newPage));
  }
}

export const getArchivedClients = (
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await archivedClientsAPI.getArchivedClients(
        currentPage,
        pageSize,
        filter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedClients(response.clients));
      dispatch(setTotalAC(response.totalCount));
      dispatch(setIsFetchingAC(false));
    }
  } catch (e) {
    dispatch(setIsFetchingAC(false));
    console.log(e);
  }
}

export const deleteArchivedClient = (
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await archivedClientsAPI.deleteArchivedClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedClientThunk(id, archivedClients, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const reactivateClient = (
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
) : ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await archivedClientsAPI.reactivateClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedClientThunk(id, archivedClients, currentPage, total, pageLimit, filter));
      dispatch(setSuccessModalAC(true, RESTORE_CLIENT_FROM_ARCHIVE_SUCCESS));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setApiErrorAC(e.response.data.message));
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}
