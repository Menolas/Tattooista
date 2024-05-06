import { clientsAPI } from "./clientsApi";
import { ResultCodesEnum } from "../../utils/constants";
import {ClientType, SearchFilterType} from "../../types/Types";
import { AppStateType } from "../redux-store";
import { ThunkAction } from "redux-thunk";
import type {} from "redux-thunk/extend-redux";
import {getNewPage} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_FILTER = 'SET_FILTER';
const SET_CLIENTS = 'SET_CLIENTS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL = 'SET_TOTAL';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const TOGGLE_IS_DELETING_PICTURES_IN_PROCESS = 'TOGGLE_IS_DELETING_PICTURE_IN_PROGRESS';
const DELETE_CLIENT = 'DELETE_CLIENT';
const EDIT_CLIENT = 'EDIT_CLIENT';
const ADD_CLIENT = 'ADD_CLIENT';
const SET_CLIENT_PROFILE = 'SET_CLIENT_PROFILE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const SET_ACCESS_ERROR = 'SET_ACCESS_ERROR';
const ADD_CLIENT_SUCCESS = "Congratulation! You've just created a new client.";
const UPDATE_CLIENT_SUCCESS = "Congratulation! You've just updated a client's info.";
const UPDATE_CLIENT_GALLERY_SUCCESS = "You successfully updated client's gallery.";

let initialState = {
  clients: [] as Array<ClientType>,
  total: 0 as number,
  pageSize: 5 as number,
  currentPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  isDeletingPicturesInProcess: [] as Array<string>,
  filter: {
    term: '' as string | null,
    condition: "any" as string | null
  },
  profile: {} as ClientType,
  accessError: '' as string | undefined,
}

export type InitialStateType = typeof initialState

export const clientsReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.clientsPageSize,
        currentPage: 1
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
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page,
      }

    case SET_TOTAL:
      return {
        ...state,
        total: action.count,
      }

    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client._id !== action.clientId)
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

    case SET_ACCESS_ERROR:
      return {
        ...state,
        accessError: action.error
      }

    default: return state

  }
}

type ActionsTypes = SetApiErrorAT | SetClientsPageSizeAT | SetFilterAT |
    SetClientsAT | SetCurrentPageAT | SetTotalCountAT | ToggleIsDeletingInProcessAT |
    ToggleIsDeletingPicturesInProcessAT | SetIsFetchingAT | DeleteClientAT | EditClientAT |
    AddClientAT | SetClientProfileAT | SetAccessErrorAT | SetSuccessModalAT;

// actions creators

type SetAccessErrorAT = {
  type: typeof SET_ACCESS_ERROR
  error: string | undefined
}

export const setAccessErrorAC = (error: string | undefined): SetAccessErrorAT => ({
  type: SET_ACCESS_ERROR, error
});

type SetClientsPageSizeAT = {
  type: typeof  SET_PAGE_SIZE
  clientsPageSize: number
}

export const setPageSize = (clientsPageSize: number): SetClientsPageSizeAT => ({
    type: SET_PAGE_SIZE, clientsPageSize
});

type SetFilterAT = {
  type: typeof SET_FILTER
  filter: SearchFilterType
}

export const setFilterAC = (filter: SearchFilterType): SetFilterAT => ({
    type: SET_FILTER, filter
});

type SetClientsAT = {
  type: typeof SET_CLIENTS,
  clients: Array<ClientType>
}

const setClientsAC = (clients: Array<ClientType>): SetClientsAT => ({
    type: SET_CLIENTS, clients
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE,
  page: number
}

export const setCurrentPageAC = (page: number): SetCurrentPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type SetTotalCountAT = {
  type: typeof SET_TOTAL,
  count: number
}

const setTotalCountAC = (count: number): SetTotalCountAT => ({
      type: SET_TOTAL, count
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
    filter: SearchFilterType
): ThunkType => async (dispatch) => {
  if (clients.length > 1) {
    dispatch(deleteClientAC(id))
    dispatch(setTotalCountAC(total -1))
  } else {
    const newPage = getNewPage(currentPage)
    if (currentPage === newPage) {
      await dispatch(getClients(token, newPage, pageLimit, filter))
    }
    dispatch(deleteClientAC(id));
    dispatch(setCurrentPageAC(newPage));

  }
}

export const getClients = (
  token: string | null,
  currentClientPage: number,
  clientsPageSize: number,
  clientsFilter: SearchFilterType
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
      dispatch(setTotalCountAC(response.totalCount));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setAccessErrorAC(e.response.data.message));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const deleteClient = (
    token: string,
    id: string,
    clients: Array<ClientType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    filter: SearchFilterType
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

export const addClient = (
    values: FormData,
    total: number
): ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.addClient(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addClientAC(response.client))
      dispatch(setTotalCountAC(total + 1));
      dispatch(setSuccessModalAC(true, ADD_CLIENT_SUCCESS));
    }
  } catch (e) {
    // @ts-ignore
    dispatch(setApiErrorAC(e.response.data.message));
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
    // @ts-ignore
    dispatch(setApiErrorAC(e.response.data.message));
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
  values: FormData
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
    dispatch(setApiErrorAC(e.response?.data?.message));
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
    filter: SearchFilterType
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
