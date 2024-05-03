import * as React from "react";
import {useEffect, useState} from "react";
import { Client } from "./Client";
import { Paginator } from "../../common/Paginator";
import { ModalPopUp } from "../../common/ModalPopUp";
import { UpdateClientForm } from "../../Forms/UpdateClientForm";
import {ClientType, SearchFilterType} from "../../../types/Types";
import {NothingToShow} from "../../common/NothingToShow";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {Preloader} from "../../common/Preloader";
import {ApiErrorMessage} from "../../common/ApiErrorMessage";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {clientFilterSelectOptions} from "../../../utils/constants";
import {Navigate} from "react-router";
import {SuccessModalType} from "../../../redux/Bookings/bookings-reducer";

type PropsType = {
  isFetching: boolean;
  successModal: SuccessModalType;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  apiError: string;
  accessError: string;
  clients: Array<ClientType>;
  clientsFilter: SearchFilterType;
  isDeletingInProcess: Array<string>;
  isDeletingPicturesInProcess: Array<string>;
  onPageChanged: (page: number) => void;
  onFilterChanged: (filter: SearchFilterType) => void;
  add: (values: FormData) => void;
  remove: (clientId: string) => void;
  edit: (clientId: string, values: FormData) => void;
  setPageLimit: (clientsPageSize: number) => void;
  updateGallery: (clientId: string, values: FormData) => void;
  deleteGalleryItem: (clientId: string, picture: string) => void;
  archive: (clientId: string) => void;
  setSuccessModal: () => void;
  setApiError: () => void;
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
    add,
    remove,
    edit,
    setPageLimit,
    updateGallery,
    deleteGalleryItem,
    archive,
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
                data={client}
                isDeletingInProcess={isDeletingInProcess}
                isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                remove={remove}
                archive={archive}
                setData={setClient}
                setEditClientMode={setEditClientMode}
                updateGallery={updateGallery}
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
                              isEditing={editClientMode}
                              data={client}
                              edit={edit}
                              add={add}
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
