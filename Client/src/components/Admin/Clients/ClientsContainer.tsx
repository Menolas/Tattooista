import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getClients,
  setCurrentClientsPageAC,
  addClient,
  deleteClient,
  editClient,
  ClientsFilterType,
  updateClientGallery,
  deleteClientGalleryPicture,
  archiveClient,
  setClientsPageSize,
  setIsSuccessAC,
  setClientsFilterAC, setAddClientApiErrorAC, setUpdateClientGalleryApiErrorAC
} from '../../../redux/Clients/clients-reducer'
import {
  getClientsIsFetching,
  getTotalClientsCount,
  getCurrentClientsPage,
  getClientsPageSize,
  getClientsSelector,
  getIsClientDeletingInProcessSelector,
  getClientsFilter,
  getIsSuccessSelector, getAddClientApiErrorSelector, getUpdateClientGalleryApiErrorSelector
} from '../../../redux/Clients/clients-selectors'
import { Clients } from './Clients'
//import {useNavigate} from "react-router-dom";

export const ClientsContainer: React.FC = () => {

  const isFetching = useSelector(getClientsIsFetching)
  const currentPage = useSelector(getCurrentClientsPage)
  const totalCount = useSelector(getTotalClientsCount)
  const pageSize = useSelector(getClientsPageSize)
  const clients = useSelector(getClientsSelector)
  const filter = useSelector(getClientsFilter)
  const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector)
  const isSuccess = useSelector(getIsSuccessSelector)
  const addClientApiError = useSelector(getAddClientApiErrorSelector)
  const updateClientGalleryApiError = useSelector(getUpdateClientGalleryApiErrorSelector)

  const dispatch = useDispatch()
  //const navigate = useNavigate()

  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search)
    // let actualPage = currentPage
    // let actualFilter = filter
    // if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
    // if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
    // if (!!urlParams.get('status')) actualFilter = { ...actualFilter, gallery: urlParams.get('gallery')}

    dispatch(getClients(currentPage, pageSize, filter))
  }, [currentPage, pageSize, filter])

  // useEffect(() => {
  //   navigate(`?term=${filter.term}&gallery=${filter.gallery}&page=${currentPage}`)
  // }, [filter, currentPage])

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentClientsPageAC(page))
  }

  const onFilterChanged = (
    filter: ClientsFilterType
  ) => {
    dispatch(setClientsFilterAC(filter))
  }

  const addClientCallBack = (
    values: FormData
  ) => {
    dispatch(addClient(values))
  }

  const deleteClientCallBack = (
    clientId: string
  ) => {
    dispatch(deleteClient(clientId))
  }

  const editClientCallBack = (
    clientId: string,
    values: FormData
  ) => {
    dispatch(editClient(clientId, values))
  }

  const setPageLimit = (
    clientsPageSize: number
  ) => {
    dispatch(setClientsPageSize(clientsPageSize))
  }

  const updateClientGalleryCallBack = (clientId: string, values: FormData) => {
    dispatch(updateClientGallery(clientId, values))
  }

  const deleteClientGalleryPictureCallBack = (clientId: string, picture: string) => {
    dispatch(deleteClientGalleryPicture(clientId, picture))
  }

  const archiveClientCallBack = (clientId: string) => {
    dispatch(archiveClient(clientId))
  }

  const setIsSuccessCallBack = (bol: boolean) => {
    dispatch(setIsSuccessAC(bol))
  }

  const setAddClientApiErrorCallBack = (error: string) => {
    dispatch(setAddClientApiErrorAC(error))
  }

  const setUpdateClientGalleryApiErrorCallBack = (error: string) => {
    dispatch(setUpdateClientGalleryApiErrorAC(error))
  }

  return (
      <Clients
          isFetching={isFetching}
          isSuccess={isSuccess}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          clients={clients}
          clientsFilter={filter}
          isDeletingInProcess={isDeletingInProcess}
          addClientApiError={addClientApiError}
          updateClientGalleryApiError={updateClientGalleryApiError}
          onPageChanged={setCurrentPageCallBack}
          onFilterChanged={onFilterChanged}
          addClient={addClientCallBack}
          deleteClient={deleteClientCallBack}
          editClient={editClientCallBack}
          setPageLimit={setPageLimit}
          updateClientGallery={updateClientGalleryCallBack}
          deleteClientGalleryPicture={deleteClientGalleryPictureCallBack}
          archiveClient={archiveClientCallBack}
          setIsSuccess={setIsSuccessCallBack}
          setAddClientApiError={setAddClientApiErrorCallBack}
          setUpdateClientGalleryApiError={setUpdateClientGalleryApiErrorCallBack}
      />
  )
}
