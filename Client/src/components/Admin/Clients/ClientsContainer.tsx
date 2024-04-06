import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
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
  setClientsFilterAC,
  setAddClientApiErrorAC,
  setUpdateClientGalleryApiErrorAC
} from "../../../redux/Clients/clients-reducer";
import {
  getClientsIsFetching,
  getTotalClientsCount,
  getCurrentClientsPage,
  getClientsSelector,
  getIsClientDeletingInProcessSelector,
  getIsSuccessSelector,
  getAddClientApiErrorSelector,
  getUpdateClientGalleryApiErrorSelector,
  getClientsFilterSelector,
  getClientsPageSizeSelector, getIsDeletingPicturesInProcessSelector
} from "../../../redux/Clients/clients-selectors";
import { Clients } from "./Clients";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {getAccessErrorSelector} from "../../../redux/Bookings/bookings-selectors";
import {checkAuth} from "../../../redux/Auth/auth-reducer";

export const ClientsContainer: React.FC = () => {

  const isFetching = useSelector(getClientsIsFetching);
  const currentPage = useSelector(getCurrentClientsPage);
  const totalCount = useSelector(getTotalClientsCount);
  const pageSize = useSelector(getClientsPageSizeSelector);
  const clients = useSelector(getClientsSelector);
  const filter = useSelector(getClientsFilterSelector);
  const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcessSelector);
  const isSuccess = useSelector(getIsSuccessSelector);
  const addClientApiError = useSelector(getAddClientApiErrorSelector);
  const updateClientGalleryApiError = useSelector(getUpdateClientGalleryApiErrorSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAccessErrorSelector);

  console.log(token + " state token !!!!!!!!!!!!!!!!!");

  const dispatch = useDispatch();

  // @ts-ignore
  useEffect(() => {
    console.log(token + " token from dispatch!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    dispatch(getClients(token, currentPage, pageSize, filter));

  }, [currentPage, pageSize, filter]);

  useEffect(() => {
    dispatch(setCurrentClientsPageAC(1));
  }, [filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentClientsPageAC(page));
  }

  const onFilterChangedCallBack = (
    filter: ClientsFilterType
  ) => {
    dispatch(setClientsFilterAC(filter));
  }

  const addClientCallBack = (
    values: FormData
  ) => {
    dispatch(addClient(values, totalCount));
  }

  const deleteClientCallBack = (
    clientId: string
  ) => {
    dispatch(deleteClient(token, clientId, clients, currentPage, totalCount, pageSize, filter));
  }

  const editClientCallBack = (
    clientId: string,
    values: FormData
  ) => {
    dispatch(editClient(clientId, values));
  }

  const setPageLimitCallBack = (
    clientsPageSize: number
  ) => {
    dispatch(setClientsPageSize(clientsPageSize));
  }

  const updateClientGalleryCallBack = (clientId: string, values: FormData) => {
    dispatch(updateClientGallery(clientId, values));
  }

  const deleteClientGalleryPictureCallBack = (clientId: string, picture: string) => {
    dispatch(deleteClientGalleryPicture(clientId, picture));
  }

  const archiveClientCallBack = (clientId: string) => {
    dispatch(archiveClient(token, clientId, clients, currentPage, totalCount, pageSize, filter));
  }

  const setIsSuccessCallBack = (bol: boolean) => {
    dispatch(setIsSuccessAC(bol));
  }

  const setAddClientApiErrorCallBack = (error: string) => {
    dispatch(setAddClientApiErrorAC(error));
  }

  const setUpdateClientGalleryApiErrorCallBack = (error: string) => {
    dispatch(setUpdateClientGalleryApiErrorAC(error));
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
          isDeletingPicturesInProcess={isDeletingPicturesInProcess}
          addClientApiError={addClientApiError}
          updateClientGalleryApiError={updateClientGalleryApiError}
          accessError={accessError}
          onPageChanged={setCurrentPageCallBack}
          onFilterChanged={onFilterChangedCallBack}
          addClient={addClientCallBack}
          deleteClient={deleteClientCallBack}
          editClient={editClientCallBack}
          setPageLimit={setPageLimitCallBack}
          updateClientGallery={updateClientGalleryCallBack}
          deleteClientGalleryPicture={deleteClientGalleryPictureCallBack}
          archiveClient={archiveClientCallBack}
          setIsSuccess={setIsSuccessCallBack}
          setAddClientApiError={setAddClientApiErrorCallBack}
          setUpdateClientGalleryApiError={setUpdateClientGalleryApiErrorCallBack}
      />
  )
}
