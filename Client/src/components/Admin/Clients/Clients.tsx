import * as React from 'react'
import {useEffect, useState} from 'react'
import { Client } from './Client'
import { Paginator } from '../../common/Paginator'
import { ModalPopUp } from '../../common/ModalPopUp'
import { UpdateClientForm } from '../../Forms/UpdateClientFormFormik'
import { ClientType } from '../../../types/Types'
import { ClientSearchFormFormik } from '../../Forms/ClientSearchFormFormik'
import { ClientsFilterType} from '../../../redux/Clients/clients-reducer'
import {NothingToShow} from "../../common/NothingToShow"
import {SuccessPopUp} from "../../common/SuccessPopUp"
import {useDispatch} from "react-redux"
import {setIsSuccessAC} from "../../../redux/Portfolio/portfolio-reducer"
import {Preloader} from "../../common/Preloader";
import {BookingApiError} from "../../common/BookindApiError";

type PropsType = {
  isFetching: boolean
  isSuccess: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  addClientApiError: string
  updateClientGalleryApiError: string
  clients: Array<ClientType>
  clientsFilter: ClientsFilterType
  isDeletingInProcess: Array<string>
  onPageChanged: (page: number) => void
  onFilterChanged: (filter: ClientsFilterType) => void
  addClient: (values: FormData) => void
  deleteClient: (clientId: string, pageSize: number, currentPage: number) => void
  editClient: (clientId: string, values: FormData) => void
  setPageLimit: (clientsPageSize: number) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (clientId: string) => void
  setIsSuccess: (bol: boolean) => void
  setAddClientApiError: (error: string) => void
  setUpdateClientGalleryApiError: (error: string) => void
}

export const Clients: React.FC<PropsType> = React.memo(({
    isFetching,
    isSuccess,
    totalCount,
    currentPage,
    pageSize,
    addClientApiError,
    updateClientGalleryApiError,
    clients,
    clientsFilter,
    isDeletingInProcess,
    onPageChanged,
    onFilterChanged,
    addClient,
    deleteClient,
    editClient,
    setPageLimit,
    updateClientGallery,
    deleteClientGalleryPicture,
    archiveClient,
    setIsSuccess,
    setAddClientApiError,
    setUpdateClientGalleryApiError
}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSuccess) {
            setTimeout( () => {
                setIsSuccess(false)
            }, 1500)
        }
    }, [isSuccess])

    useEffect(() => {
        if (addClientApiError) {
            setTimeout( () => {
                setAddClientApiError('')
            }, 1500)
        }
    }, [addClientApiError])

    useEffect(() => {
        if (updateClientGalleryApiError) {
            setTimeout( () => {
                setUpdateClientGalleryApiError('')
            }, 1500)
        }
    }, [updateClientGalleryApiError])

  let [addClientMode, setAddClientMode] = useState<boolean>(false)

  const closeModal = () => {
    setAddClientMode(false)
  }

  const modalTitle = 'ADD CLIENT'
  const successPopUpContent = "You successfully added changes to your clients list"

  const clientsElements = clients
      .map(client => {
        return (
            <Client
                key={client._id}
                client={client}
                isDeletingInProcess={isDeletingInProcess}
                deleteClient={deleteClient}
                editClient={editClient}
                pageSize={pageSize}
                currentPage={currentPage}
                updateClientGallery={updateClientGallery}
                deleteClientGalleryPicture={deleteClientGalleryPicture}
                archiveClient={archiveClient}
            />
        )
      })

  return (
      <>
        <div className="admin__cards-header">
          { totalCount > pageSize &&
              <ClientSearchFormFormik
                clientsFilter={clientsFilter}
                onFilterChanged={onFilterChanged}
              />
          }
          <Paginator
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChanged={onPageChanged}
              setPageLimit={setPageLimit}
          />
          <button
            className="btn btn--bg btn--light-bg"
            onClick={() => {setAddClientMode(true)}}
          >
            Add Client
          </button>
        </div>
        {
            isFetching
                ? <Preloader />
                : totalCount && totalCount > 0
                  ? (
                      <ul className="admin__cards-list list">
                            { clientsElements }
                      </ul>
                    )
                  : <NothingToShow/>
        }
        { addClientMode &&
          <ModalPopUp
            modalTitle={modalTitle}
            closeModal={closeModal}
          >
          <UpdateClientForm
            addClient={addClient}
            closeModal={closeModal}
          />
          </ModalPopUp>
        }

        {
          isSuccess &&
          <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent} />
        }

        { addClientApiError && addClientApiError !== '' &&
            <BookingApiError error={addClientApiError}/>
        }

        { updateClientGalleryApiError && updateClientGalleryApiError !== '' &&
          <BookingApiError error={updateClientGalleryApiError}/>
        }
      </>
  )
})
