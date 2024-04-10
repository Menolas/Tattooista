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
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";

type PropsType = {
  isFetching: boolean
  isSuccess: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  addClientApiError: string
  updateClientGalleryApiError: string
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
    setIsSuccess,
    setAddClientApiError,
    setUpdateClientGalleryApiError
}) => {

    useEffect(() => {
        if (isSuccess) {
            setTimeout( () => {
                setIsSuccess(false);
            }, 1500)
        }
    }, [isSuccess]);

  const [addClientMode, setAddClientMode] = useState<boolean>(false);
  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [editGalleryMode, setEditGalleryMode] = useState<boolean>(false);
  const [client, setClient] = useState(null);
  const [clientGallery, setClientGallery] = useState(null);

  const closeModal = () => {
    setAddClientMode(false);
    setEditClientMode(false);
    setEditGalleryMode(false);
    setClient(null);
    setClientGallery(null);
  }

  const closeSuccessCallBack = () => {
        setIsSuccess(false);
  }

  const modalTitleAddClient = 'ADD CLIENT';
  const modalTitleUpdateClient = 'EDIT CLIENT';
  const successPopUpContent = "You successfully added changes to your clients list";

  const clientsElements = clients
      .map(client => {
        return (
            <Client
                key={client._id}
                client={client}
                isDeletingInProcess={isDeletingInProcess}
                isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                deleteClient={deleteClient}
                updateClientGallery={updateClientGallery}
                deleteClientGalleryPicture={deleteClientGalleryPicture}
                archiveClient={archiveClient}
                setClient={setClient}
                setEditClientMode={setEditClientMode}
                setEditGalleryMode={setEditGalleryMode}
                setClientGallery={setClientGallery}
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
                      isOpen={addClientMode || editClientMode || editGalleryMode}
                      modalTitle={addClientMode ? modalTitleAddClient : editClientMode ? modalTitleUpdateClient : ''}
                      closeModal={closeModal}
                  >
                      { (editClientMode || addClientMode) &&
                          < UpdateClientForm
                          profile={client}
                          editClient={editClient}
                          addClient={addClient}
                          closeModal={closeModal}
                          />
                      }
                  </ModalPopUp>
                  <ModalPopUp
                      isOpen={editGalleryMode}
                      modalTitle="Edit Gallery"
                      closeModal={closeModal}
                  >
                      {editGalleryMode &&
                          <GalleryUploadForm
                              updateId={client._id}
                              gallery={client.gallery}
                              isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                              updateGallery={updateClientGallery}
                              deleteClientGalleryPicture={deleteClientGalleryPicture}
                              closeModal={closeModal}
                          />
                      }
                  </ModalPopUp>
                  <SuccessPopUp
                      isOpen={isSuccess}
                      closeModal={closeSuccessCallBack}
                      content={successPopUpContent}
                  />
                  {addClientApiError && addClientApiError !== '' &&
                      <ApiErrorMessage
                          error={addClientApiError}
                          closeModal={setAddClientApiError}
                      />
                  }
                  {updateClientGalleryApiError && updateClientGalleryApiError !== '' &&
                      <ApiErrorMessage
                          error={updateClientGalleryApiError}
                          closeModal={setUpdateClientGalleryApiError}
                      />
                  }
              </>
          }
      </>
  )
})
