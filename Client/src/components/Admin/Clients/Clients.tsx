import * as React from "react";
import {useEffect, useState} from "react";
import { Client } from "./Client";
import { Paginator } from "../../common/Paginator";
import { ModalPopUp } from "../../common/ModalPopUp";
import { UpdateClientForm } from "../../Forms/UpdateClientFormFormik";
import { ClientType } from "../../../types/Types";
import { ClientsFilterType} from "../../../redux/Clients/clients-reducer";
import {NothingToShow} from "../../common/NothingToShow";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {Preloader} from "../../common/Preloader";
import {ApiErrorMessage} from "../../common/ApiErrorMessage";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {clientFilterSelectOptions} from "../../../utils/constants";
import {Navigate} from "react-router";
import {SuccessModalType} from "../../../redux/Bookings/bookings-reducer";

type PropsType = {
  isFetching: boolean
  successModal: SuccessModalType
  totalCount: number
  currentPage: number
  pageSize: number
  apiError: string
  accessError: string
  clients: Array<ClientType>
  clientsFilter: ClientsFilterType
  isDeletingInProcess: Array<string>
  isDeletingPicturesInProcess: Array<string>
  onPageChanged: (page: number) => void
  onFilterChanged: (filter: ClientsFilterType) => void
  addClient: (values: FormData) => void
  deleteClient: (clientId: string) => void
  editClient: (clientId: string, values: FormData) => void
  setPageLimit: (clientsPageSize: number) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (clientId: string) => void
  setSuccessModal: () => void
  setApiError: () => void
}

export const Clients: React.FC<PropsType> = React.memo(({
    isFetching,
    successModal,
    totalCount,
    currentPage,
    pageSize,
    apiError,
    accessError,
    clients,
    clientsFilter,
    isDeletingInProcess,
    isDeletingPicturesInProcess,
    onPageChanged,
    onFilterChanged,
    addClient,
    deleteClient,
    editClient,
    setPageLimit,
    updateClientGallery,
    deleteClientGalleryPicture,
    archiveClient,
    setSuccessModal,
    setApiError,
}) => {

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModal();
            }, 3000);
        }
    }, [setSuccessModal, successModal]);

  const [addClientMode, setAddClientMode] = useState<boolean>(false);
  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [client, setClient] = useState<ClientType>(null);

  const closeModal = () => {
    setAddClientMode(false);
    setEditClientMode(false);
    setClient(null);
  }

  const modalTitleAddClient = 'ADD CLIENT';
  const modalTitleUpdateClient = 'EDIT CLIENT';
  const modalUpdateGalleryTitle = 'Update Gallery';

  const clientsElements = clients
      .map(client => {
        return (
            <Client
                key={client._id}
                client={client}
                isDeletingInProcess={isDeletingInProcess}
                isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                deleteClient={deleteClient}
                archiveClient={archiveClient}
                setClient={setClient}
                setEditClientMode={setEditClientMode}
                updateClientGallery={updateClientGallery}
                deleteClientGalleryPicture={deleteClientGalleryPicture}
            />
        )
      });

  return (
      <>
          {(accessError && accessError !== '')
              ? <Navigate to="/noAccess"/>
              : <>
                  <div className="admin__cards-header">
                      <SearchFilterForm
                          options={clientFilterSelectOptions}
                          filter={clientsFilter}
                          onFilterChanged={onFilterChanged}
                      />
                      <button
                          className="btn btn--bg btn--light-bg add-btn"
                          onClick={() => {
                              setAddClientMode(true)
                          }}
                      >
                          Add Client
                      </button>
                      <Paginator
                          totalCount={totalCount}
                          pageSize={pageSize}
                          currentPage={currentPage}
                          onPageChanged={onPageChanged}
                          setPageLimit={setPageLimit}
                      />
                  </div>
                  {
                      isFetching
                          ? <Preloader/>
                          : totalCount && totalCount > 0
                              ? (
                                  <ul className="admin__cards-list list">
                                      {clientsElements}
                                  </ul>
                              )
                              : <NothingToShow/>
                  }
                  <ModalPopUp
                      isOpen={addClientMode || editClientMode}
                      modalTitle={ addClientMode
                          ? modalTitleAddClient
                          : editClientMode
                              ? modalTitleUpdateClient
                              : modalUpdateGalleryTitle }
                      closeModal={closeModal}
                  >
                      { (editClientMode || addClientMode) &&
                          < UpdateClientForm
                              isEditing={editClientMode}
                              profile={client}
                              editClient={editClient}
                              addClient={addClient}
                              closeModal={closeModal}
                          />
                      }
                  </ModalPopUp>
                  <SuccessPopUp
                      isOpen={successModal.isSuccess}
                      closeModal={setSuccessModal}
                      content={successModal.successText}
                  />
                  <ApiErrorMessage
                      isOpen={!!apiError}
                      error={apiError}
                      closeModal={setApiError}
                  />
              </>
          }
      </>
  )
});
