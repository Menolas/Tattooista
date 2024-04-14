import { clientsAPI } from "./clientApi";
import { ResultCodesEnum } from "../../utils/constants";
import { ClientType } from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";

const SET_CLIENTS_PAGE_SIZE = 'SET_CLIENTS_PAGE_SIZE';
const SET_ARCHIVED_CLIENTS_PAGE_SIZE = 'SET_ARCHIVED_CLIENTS_PAGE_SIZE';
const SET_CLIENTS_FILTER = 'SET_CLIENTS_FILTER';
const SET_CLIENTS = 'SET_CLIENTS';
const SET_ARCHIVED_CLIENTS = 'SET_ARCHIVED_CLIENTS';
const SET_CURRENT_PAGE_FOR_CLIENTS = 'SET_CURRENT_PAGE_FOR_CLIENTS';
const SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS = 'SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS';
const SET_FILTER_FOR_ARCHIVED_CLIENTS = 'SET_FILTER_FOR_ARCHIVED_CLIENTS';
const SET_TOTAL_CLIENTS_COUNT = 'SET_TOTAL_CLIENTS_COUNT';
const SET_ARCHIVED_CLIENTS_TOTAL_COUNT = 'SET_TOTAL_ARCHIVED_CLIENTS_COUNT';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const TOGGLE_IS_DELETING_PICTURES_IN_PROCESS = 'TOGGLE_IS_DELETING_PICTURE_IN_PROGRESS';
const DELETE_CLIENT = 'DELETE_CLIENT';
const DELETE_ARCHIVED_CLIENT = 'DELETE_ARCHIVED_CLIENT';
const EDIT_CLIENT = 'EDIT_CLIENT';
const ADD_CLIENT = 'ADD_CLIENT';
const SET_CLIENT_PROFILE = 'SET_CLIENT_PROFILE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_ADD_CLIENT_API_ERROR = 'SET_ADD_CLIENT_API_ERROR';
const SET_UPDATE_CLIENT_GALLERY_API_ERROR = 'SET_UPDATE_CLIENT_GALLERY_API_ERROR';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const ADD_CLIENT_SUCCESS = "Congratulation! You\'ve just created a new client.";
const UPDATE_CLIENT_SUCCESS = "Congratulation! You\'ve just updated a client's info.";
const UPDATE_CLIENT_GALLERY_SUCCESS = "You successfully updated client's gallery.";

let initialState = {
  clients: [] as Array<ClientType>,
  archivedClients: [] as Array<ClientType>,
  totalClientsCount: 0 as number,
  totalArchivedClientsCount: 0 as number,
  clientsPageSize: 5 as number,
  archivedClientsPageSize: 5 as number,
  currentClientsPage: 1 as number,
  currentArchivedClientsPage: 1 as number,
  clientsIsFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  isDeletingPicturesInProcess: [] as Array<string>,
  clientsFilter: {
    term: '' as string | null,
    condition: "any" as string | null
  },
  archivedClientsFilter: {
    term: '' as string | null,
    condition: "any" as string | null
  },
  profile: {} as ClientType,
  addClientApiError: '' as string | undefined,
  updateClientGalleryApiError: '' as string | undefined,
  accessError: '' as string | undefined,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  },
}

export type InitialStateType = typeof initialState
export type ClientsFilterType = typeof initialState.clientsFilter

export const clientsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_CLIENTS_PAGE_SIZE:
      return {
        ...state,
        clientsPageSize: action.clientsPageSize,
        currentClientsPage: 1
      }

    case SET_ARCHIVED_CLIENTS_PAGE_SIZE:
      return {
        ...state,
        archivedClientsPageSize: action.pageSize,
        currentArchivedClientsPage: 1
      }
    case SET_CLIENTS_FILTER:
      return {
        ...state,
        clientsFilter: action.filter
      }

    case SET_CLIENTS:
      return {
        ...state,
        clients: action.clients,
      }

    case SET_ARCHIVED_CLIENTS:
      return {
        ...state,
        archivedClients: action.clients
      }
    case SET_CURRENT_PAGE_FOR_CLIENTS:
      return {
        ...state,
        currentClientsPage: action.page,
      }

    case SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS:
      return {
        ...state,
        currentArchivedClientsPage: action.page
      }

    case SET_TOTAL_CLIENTS_COUNT:
      return {
        ...state,
        totalClientsCount: action.count,
      }

    case SET_ARCHIVED_CLIENTS_TOTAL_COUNT:
      return {
        ...state,
        totalArchivedClientsCount: action.count
      }

    case SET_FILTER_FOR_ARCHIVED_CLIENTS:
      return {
        ...state,
        archivedClientsFilter: {...action.filter}
      }

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        clientsIsFetching: action.isFetching,
      }

    case DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client._id !== action.clientId)
      }

    case DELETE_ARCHIVED_CLIENT:
      if (state.archivedClients.length > 1) {
        return {
          ...state,
          archivedClients: state.archivedClients.filter(client => client._id !== action.clientId),
          totalArchivedClientsCount: state.totalArchivedClientsCount - 1
        }
      } else {
        return {
          ...state,
          currentArchivedClientsPage: state.currentArchivedClientsPage - 1
        }
      }

    case EDIT_CLIENT:
      return {
        ...state,
        clients: state.clients.map(client => {
          if (client._id === action.client._id) {
            return { ...action.client }
          }
          return client
        })
      }

    case ADD_CLIENT:
      return {
        ...state,
        clients: [{...action.client}, ...state.clients ],
      }

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
            ? [...state.isDeletingInProcess, action.id]
            : state.isDeletingInProcess.filter(id => id !== action.id)
      }

    case TOGGLE_IS_DELETING_PICTURES_IN_PROCESS:
      return {
        ...state,
        isDeletingPicturesInProcess: action.isFetching
            ? [...state.isDeletingPicturesInProcess, action.id]
            : state.isDeletingPicturesInProcess.filter(id => id !== action.id)
      }

    case SET_CLIENT_PROFILE:
      return {
        ...state,
        profile: action.profile,
      }

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
      }

    case SET_ADD_CLIENT_API_ERROR:
      return {
        ...state,
        addClientApiError: action.error
      }

    case SET_UPDATE_CLIENT_GALLERY_API_ERROR:
      return {
        ...state,
        updateClientGalleryApiError: action.error
      }

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    default: return state

  }
}

type ActionsTypes = SetUpdateClientGalleryApiErrorAT | SetAddClientApiErrorAT |
    SetClientsPageSizeAT | SetArchivedClientsPageSizeAT | SetClientsFilterAT |
    SetArchivedClientsFilterAT | SetClientsAT | SetCurrentPageAT | SetArchivedClientsAT |
    SetCurrentPageForArchivedClientsAT | SetClientsTotalCountAT | SetArchivedClientsTotalCountAT |
    ToggleIsDeletingInProcessAT | ToggleIsDeletingPicturesInProcessAT | SetIsFetchingAT |
    DeleteClientAT | DeleteArchivedClientAT | EditClientAT | AddClientAT | SetClientProfileAT |
    SetAccessErrorAT | SetSuccessModalAT;

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

type SetUpdateClientGalleryApiErrorAT = {
  type: typeof SET_UPDATE_CLIENT_GALLERY_API_ERROR
  error: string
}

export const setUpdateClientGalleryApiErrorAC = (error: string): SetUpdateClientGalleryApiErrorAT => ({
  type: SET_UPDATE_CLIENT_GALLERY_API_ERROR, error
});

type SetAddClientApiErrorAT = {
  type: typeof SET_ADD_CLIENT_API_ERROR
  error: string
}

export const setAddClientApiErrorAC = (error: string): SetAddClientApiErrorAT => ({
  type: SET_ADD_CLIENT_API_ERROR, error
});

type SetArchivedClientsFilterAT = {
  type: typeof SET_FILTER_FOR_ARCHIVED_CLIENTS
  filter: ClientsFilterType
}

export const setArchivedClientsFilterAC = (filter: ClientsFilterType): SetArchivedClientsFilterAT => ({
  type: SET_FILTER_FOR_ARCHIVED_CLIENTS, filter
});

type SetClientsPageSizeAT = {
  type: typeof  SET_CLIENTS_PAGE_SIZE
  clientsPageSize: number
}

export const setClientsPageSize = (clientsPageSize: number): SetClientsPageSizeAT => ({
    type: SET_CLIENTS_PAGE_SIZE, clientsPageSize
});

type SetArchivedClientsPageSizeAT = {
  type: typeof SET_ARCHIVED_CLIENTS_PAGE_SIZE
  pageSize: number
}

export const setArchivedClientsPageSize = (pageSize: number): SetArchivedClientsPageSizeAT => ({
  type: SET_ARCHIVED_CLIENTS_PAGE_SIZE, pageSize
});

type SetClientsFilterAT = {
  type: typeof SET_CLIENTS_FILTER
  filter: ClientsFilterType
}

export const setClientsFilterAC = (filter: ClientsFilterType): SetClientsFilterAT => ({
    type: SET_CLIENTS_FILTER, filter
});

type SetClientsAT = {
  type: typeof SET_CLIENTS,
  clients: Array<ClientType>
}

const setClientsAC = (clients: Array<ClientType>): SetClientsAT => ({
    type: SET_CLIENTS, clients
});

type SetArchivedClientsAT = {
  type: typeof SET_ARCHIVED_CLIENTS,
  clients: Array<ClientType>
}

const setArchivedClients = (clients: Array<ClientType>): SetArchivedClientsAT => ({
  type: SET_ARCHIVED_CLIENTS, clients
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE_FOR_CLIENTS,
  page: number
}

export const setCurrentClientsPageAC = (page: number): SetCurrentPageAT => ({
    type: SET_CURRENT_PAGE_FOR_CLIENTS, page
});

type SetCurrentPageForArchivedClientsAT = {
  type: typeof SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS,
  page: number
}

export const setCurrentPageForArchivedClientsAC = (page: number): SetCurrentPageForArchivedClientsAT => ({
  type: SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS, page
});

type SetClientsTotalCountAT = {
  type: typeof SET_TOTAL_CLIENTS_COUNT,
  count: number
}

const setClientsTotalCountAC = (count: number): SetClientsTotalCountAT => ({
      type: SET_TOTAL_CLIENTS_COUNT, count
});

type SetArchivedClientsTotalCountAT = {
  type: typeof SET_ARCHIVED_CLIENTS_TOTAL_COUNT,
  count: number
}

const setArchivedClientsTotalCountAC = (count: number): SetArchivedClientsTotalCountAT => ({
  type: SET_ARCHIVED_CLIENTS_TOTAL_COUNT, count
});

type ToggleIsDeletingPicturesInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_PICTURES_IN_PROCESS
  isFetching: boolean,
  id: string
}

const toggleIsDeletingPicturesInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingPicturesInProcessAT  => ({
  type: TOGGLE_IS_DELETING_PICTURES_IN_PROCESS, isFetching, id
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

type DeleteClientAT = {
  type: typeof DELETE_CLIENT,
  clientId: string
}

const deleteClientAC = (clientId: string): DeleteClientAT => ({
  type: DELETE_CLIENT, clientId
});

type DeleteArchivedClientAT = {
  type: typeof DELETE_ARCHIVED_CLIENT,
  clientId: string
}

const deleteArchivedClientAC = (clientId: string): DeleteArchivedClientAT => ({
  type: DELETE_ARCHIVED_CLIENT, clientId
});

type EditClientAT = {
  type: typeof EDIT_CLIENT,
  client: ClientType
}

const editClientAC = (client: ClientType): EditClientAT => ({
  type: EDIT_CLIENT, client
});

type AddClientAT = {
  type: typeof ADD_CLIENT,
  client: ClientType
}

const addClientAC = (client: ClientType): AddClientAT => ({
  type: ADD_CLIENT, client
});

type SetClientProfileAT = {
  type: typeof SET_CLIENT_PROFILE,
  profile: ClientType
}

const setClientProfile = (profile: ClientType): SetClientProfileAT => ({
  type: SET_CLIENT_PROFILE, profile
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

const deleteClientThunk = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: ClientsFilterType
): ThunkType => async (dispatch) => {
  if (clients.length > 1) {
    dispatch(deleteClientAC(id))
    dispatch(setClientsTotalCountAC(total -1))
  } else {
    const newPage = getNewPage(currentPage)
    if (currentPage === newPage) {
      await dispatch(getClients(token, newPage, pageLimit, filter))
    }
    dispatch(deleteClientAC(id));
    dispatch(setCurrentClientsPageAC(newPage));

  }
}

const deleteArchivedClientThunk = (
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: ClientsFilterType
): ThunkType => async (dispatch) => {
  if (archivedClients.length > 1) {
    dispatch(deleteArchivedClientAC(id));
    dispatch(setArchivedClientsTotalCountAC(total - 1));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getArchivedClients(newPage, pageLimit, filter));
    }
    dispatch(deleteArchivedClientAC(id));
    dispatch(setCurrentPageForArchivedClientsAC(newPage));
  }
}

export const getClients = (
  token: string | null,
  currentClientPage: number,
  clientsPageSize: number,
  clientsFilter: ClientsFilterType
): ThunkType => async (
    dispatch,
    getState
) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await clientsAPI.getClients(
      token,
      currentClientPage,
      clientsPageSize,
      clientsFilter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAccessErrorAC(''));
      dispatch(setClientsAC(response.clients));
      dispatch(setClientsTotalCountAC(response.totalCount));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAccessErrorAC(e.response.data.message));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const getArchivedClients = (
    currentPage: number,
    pageSize: number,
    filter: ClientsFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await clientsAPI.getArchivedClients(
        currentPage,
        pageSize,
        filter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedClients(response.clients));
      dispatch(setArchivedClientsTotalCountAC(response.totalCount));
      dispatch(setIsFetchingAC(false));
    }
  } catch (e) {
    dispatch(setIsFetchingAC(false));
    console.log(e);
  }
}

export const deleteClient = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: ClientsFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await clientsAPI.deleteClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteClientThunk(token, id, clients, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const deleteClientFromProfile = (
    id: string,
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await clientsAPI.deleteClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteClientAC(id));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const deleteArchivedClient = (
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: ClientsFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await clientsAPI.deleteArchivedClient(id);
    //console.log(response)
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedClientThunk(id, archivedClients, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const addClient = (
    values: FormData,
    total: number
): ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.addClient(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addClientAC(response.client))
      dispatch(setClientsTotalCountAC(total + 1));
      dispatch(setSuccessModalAC(true, ADD_CLIENT_SUCCESS));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAddClientApiErrorAC(e.response.data.message));
    console.log(e)
  }
}

export const editClient = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await clientsAPI.editClient(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(editClientAC(response.client));
      dispatch(setClientProfile(response.client));
      dispatch(setSuccessModalAC(true, UPDATE_CLIENT_SUCCESS));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const getClientProfile = (
  clientId: string): ThunkType => async (
  dispatch
) => {
  dispatch(setIsFetchingAC(true));
  try {
    let response = await clientsAPI.getClientProfile(clientId);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const updateClientGallery = (
  id: string,
  values: any
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await clientsAPI.updateClientGallery(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
      dispatch(editClientAC(response.client));
      dispatch(setSuccessModalAC(true, UPDATE_CLIENT_GALLERY_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setUpdateClientGalleryApiErrorAC(e.response?.data?.message));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const deleteClientGalleryPicture = (
    id: string,
    picture: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingPicturesInProcessAC(true, picture));
    let response = await clientsAPI.deleteClientGalleryPicture(id, picture);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
      dispatch(editClientAC(response.client));
    }
  } catch (e) {
    dispatch(toggleIsDeletingPicturesInProcessAC(false, picture));
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingPicturesInProcessAC(false, picture));
  }
}

export const archiveClient = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: ClientsFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await clientsAPI.archiveClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteClientThunk(token, id, clients, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const archiveClientFromProfile = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.archiveClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteClientAC(id));
    }
  } catch (e) {
    console.log(e);
  }
}

export const reactivateClient = (
    id: string,
    archivedClients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: ClientsFilterType
) : ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await clientsAPI.reactivateClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedClientThunk(id, archivedClients, currentPage, total, pageLimit, filter));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAddClientApiErrorAC(e.response.data.message));
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}
