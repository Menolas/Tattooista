import { archivedClientsAPI } from "./archivedClientsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {ApiErrorType, ClientType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import {setNeedReLoginAC, SetNeedReLoginAT} from "../Auth/auth-reducer";
import {getNewPage} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
} from "../General/general-reducer";
import {AnyAction} from "redux";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_ARCHIVED_CLIENTS = 'SET_ARCHIVED_CLIENTS';
const ADD_ARCHIVED_CLIENT = 'ADD_ARCHIVED_CLIENT';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_FILTER = 'SET_FILTER';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const DELETE_ARCHIVED_CLIENT = 'DELETE_ARCHIVED_CLIENT';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_ARCHIVED_CLIENT_API_ERROR = 'SET_ARCHIVED_CLIENT_API_ERROR';

const RESTORE_CLIENT_FROM_ARCHIVE_SUCCESS = "You successfully restored this client!";

const initialState = {
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
  accessError: null as null | string,
  archivedClientsApiError: null as null | string,
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
        archivedClients: action.clients,
        total: action.total,
      }

    case ADD_ARCHIVED_CLIENT:
      return {
        ...state,
        archivedClients: [action.client, ...state.archivedClients],
        total: state.total + 1
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page
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

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    case SET_ARCHIVED_CLIENT_API_ERROR:
      return {
        ...state,
        archivedClientsApiError: action.error
      }

    default: return state

  }
};

type ActionsTypes =
    | SetPageSizeAT
    | SetFilterAT
    | SetArchivedClientsAT
    | SetCurrentPageAT
    | ToggleIsDeletingInProcessAT
    | SetIsFetchingAT
    | DeleteArchivedClientAT
    | SetAccessErrorAT
    | SetSuccessModalAT
    | setArchivedClientsApiErrorAT
    | AddArchivedClientAT
    | SetNeedReLoginAT;

// actions creators

type setArchivedClientsApiErrorAT = {
    type: typeof SET_ARCHIVED_CLIENT_API_ERROR;
    error: string | null;
};

export const setArchivedClientsApiErrorAC = (error: string | null): setArchivedClientsApiErrorAT => ({
    type: SET_ARCHIVED_CLIENT_API_ERROR, error
});

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR;
  error: string | null;
};

export const setAccessErrorAC = (error: string | null): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetFilterAT = {
  type: typeof SET_FILTER;
  filter: SearchFilterType;
};

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
  type: SET_FILTER, filter
});

type SetPageSizeAT = {
  type: typeof SET_PAGE_SIZE;
  pageSize: number;
};

export const setPageSize = (pageSize: number): SetPageSizeAT => ({
  type: SET_PAGE_SIZE, pageSize
});


type SetArchivedClientsAT = {
  type: typeof SET_ARCHIVED_CLIENTS;
  clients: Array<ClientType>;
  total: number;
};

const setArchivedClients = (clients: Array<ClientType>, total: number): SetArchivedClientsAT => ({
  type: SET_ARCHIVED_CLIENTS, clients, total
});

export type AddArchivedClientAT = {
    type: typeof ADD_ARCHIVED_CLIENT;
    client: ClientType;
};

export const addArchivedClientAC = (client: ClientType): AddArchivedClientAT => ({
    type: ADD_ARCHIVED_CLIENT, client
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE;
  page: number;
};

export const setCurrentPageAC = (page: number): SetCurrentPageAT => ({
  type: SET_CURRENT_PAGE, page
});

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
  isFetching: boolean;
  id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
  type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching,
});

type DeleteArchivedClientAT = {
  type: typeof DELETE_ARCHIVED_CLIENT;
  clientId: string;
};

const deleteArchivedClientAC = (clientId: string): DeleteArchivedClientAT => ({
  type: DELETE_ARCHIVED_CLIENT, clientId
});

// thunks

//export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>;
export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, AnyAction>;

const deleteArchivedClientThunk = (
    token: string | null,
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (archivedClients.length > 1) {
    dispatch(deleteArchivedClientAC(id));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getArchivedClients(token, newPage, pageLimit, filter));
    }
    dispatch(deleteArchivedClientAC(id));
    dispatch(setCurrentPageAC(newPage));
  }
  return true;
};

export const getArchivedClients = (
    token: string | null,
    currentPage: number,
    pageSize: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await archivedClientsAPI.getArchivedClients(
        token,
        currentPage,
        pageSize,
        filter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedClients(response.clients, response.totalCount));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    if (error.response?.status === 403 || error.response?.status === 401) {
      dispatch(setAccessErrorAC(error.response.data.message));
      dispatch(setNeedReLoginAC(true));
    } else {
      console.log(error);
    }
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const deleteArchivedClient = (
    token: string | null,
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await archivedClientsAPI.deleteArchivedClient(token, id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedClientThunk(token, id, archivedClients, currentPage, pageLimit, filter));
      dispatch(setArchivedClientsApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setArchivedClientsApiErrorAC(error.response?.data?.message));
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const reactivateClient = (
    token: string | null,
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
) : ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await archivedClientsAPI.reactivateClient(token, id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedClientThunk(token, id, archivedClients, currentPage, pageLimit, filter));
      dispatch(setArchivedClientsApiErrorAC(null));
      dispatch(setSuccessModalAC(true, RESTORE_CLIENT_FROM_ARCHIVE_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setArchivedClientsApiErrorAC(error.response?.data?.message));
    console.log(error);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};
