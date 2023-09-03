import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  getClients,
  clientsOnPageChanged,
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
  getIsClientDeletingInProcess,
  getClientsFilter,
  getIsSuccessSelector
} from '../../../redux/Clients/clients-selectors'
import { Clients } from './Clients'
import { Preloader } from '../../common/Preloader'
import {useNavigate} from "react-router-dom";

export const ClientsContainer: React.FC = () => {

  const clientsIsFetching = useSelector(getClientsIsFetching)
  const currentClientsPage = useSelector(getCurrentClientsPage)
  const totalClientsCount = useSelector(getTotalClientsCount)
  const clientsPageSize = useSelector(getClientsPageSize)
  const clients = useSelector(getClientsSelector)
  const clientsFilter = useSelector(getClientsFilter)
  const isClientDeletingInProcess = useSelector(getIsClientDeletingInProcess)
  const isSuccess = useSelector(getIsSuccessSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    let actualPage = currentClientsPage
    let actualFilter = clientsFilter

    if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
    if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
    if (!!urlParams.get('status')) actualFilter = { ...actualFilter, gallery: urlParams.get('gallery')}


    dispatch(getClients(actualPage, clientsPageSize, actualFilter))
  }, [])

  useEffect(() => {
    navigate(`?term=${clientsFilter.term}&gallery=${clientsFilter.gallery}&page=${currentClientsPage}`)
  }, [clientsFilter, currentClientsPage])

  const onPageChangedCallBack = (
    currentPage: number
  ) => {
    dispatch(clientsOnPageChanged(currentPage, clientsPageSize, clientsFilter))
  }

  const onFilterChanged = (
    filter: ClientsFilterType
  ) => {
    dispatch(clientsOnFilterChanged(clientsPageSize, filter))
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
    <>
      { clientsIsFetching
        ? <Preloader/>
        : <Clients
            isSuccess={isSuccess}
            totalCount={totalClientsCount}
            currentPage={currentClientsPage}
            pageSize={clientsPageSize}
            clients={clients}
            clientsFilter={clientsFilter}
            isClientDeletingInProcess={isClientDeletingInProcess}
            onPageChanged={onPageChangedCallBack}
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
      }
    </>
  )
}
