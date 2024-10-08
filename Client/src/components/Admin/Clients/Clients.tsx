import * as React from "react";
import {useCallback, useState} from "react";
import { Client } from "./Client";
import { Paginator } from "../../common/Paginator";
import { ModalPopUp } from "../../common/ModalPopUp";
import { UpdateClientForm } from "../../Forms/UpdateClientForm";
import {SearchFilterType, ClientType} from "../../../types/Types";
import {NothingToShow} from "../../common/NothingToShow";
import {Preloader} from "../../common/Preloader";
import {clientFilterSelectOptions} from "../../../utils/constants";
import {Navigate} from "react-router";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";

type PropsType = {
  apiError: null | string;
  clientsApiError: null | string;
  isFetching: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  accessError: string | null;
  clients: Array<ClientType>;
  clientsFilter: SearchFilterType;
  isDeletingInProcess: Array<string>;
  isDeletingPicturesInProcess: Array<string>;
  isFavouriteChangingInProcess: Array<string>;
  onPageChanged: (page: number) => void;
  onFilterChanged: (filter: SearchFilterType) => void;
  toggleIsFavourite: (id: string) => void;
  remove: (clientId: string) => void;
  setPageLimit: (clientsPageSize: number) => void;
  archive: (clientId: string) => void;
  setApiError: () => void;
  setClientsApiError: () => void;
}

export const Clients: React.FC<PropsType> = React.memo(({
    apiError,
    clientsApiError,
    isFetching,
    totalCount,
    currentPage,
    pageSize,
    accessError,
    clients,
    clientsFilter,
    isDeletingInProcess,
    isDeletingPicturesInProcess,
    isFavouriteChangingInProcess,
    onPageChanged,
    onFilterChanged,
    toggleIsFavourite,
    remove,
    setPageLimit,
    archive,
    setApiError,
    setClientsApiError,
}) => {
  const [editGalleryMode, setEditGalleryMode] = useState<boolean>(false);
  const [addClientMode, setAddClientMode] = useState<boolean>(false);
  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [client, setClient] = useState<ClientType | null>(null);

  const closeModal = useCallback(() => {
    setAddClientMode(false);
    setEditClientMode(false);
    setEditGalleryMode(false);
    setClient(null);
    setClientsApiError();
  }, [setClientsApiError]);

  // useEffect(() => {
  //   if ((addClientMode || editClientMode || editGalleryMode) && clientsApiError === null) {
  //       closeModal();
  //   }
  // }, [clientsApiError, addClientMode, closeModal, editClientMode, editGalleryMode]);

  const refreshClientData = (updatedClient: ClientType | null) => {
      setClient(updatedClient);
  };

  const modalTitleAddClient = 'ADD CLIENT';
  const modalTitleUpdateClient = 'EDIT CLIENT';
  const modalUpdateGalleryTitle = 'Update Gallery';

  const clientsElements = clients
      .map(client => {
        return (
            <Client
                key={client._id}
                data={client}
                isDeletingInProcess={isDeletingInProcess}
                isFavouriteChangingInProcess={isFavouriteChangingInProcess}
                toggleIsFavourite={toggleIsFavourite}
                remove={remove}
                archive={archive}
                setData={setClient}
                setEditClientMode={setEditClientMode}
                setEditGalleryMode={setEditGalleryMode}
                setApiError={setClientsApiError}
            />
        )
      });

  return (
      <>
          <div className="admin__cards-header">
              <SearchFilterForm
                  isFavourite={true}
                  options={clientFilterSelectOptions}
                  filter={clientsFilter}
                  onFilterChanged={onFilterChanged}
              />
              <button
                  className="btn btn--bg btn--light-bg add-btn"
                  onClick={() => {
                      setAddClientMode(true);
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
              modalTitle={addClientMode
                  ? modalTitleAddClient
                  : editClientMode
                      ? modalTitleUpdateClient
                      : modalUpdateGalleryTitle}
              closeModal={closeModal}
          >
              { (editClientMode || addClientMode) &&
                  < UpdateClientForm
                      apiError={clientsApiError}
                      isEditing={editClientMode}
                      data={client}
                      closeModal={closeModal}
                  />
              }
              {editGalleryMode &&
                  <GalleryUploadForm
                      apiError={clientsApiError}
                      isEditPortfolio={false}
                      client={client}
                      refreshClientData={refreshClientData}
                      isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                      closeModal={closeModal}
                  />
              }
          </ModalPopUp>
          <ApiErrorMessageModal
              isOpen={!!apiError}
              error={apiError}
              closeModal={setApiError}
          />
      </>
  );
});

Clients.displayName = 'Clients';
