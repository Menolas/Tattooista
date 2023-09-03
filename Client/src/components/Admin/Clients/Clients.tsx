import * as React from 'react'
import { useState } from 'react'
import { Client } from './Client'
import { Paginator } from '../../common/Paginator'
import { ModalPopUp } from '../../common/ModalPopUp'
import { UpdateClientForm } from '../../Forms/UpdateClientFormFormik'
import { ClientType } from '../../../types/Types'
import { ClientSearchFormFormik } from '../../Forms/ClientSearchFormFormik'
import { ClientsFilterType} from '../../../redux/Clients/clients-reducer'
import {SuccessModal} from "../../SuccessModal";
import {NothingToShow} from "../../common/NothingToShow";
import {SuccessPopUp} from "../../common/SuccessPopUp";

type PropsType = {
  isSuccess: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  clients: Array<ClientType>
  clientsFilter: ClientsFilterType
  isClientDeletingInProcess: Array<string>
  onPageChanged: (currentPage: number) => void
  onFilterChanged: (filter: ClientsFilterType) => void
  addClient: (values: FormData) => void
  deleteClient: (clientId: string, pageSize: number, currentPage: number) => void
  editClient: (clientId: string, values: FormData) => void
  setPageLimit: (clientsPageSize: number) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (clientId: string) => void
  setIsSuccess: (bol: boolean) => void
}

export const Clients: React.FC<PropsType> = React.memo(({
    isSuccess,
    totalCount,
    currentPage,
    pageSize,
    clients,
    clientsFilter,
    isClientDeletingInProcess,
    onPageChanged,
    onFilterChanged,
    addClient,
    deleteClient,
    editClient,
    setPageLimit,
    updateClientGallery,
    deleteClientGalleryPicture,
    archiveClient,
    setIsSuccess
}) => {

  let [addClientMode, setAddClientMode] = useState<boolean>(false)
  const successModalTitle = ''

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
        { clients.length > 0
          ? <ul className="admin__cards-list list">
                { clientsElements }
            </ul>
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
      </>
  )
})
