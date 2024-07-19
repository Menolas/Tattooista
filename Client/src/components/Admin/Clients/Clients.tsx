import * as React from "react";
import {useEffect, useState} from "react";
import { Client } from "./Client";
import { Paginator } from "../../common/Paginator";
import { ModalPopUp } from "../../common/ModalPopUp";
import { UpdateClientForm } from "../../Forms/UpdateClientForm";
import {ClientType, SearchFilterType} from "../../../types/Types";
import {NothingToShow} from "../../common/NothingToShow";
import {Preloader} from "../../common/Preloader";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {clientFilterSelectOptions} from "../../../utils/constants";
import {Navigate} from "react-router";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";

type PropsType = {
  clientsApiError: null | string;
  apiError: null | string;
  isFetching: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  accessError: string | null;
  clients: Array<ClientType>;
  clientsFilter: SearchFilterType;
  isDeletingInProcess: Array<string>;
  isDeletingPicturesInProcess: Array<string>;
  onPageChanged: (page: number) => void;
  onFilterChanged: (filter: SearchFilterType) => void;
  remove: (clientId: string) => void;
  setPageLimit: (clientsPageSize: number) => void;
  deleteGalleryItem: (clientId: string, picture: string) => void;
  archive: (clientId: string) => void;
  setClientsApiError: () => void;
  setApiError: () => void;
}

export const Clients: React.FC<PropsType> = React.memo(({
    clientsApiError,
    apiError,
    isFetching,
    totalCount,
    currentPage,
    pageSize,
    accessError,
    clients,
    clientsFilter,
    isDeletingInProcess,
    isDeletingPicturesInProcess,
    onPageChanged,
    onFilterChanged,
    remove,
    setPageLimit,
    deleteGalleryItem,
    archive,
    setClientsApiError,
    setApiError,
}) => {

  const [addClientMode, setAddClientMode] = useState<boolean>(false);
  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [client, setClient] = useState<ClientType | null>(null);

  useEffect(() => {
    if ((addClientMode || editClientMode) && apiError === null) {
        closeModal();
    }
  }, [apiError]);

  const closeModal = () => {
    setAddClientMode(false);
    setEditClientMode(false);
    setClient(null);
    setApiError();
  }

  const modalTitleAddClient = 'ADD CLIENT';
  const modalTitleUpdateClient = 'EDIT CLIENT';
  const modalUpdateGalleryTitle = 'Update Gallery';

  const clientsElements = clients
      .map(client => {
        return (
            <Client
                apiError={clientsApiError}
                key={client._id}
                data={client}
                isDeletingInProcess={isDeletingInProcess}
                isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                remove={remove}
                archive={archive}
                setData={setClient}
                setEditClientMode={setEditClientMode}
                deleteGalleryItem={deleteGalleryItem}
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
                              apiError={apiError}
                              isEditing={editClientMode}
                              data={client}
                              closeModal={closeModal}
                          />
                      }
                  </ModalPopUp>
                  {/*<ApiErrorMessageModal*/}
                  {/*    isOpen={!!clientsApiError}*/}
                  {/*    error={clientsApiError}*/}
                  {/*    closeModal={setClientsApiError}*/}
                  {/*/>*/}
              </>
          }
      </>
  );
});

Clients.displayName = 'Clients';
