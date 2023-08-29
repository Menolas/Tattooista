import { clientsAPI } from './clientApi'
import { ResultCodesEnum } from '../../utils/constants'
import { ClientType } from '../../types/Types'
import { AppStateType } from '../redux-store'
import { ThunkAction } from 'redux-thunk'
import type {} from 'redux-thunk/extend-redux'
import {boolean} from "yup";

const SET_CLIENTS_PAGE_SIZE = 'SET_CLIENTS_PAGE_SIZE'
const SET_ARCHIVED_CLIENTS_PAGE_SIZE = 'SET_ARCHIVED_CLIENTS_PAGE_SIZE'
const SET_CLIENTS_FILTER = 'SET_CLIENTS_FILTER'
const SET_CLIENTS = 'SET_CLIENTS'
const SET_ARCHIVED_CLIENTS = 'SET_ARCHIVED_CLIENTS'
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE'
const SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS = 'SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS'
const SET_FILTER_FOR_ARCHIVED_CLIENTS = 'SET_FILTER_FOR_ARCHIVED_CLIENTS'
const SET_TOTAL_CLIENTS_COUNT = 'SET_TOTAL_CLIENTS_COUNT'
const SET_ARCHIVED_CLIENTS_TOTAL_COUNT = 'SET_TOTAL_ARCHIVED_CLIENTS_COUNT'
const TOGGLE_IS_CLIENT_DELETING_IN_PROCESS = 'TOGGLE_IS_CLIENT_DELETING_IN_PROCESS'
const DELETE_CLIENT = 'DELETE_CLIENT'
const DELETE_ARCHIVED_CLIENT = 'DELETE_ARCHIVED_CLIENT'
const EDIT_CLIENT = 'EDIT_CLIENT'
const ADD_CLIENT = 'ADD_CLIENT'
const SET_CLIENT_PROFILE = 'SET_CLIENT_PROFILE'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'

let initialState = {
  clients: [] as Array<ClientType>,
  archivedClients: [] as Array<ClientType>,
  totalClientsCount: 0 as number,
  totalArchivedClientsCount: 0 as number,
  clientsPageSize: 5 as number,
  archivedClientsPageSize: 5 as number,
  currentClientsPage: 1 as number,
  currentArchivedClientsPage: 1 as number,
  clientsIsFetching: false,
  isClientDeletingInProcess: [] as Array<string>,
  clientsFilter: {
    term: '' as string | null,
    gallery: "any" as string | null
  },
  archivedClientsFilter: {
    term: '' as string | null,
    gallery: "any" as string | null
  },
  profile: {} as ClientType,
  isSuccess: false as boolean
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
        clientsPageSize: action.clientsPageSize
      }

    case SET_ARCHIVED_CLIENTS_PAGE_SIZE:
      return {
        ...state,
        archivedClientsPageSize: action.pageSize
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
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentClientsPage: action.currentPage,
      }

    case SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS:
      return {
        ...state,
        currentArchivedClientsPage: action.currentPage
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
      return {
        ...state,
        archivedClients: state.archivedClients.filter(client => client._id !== action.clientId)
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
        clients: [{...action.client}, ...state.clients ]
      }

    case TOGGLE_IS_CLIENT_DELETING_IN_PROCESS:
      return {
        ...state,
        isClientDeletingInProcess: action.isFetching
            ? [...state.isClientDeletingInProcess, action.clientId]
            : state.isClientDeletingInProcess.filter(id => id !== action.clientId)
      }

    case SET_CLIENT_PROFILE:
      return {
        ...state,
        profile: action.profile,
      }

    case SET_IS_SUCCESS:
      return {
        ...state,
        isSuccess: action.isSuccess
      }

    default: return state

  }
}

type ActionsTypes = SetIsSuccessAT | SetClientsPageSizeActionType | SetArchivedClientsPageSizeActionType | SetClientsFilterActionType | SetArchivedClientsFilterAT | SetClientsActionType | SetCurrentPageActionType |
    SetArchivedClientsAT | SetCurrentPageForArchivedClientsAT | SetClientsTotalCountActionType | SetArchivedClientsTotalCountAT | ToggleIsClientDeletingInProcessActionType |
    SetIsFetchingActionType | DeleteClientActionType | DeleteArchivedClientAT | EditClientActionType |AddClientActionType | SetClientProfileActionType

// actions creators

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  isSuccess: boolean
}

export const setIsSuccessAC = (isSuccess: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, isSuccess
})

type SetArchivedClientsFilterAT = {
  type: typeof SET_FILTER_FOR_ARCHIVED_CLIENTS
  filter: ClientsFilterType
}

export const setArchivedClientsFilter = (filter: ClientsFilterType): SetArchivedClientsFilterAT => ({
  type: SET_FILTER_FOR_ARCHIVED_CLIENTS, filter
})

type SetClientsPageSizeActionType = {
  type: typeof  SET_CLIENTS_PAGE_SIZE
  clientsPageSize: number
}

export const setClientsPageSize = (clientsPageSize: number): SetClientsPageSizeActionType => (
  {
    type: SET_CLIENTS_PAGE_SIZE, clientsPageSize
  }
)

type SetArchivedClientsPageSizeActionType = {
  type: typeof SET_ARCHIVED_CLIENTS_PAGE_SIZE
  pageSize: number
}

export const setArchivedClientsPageSize = (pageSize: number): SetArchivedClientsPageSizeActionType => ({
  type: SET_ARCHIVED_CLIENTS_PAGE_SIZE, pageSize
})

type SetClientsFilterActionType = {
  type: typeof SET_CLIENTS_FILTER
  filter: ClientsFilterType
}

export const setClientsFilter = (filter: ClientsFilterType): SetClientsFilterActionType => (
  {
    type: SET_CLIENTS_FILTER, filter
  }
)

type SetClientsActionType = {
  type: typeof SET_CLIENTS,
  clients: Array<ClientType>
}

const setClients = (clients: Array<ClientType>): SetClientsActionType => (
  {
    type: SET_CLIENTS, clients
  }
)

type SetArchivedClientsAT = {
  type: typeof SET_ARCHIVED_CLIENTS,
  clients: Array<ClientType>
}

const setArchivedClients = (clients: Array<ClientType>): SetArchivedClientsAT => ({
  type: SET_ARCHIVED_CLIENTS, clients
})

type SetCurrentPageActionType = {
  type: typeof SET_CURRENT_PAGE,
  currentPage: number
}

export const setCurrentPage = (currentPage: number): SetCurrentPageActionType => (
  {
    type: SET_CURRENT_PAGE, currentPage
  }
)

type SetCurrentPageForArchivedClientsAT = {
  type: typeof SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS,
  currentPage: number
}

export const SetCurrentPageForArchivedClients = (currentPage: number): SetCurrentPageForArchivedClientsAT => ({
  type: SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS, currentPage
})

type SetClientsTotalCountActionType = {
  type: typeof SET_TOTAL_CLIENTS_COUNT,
  count: number
}

const setClientsTotalCount = (count: number): SetClientsTotalCountActionType => ({
      type: SET_TOTAL_CLIENTS_COUNT, count
})

type SetArchivedClientsTotalCountAT = {
  type: typeof SET_ARCHIVED_CLIENTS_TOTAL_COUNT,
  count: number
}

const setArchivedClientsTotalCount = (count: number): SetArchivedClientsTotalCountAT => ({
  type: SET_ARCHIVED_CLIENTS_TOTAL_COUNT, count
})

type ToggleIsClientDeletingInProcessActionType = {
  type: typeof TOGGLE_IS_CLIENT_DELETING_IN_PROCESS,
  isFetching: boolean,
  clientId: string
}

const toggleIsClientDeletingInProcess = (isFetching: boolean, clientId: string): ToggleIsClientDeletingInProcessActionType => (
    {
      type: TOGGLE_IS_CLIENT_DELETING_IN_PROCESS, isFetching, clientId
    }
)

type SetIsFetchingActionType = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean,
}

const setIsFetching = (isFetching: boolean): SetIsFetchingActionType => (
  {
    type: TOGGLE_IS_FETCHING, isFetching,
  }
)

type DeleteClientActionType = {
  type: typeof DELETE_CLIENT,
  clientId: string
}

const deleteClientAC = (clientId: string): DeleteClientActionType => ({
    type: DELETE_CLIENT, clientId
})

type DeleteArchivedClientAT = {
  type: typeof DELETE_ARCHIVED_CLIENT,
  clientId: string
}

const deleteArchivedClientAC = (clientId: string): DeleteArchivedClientAT => ({
  type: DELETE_ARCHIVED_CLIENT, clientId
})

type EditClientActionType = {
  type: typeof EDIT_CLIENT,
  client: ClientType
}

const editClientAC = (client: ClientType): EditClientActionType => (
  {
    type: EDIT_CLIENT, client
  }
)

type AddClientActionType = {
  type: typeof ADD_CLIENT,
  client: ClientType
}

const addClientAC = (client: ClientType): AddClientActionType => (
  {
    type: ADD_CLIENT, client
  }
)

type SetClientProfileActionType = {
  type: typeof SET_CLIENT_PROFILE,
  profile: ClientType
}

const setClientProfile = (profile: ClientType): SetClientProfileActionType => (
  {
    type: SET_CLIENT_PROFILE, profile
  }
)

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getClients = (
  currentClientPage: number,
  clientsPageSize: number,
  clientsFilter: ClientsFilterType
): ThunkType => async (
    dispatch,
    getState
) => {
  try {
    dispatch(setIsFetching(true))
    let response = await clientsAPI.getClients(
      currentClientPage,
      clientsPageSize,
      clientsFilter
    )
    dispatch(setClients(response.clients))
    dispatch(setClientsTotalCount(response.totalCount))
    dispatch(setIsFetching(false))
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
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
    dispatch(setIsFetching(true))
    let response = await clientsAPI.getArchivedClients(
        currentPage,
        pageSize,
        filter
    )
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedClients(response.clients))
      dispatch(setArchivedClientsTotalCount(response.totalCount))
      dispatch(setIsFetching(false))
    }
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const clientsOnPageChanged = (
    currentPage: number,
    pageSize: number,
    filter: ClientsFilterType
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setCurrentPage(currentPage))
    await dispatch(getClients(currentPage, pageSize, filter))
  } catch (e) {
    console.log(e)
  }
}

export const clientsOnFilterChanged = (
  pageSize: number,
  filter: ClientsFilterType
): ThunkType => async (dispatch) => {

  try {
    dispatch(setClientsFilter(filter))
    await dispatch(getClients(1, pageSize, filter))
  } catch (e) {
    console.log(e)
  }
}

export const deleteClient = (
    clientId: string,
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsClientDeletingInProcess(true, clientId))
    let response = await clientsAPI.deleteClient(clientId)
    console.log(response)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteClientAC(clientId))
      dispatch(toggleIsClientDeletingInProcess(false, clientId))
    }
  } catch (e) {
    console.log(e)
  }
}

export const deleteArchivedClient = (
    clientId: string,
): ThunkType => async (
    dispatch
) => {
  try {
    //dispatch(toggleIsClientDeletingInProcess(true, clientId))
    let response = await clientsAPI.deleteArchivedClient(clientId)
    console.log(response)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedClientAC(clientId))
      //dispatch(toggleIsClientDeletingInProcess(false, clientId))
    }
  } catch (e) {
    console.log(e)
  }
}

export const addClient = (
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.addClient(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      console.log("it is a hit!!!")
      dispatch(addClientAC(response.client))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e)
  }
}

export const editClient = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetching(true))
    let response = await clientsAPI.editClient(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(editClientAC(response.client))
      dispatch(setClientProfile(response.client))
      dispatch(setIsSuccessAC(true))
    }
    dispatch(setIsFetching(false))
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const getClientProfile = (
  clientId: string): ThunkType => async (
  dispatch
) => {
  //debugger
  dispatch(setIsFetching(true));
  try {
    let response = await clientsAPI.getClientProfile(clientId)
    if (response) {
      dispatch(setClientProfile(response))
      dispatch(setIsFetching(false))
    }
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const updateClientGallery = (
  id: string,
  values: any
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetching(true))
    let response = await clientsAPI.updateClientGallery(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client))
      dispatch(editClientAC(response.client))
    }
    dispatch(setIsFetching(false))
  } catch (e) {
    dispatch(setIsFetching(false))
    console.log(e)
  }
}

export const deleteClientGalleryPicture = (
    clientId: string,
    picture: string
): ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.deleteClientGalleryPicture(clientId, picture)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client))
      dispatch(editClientAC(response.client))
    }
  } catch (e) {
    console.log(e)
  }
}

export const archiveClient = (
    clientId: string
): ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.archiveClient(clientId)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteClientAC(clientId))
    }
  } catch (e) {
    console.log(e)
  }
}

export const reactivateClient = (
    clientId: string
) : ThunkType => async (dispatch) => {
  try {
    let response = await clientsAPI.reactivateClient(clientId)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedClientAC(clientId))
      dispatch(addClientAC(response.client))
    }
  } catch (e) {
    console.log(e)
  }
}
