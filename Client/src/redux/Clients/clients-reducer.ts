import { clientsAPI } from "./clientsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {ApiErrorType, ClientType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT,
} from "../General/general-reducer";
import {addArchivedClientAC, AddArchivedClientAT} from "../ArchivedClients/archived-clients-reducer";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_FILTER = 'SET_FILTER';
const SET_CLIENTS = 'SET_CLIENTS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const TOGGLE_IS_DELETING_PICTURES_IN_PROCESS = 'TOGGLE_IS_DELETING_PICTURE_IN_PROGRESS';
const DELETE_CLIENT = 'DELETE_CLIENT';
const EDIT_CLIENT = 'EDIT_CLIENT';
const ADD_CLIENT = 'ADD_CLIENT';
const SET_CLIENT_PROFILE = 'SET_CLIENT_PROFILE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const SET_CLIENTS_API_ERROR = 'SET_CLIENTS_API_ERROR';
const TOGGLE_IS_FAVOURITE = 'TOGGLE_IS_FAVOURITE';
const TOGGLE_IS_FAVOURITE_CHANGING = 'TOGGLE_IS_FAVOURITE_CHANGING';

const ADD_CLIENT_SUCCESS = "Congratulation! You've just created a new client.";
const UPDATE_CLIENT_SUCCESS = "Congratulation! You've just updated a client's info.";
const UPDATE_CLIENT_GALLERY_SUCCESS = "You successfully updated client's gallery.";

const initialState = {
  clients: [] as Array<ClientType>,
  total: 0 as number,
  pageSize: 5 as number,
  clientsCurrentPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  isDeletingPicturesInProcess: [] as Array<string>,
  isFavouriteChangingInProcess: [] as Array<string>,
  filter: {
    term: '' as string | null,
    condition: "any" as string | null,
    isFavourite: "any" as string | null,
  } as SearchFilterType,
  profile: {} as ClientType,
  accessError: '' as string | undefined,
  clientsApiError: null as null | string,
};

export type InitialStateType = typeof initialState;

export const clientsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.clientsPageSize,
        clientsCurrentPage: 1
      }

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter
      }

    case SET_CLIENTS:
      return {
        ...state,
        clients: action.clients,
        total: action.total,
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        clientsCurrentPage: action.page,
      }

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client._id !== action.clientId),
        total: state.total - 1,
      }

    case EDIT_CLIENT:
      return {
        ...state,
        clients: state.clients.map(client => {
          if (client._id === action.client._id) {
            return { ...action.client }
          }
          return client
        }),
        profile: action.client,
      }

    case SET_CLIENT_PROFILE:
      return {
        ...state,
        profile: action.profile,
      }

    case ADD_CLIENT:
      return {
        ...state,
        clients: [{...action.client}, ...state.clients ],
        total: state.total + 1,
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

    case TOGGLE_IS_FAVOURITE_CHANGING:
      return {
        ...state,
        isFavouriteChangingInProcess: action.isFavouriteChanging
          ? [...state.isFavouriteChangingInProcess, action.id]
          : state.isFavouriteChangingInProcess.filter(id => id !== action.id)
      }

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    case SET_CLIENTS_API_ERROR:
      return {
        ...state,
        clientsApiError: action.error
      }

    case TOGGLE_IS_FAVOURITE:
      return {
        ...state,
        clients: state.clients.map(client =>
          client._id === action.client._id
            ? { ...action.client }
            : client
        ),
      }

    default: return state
  }
};

type ActionsTypes = SetClientsPageSizeAT | SetFilterAT |
    SetClientsAT | SetCurrentPageAT | ToggleIsDeletingInProcessAT |
    ToggleIsDeletingPicturesInProcessAT | SetIsFetchingAT | DeleteClientAT | EditClientAT |
    AddClientAT | SetClientProfileAT | SetAccessErrorAT | SetSuccessModalAT | SetClientApiErrorAT
    | AddArchivedClientAT | SetApiErrorAT | SetIsFavouriteAT | SetIsFavouriteChangingAT;

// actions creators

type SetIsFavouriteChangingAT = {
    type: typeof TOGGLE_IS_FAVOURITE_CHANGING;
    id: string;
    isFavouriteChanging: boolean;
};

const setIsFavouriteChangingAC = (id: string, isFavouriteChanging: boolean): SetIsFavouriteChangingAT => ({
  type: TOGGLE_IS_FAVOURITE_CHANGING, id, isFavouriteChanging
});

type SetIsFavouriteAT = {
  type: typeof TOGGLE_IS_FAVOURITE;
  client: ClientType;
};

export const setIsFavouriteAC = (client: ClientType): SetIsFavouriteAT => ({
  type: TOGGLE_IS_FAVOURITE, client
});

type SetClientApiErrorAT = {
    type: typeof SET_CLIENTS_API_ERROR;
    error: string | null;
};

export const setClientsApiErrorAC = (error: string | null): SetClientApiErrorAT => ({
    type: SET_CLIENTS_API_ERROR, error
});

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR;
  error: string | undefined;
};

export const setAccessErrorAC = (error: string | undefined): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetClientsPageSizeAT = {
  type: typeof  SET_PAGE_SIZE;
  clientsPageSize: number;
};

export const setPageSize = (clientsPageSize: number): SetClientsPageSizeAT => ({
    type: SET_PAGE_SIZE, clientsPageSize
});

type SetFilterAT = {
  type: typeof SET_FILTER;
  filter: SearchFilterType;
};

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
    type: SET_FILTER, filter
});

type SetClientsAT = {
  type: typeof SET_CLIENTS;
  clients: Array<ClientType>;
  total: number;
};

const setClientsAC = (clients: Array<ClientType>, total: number): SetClientsAT => ({
    type: SET_CLIENTS, clients, total
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE;
  page: number;
};

export const setClientsCurrentPageAC = (page: number): SetCurrentPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type ToggleIsDeletingPicturesInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_PICTURES_IN_PROCESS;
  isFetching: boolean;
  id: string;
};

const toggleIsDeletingPicturesInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingPicturesInProcessAT  => ({
  type: TOGGLE_IS_DELETING_PICTURES_IN_PROCESS, isFetching, id
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

type DeleteClientAT = {
  type: typeof DELETE_CLIENT;
  clientId: string;
};

const deleteClientAC = (clientId: string): DeleteClientAT => ({
  type: DELETE_CLIENT, clientId
});

type EditClientAT = {
  type: typeof EDIT_CLIENT;
  client: ClientType;
};

const editClientAC = (client: ClientType): EditClientAT => ({
  type: EDIT_CLIENT, client
});

type AddClientAT = {
  type: typeof ADD_CLIENT;
  client: ClientType;
};

const addClientAC = (client: ClientType): AddClientAT => ({
  type: ADD_CLIENT, client
});

type SetClientProfileAT = {
  type: typeof SET_CLIENT_PROFILE;
  profile: ClientType;
};

const setClientProfile = (profile: ClientType): SetClientProfileAT => ({
  type: SET_CLIENT_PROFILE, profile
});

// thunks

type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>;

const deleteClientThunk = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (clients.length > 1) {
    dispatch(deleteClientAC(id));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getClients(token, newPage, pageLimit, filter));
    }
    dispatch(deleteClientAC(id));
    dispatch(setClientsCurrentPageAC(newPage));
  }
  return true;
};

export const getClients = (
  token: string | null,
  currentClientPage: number,
  clientsPageSize: number,
  clientsFilter: SearchFilterType
): ThunkType => async (
    dispatch,
) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await clientsAPI.getClients(
      token,
      currentClientPage,
      clientsPageSize,
      clientsFilter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAccessErrorAC(''));
      dispatch(setClientsAC(response.clients, response.totalCount));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setAccessErrorAC(error.response?.data?.message));
    console.log(error);
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const toggleFavourite = (
    token: string | null | undefined,
    id: string,
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFavouriteChangingAC(id, true));
    const response = await clientsAPI.toggleIsFavorite(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
      dispatch(setIsFavouriteAC(response.client));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(setIsFavouriteChangingAC(id, false));
  }
};

export const deleteClient = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await clientsAPI.deleteClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteClientThunk(token, id, clients, currentPage, pageLimit, filter));
      dispatch(setApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message));
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const deleteClientFromProfile = (
    id: string,
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await clientsAPI.deleteClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteClientAC(id));
      dispatch(setApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message));
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const addClient = (
    values: FormData,
): ThunkType => async (dispatch) => {
  try {
    const response = await clientsAPI.addClient(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addClientAC(response.client));
      dispatch(setSuccessModalAC(true, ADD_CLIENT_SUCCESS));
      dispatch(setClientsApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setClientsApiErrorAC(error.response?.data?.message));
    console.log(error)
    return false;
  }
};

export const editClient = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await clientsAPI.editClient(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(editClientAC(response.client));
      dispatch(setSuccessModalAC(true, UPDATE_CLIENT_SUCCESS));
      dispatch(setClientsApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setClientsApiErrorAC(error.response?.data?.message));
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const getClientProfile = (
  clientId: string): ThunkType => async (
  dispatch
) => {
  dispatch(setIsFetchingAC(true));
  try {
    const response = await clientsAPI.getClientProfile(clientId);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const updateClientGallery = (
  id: string,
  values: FormData
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    const response = await clientsAPI.updateClientGallery(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
      dispatch(editClientAC(response.client));
      dispatch(setClientsApiErrorAC(null));
      dispatch(setSuccessModalAC(true, UPDATE_CLIENT_GALLERY_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setClientsApiErrorAC(error.response?.data?.message));
    console.log(error);
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const deleteClientGalleryPicture = (
    id: string,
    picture: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingPicturesInProcessAC(true, picture));
    const response = await clientsAPI.deleteClientGalleryPicture(id, picture);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client));
      dispatch(editClientAC(response.client));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingPicturesInProcessAC(false, picture));
  }
};

export const archiveClient = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    pageLimit: number,
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await clientsAPI.archiveClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteClientThunk(token, id, clients, currentPage, pageLimit, filter));
      dispatch(addArchivedClientAC(response.client));
      dispatch(setApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message));
    console.log(error);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const archiveClientFromProfile = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    const response = await clientsAPI.archiveClient(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteClientAC(id));
      dispatch(setApiErrorAC(null));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    console.log(error);
    dispatch(setApiErrorAC(error.response?.data?.message));
    return false;
  }
};
