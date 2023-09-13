import { clientsAPI } from './clientApi'
import { ResultCodesEnum } from '../../utils/constants'
import { ClientType } from '../../types/Types'
import { AppStateType } from '../redux-store'
import { ThunkAction } from 'redux-thunk'
import type {} from 'redux-thunk/extend-redux'

const SET_CLIENTS_PAGE_SIZE = 'SET_CLIENTS_PAGE_SIZE'
const SET_ARCHIVED_CLIENTS_PAGE_SIZE = 'SET_ARCHIVED_CLIENTS_PAGE_SIZE'
const SET_CLIENTS_FILTER = 'SET_CLIENTS_FILTER'
const SET_CLIENTS = 'SET_CLIENTS'
const SET_ARCHIVED_CLIENTS = 'SET_ARCHIVED_CLIENTS'
const SET_CURRENT_PAGE_FOR_CLIENTS = 'SET_CURRENT_PAGE_FOR_CLIENTS'
const SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS = 'SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS'
const SET_FILTER_FOR_ARCHIVED_CLIENTS = 'SET_FILTER_FOR_ARCHIVED_CLIENTS'
const SET_TOTAL_CLIENTS_COUNT = 'SET_TOTAL_CLIENTS_COUNT'
const SET_ARCHIVED_CLIENTS_TOTAL_COUNT = 'SET_TOTAL_ARCHIVED_CLIENTS_COUNT'
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS'
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
  isDeletingInProcess: [] as Array<string>,
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

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
            ? [...state.isDeletingInProcess, action.id]
            : state.isDeletingInProcess.filter(id => id !== action.id)
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

type ActionsTypes = SetIsSuccessAT | SetClientsPageSizeAT | SetArchivedClientsPageSizeAT |
    SetClientsFilterAT | SetArchivedClientsFilterAT | SetClientsAT | SetCurrentPageAT |
    SetArchivedClientsAT | SetCurrentPageForArchivedClientsAT | SetClientsTotalCountAT |
    SetArchivedClientsTotalCountAT | ToggleIsDeletingInProcessAT |
    SetIsFetchingAT | DeleteClientAT | DeleteArchivedClientAT | EditClientAT |
    AddClientAT | SetClientProfileAT

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

type SetClientsPageSizeAT = {
  type: typeof  SET_CLIENTS_PAGE_SIZE
  clientsPageSize: number
}

export const setClientsPageSize = (clientsPageSize: number): SetClientsPageSizeAT => (
  {
    type: SET_CLIENTS_PAGE_SIZE, clientsPageSize
  }
)

type SetArchivedClientsPageSizeAT = {
  type: typeof SET_ARCHIVED_CLIENTS_PAGE_SIZE
  pageSize: number
}

export const setArchivedClientsPageSize = (pageSize: number): SetArchivedClientsPageSizeAT => ({
  type: SET_ARCHIVED_CLIENTS_PAGE_SIZE, pageSize
})

type SetClientsFilterAT = {
  type: typeof SET_CLIENTS_FILTER
  filter: ClientsFilterType
}

export const setClientsFilter = (filter: ClientsFilterType): SetClientsFilterAT => (
  {
    type: SET_CLIENTS_FILTER, filter
  }
)

type SetClientsAT = {
  type: typeof SET_CLIENTS,
  clients: Array<ClientType>
}

const setClients = (clients: Array<ClientType>): SetClientsAT => (
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

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE_FOR_CLIENTS,
  page: number
}

export const setCurrentClientsPageAC = (page: number): SetCurrentPageAT => (
  {
    type: SET_CURRENT_PAGE_FOR_CLIENTS, page
  }
)

type SetCurrentPageForArchivedClientsAT = {
  type: typeof SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS,
  page: number
}

export const setCurrentPageForArchivedClientsAC = (page: number): SetCurrentPageForArchivedClientsAT => ({
  type: SET_CURRENT_PAGE_FOR_ARCHIVED_CLIENTS, page
})

type SetClientsTotalCountAT = {
  type: typeof SET_TOTAL_CLIENTS_COUNT,
  count: number
}

const setClientsTotalCount = (count: number): SetClientsTotalCountAT => ({
      type: SET_TOTAL_CLIENTS_COUNT, count
})

type SetArchivedClientsTotalCountAT = {
  type: typeof SET_ARCHIVED_CLIENTS_TOTAL_COUNT,
  count: number
}

const setArchivedClientsTotalCount = (count: number): SetArchivedClientsTotalCountAT => ({
  type: SET_ARCHIVED_CLIENTS_TOTAL_COUNT, count
})

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

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean,
}

const setIsFetching = (isFetching: boolean): SetIsFetchingAT => (
  {
    type: TOGGLE_IS_FETCHING, isFetching,
  }
)

type DeleteClientAT = {
  type: typeof DELETE_CLIENT,
  clientId: string
}

const deleteClientAC = (clientId: string): DeleteClientAT => ({
    type: DELETE_CLIENT, clientId
})

type DeleteArchivedClientAT = {
  type: typeof DELETE_ARCHIVED_CLIENT,
  clientId: string
}

const deleteArchivedClientAC = (clientId: string): DeleteArchivedClientAT => ({
  type: DELETE_ARCHIVED_CLIENT, clientId
})

type EditClientAT = {
  type: typeof EDIT_CLIENT,
  client: ClientType
}

const editClientAC = (client: ClientType): EditClientAT => (
  {
    type: EDIT_CLIENT, client
  }
)

type AddClientAT = {
  type: typeof ADD_CLIENT,
  client: ClientType
}

const addClientAC = (client: ClientType): AddClientAT => (
  {
    type: ADD_CLIENT, client
  }
)

type SetClientProfileAT = {
  type: typeof SET_CLIENT_PROFILE,
  profile: ClientType
}

const setClientProfile = (profile: ClientType): SetClientProfileAT => (
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
    id: string,
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await clientsAPI.deleteClient(id)
    console.log(response)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteClientAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const deleteArchivedClient = (
    id: string,
): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await clientsAPI.deleteArchivedClient(id)
    console.log(response)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedClientAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
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
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(setIsFetching(false))
  }
}

export const deleteClientGalleryPicture = (
    id: string,
    picture: string
): ThunkType => async (dispatch) => {
  console.log("It is a hit on deleting!!!!")
  try {
    dispatch(toggleIsDeletingInProcessAC(true, picture))
    let response = await clientsAPI.deleteClientGalleryPicture(id, picture)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setClientProfile(response.client))
      dispatch(editClientAC(response.client))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, picture))
  }
}

export const archiveClient = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await clientsAPI.archiveClient(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteClientAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const reactivateClient = (
    id: string
) : ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await clientsAPI.reactivateClient(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedClientAC(id))
      dispatch(addClientAC(response.client))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}
