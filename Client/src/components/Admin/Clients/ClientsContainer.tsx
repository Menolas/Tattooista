import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getClients,
  setCurrentClientsPageAC,
  clientsOnFilterChanged,
  addClient,
  deleteClient,
  editClient,
  ClientsFilterType,
  updateClientGallery,
  deleteClientGalleryPicture,
  archiveClient,
  setClientsPageSize,
  setIsSuccessAC
} from '../../../redux/Clients/clients-reducer'
import {
  getClientsIsFetching,
  getTotalClientsCount,
  getCurrentClientsPage,
  getClientsPageSize,
  getClientsSelector,
  getIsClientDeletingInProcessSelector,
  getClientsFilter,
  getIsSuccessSelector
} from '../../../redux/Clients/clients-selectors'
import { Clients } from './Clients'
import { Preloader } from '../../common/Preloader'
import {useNavigate} from "react-router-dom";

export const ClientsContainer: React.FC = () => {

  const isFetching = useSelector(getClientsIsFetching)
  const currentPage = useSelector(getCurrentClientsPage)
  const totalCount = useSelector(getTotalClientsCount)
  const pageSize = useSelector(getClientsPageSize)
  const clients = useSelector(getClientsSelector)
  const filter = useSelector(getClientsFilter)
  const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector)
  const isSuccess = useSelector(getIsSuccessSelector)

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
    dispatch(clientsOnFilterChanged(pageSize, filter))
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
      />
  )
}
