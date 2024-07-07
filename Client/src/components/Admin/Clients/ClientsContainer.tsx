import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  getClients,
  setCurrentPageAC,
  deleteClient,
  updateClientGallery,
  deleteClientGalleryPicture,
  archiveClient,
  setPageSize,
  setFilterAC,
  setClientsApiErrorAC,
} from "../../../redux/Clients/clients-reducer";
import {
  getClientsIsFetching,
  getTotalClientsCount,
  getCurrentClientsPage,
  getClientsSelector,
  getIsClientDeletingInProcessSelector,
  getClientsFilterSelector,
  getClientsPageSizeSelector,
  getIsDeletingPicturesInProcessSelector,
  getClientsApiErrorSelector,
} from "../../../redux/Clients/clients-selectors";
import { Clients } from "./Clients";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {getAccessErrorSelector} from "../../../redux/Bookings/bookings-selectors";
import {SearchFilterType} from "../../../types/Types";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const ClientsContainer: React.FC = () => {

  const isFetching = useSelector(getClientsIsFetching);
  const currentPage = useSelector(getCurrentClientsPage);
  const totalCount = useSelector(getTotalClientsCount);
  const pageSize = useSelector(getClientsPageSizeSelector);
  const clients = useSelector(getClientsSelector);
  const filter = useSelector(getClientsFilterSelector);
  const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAccessErrorSelector);
  const apiError = useSelector(getApiErrorSelector);
  const clientsApiError = useSelector(getClientsApiErrorSelector);

  const dispatch = useDispatch();

  const [hasFetchedItems, setHasFetchedItems] = useState(false);

  useEffect(() => {
    dispatch(getClients(token, currentPage, pageSize, filter)).then(() => {
      //setHasFetchedItems(true);
    });
    // if (!hasFetchedItems) {
    //   dispatch(getClients(token, currentPage, pageSize, filter)).then(() => {
    //     setHasFetchedItems(true);
    //   });
    // }

  }, [dispatch, token, currentPage, pageSize, filter]);

  useEffect(() => {
    dispatch(setCurrentPageAC(1));
  }, [dispatch, filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentPageAC(page));
  };

  const onFilterChangedCallBack = (
    filter: SearchFilterType
  ) => {
    dispatch(setFilterAC(filter));
  };

  const deleteClientCallBack = (
    clientId: string
  ) => {
    dispatch(deleteClient(token, clientId, clients, currentPage, pageSize, filter));
  };

  const setPageLimitCallBack = (
    clientsPageSize: number
  ) => {
    dispatch(setPageSize(clientsPageSize));
  };

  const updateClientGalleryCallBack = (clientId: string, values: FormData) => {
    dispatch(updateClientGallery(clientId, values));
  };

  const deleteClientGalleryPictureCallBack = (clientId: string, picture: string) => {
    dispatch(deleteClientGalleryPicture(clientId, picture));
  };

  const archiveClientCallBack = (clientId: string) => {
    dispatch(archiveClient(token, clientId, clients, currentPage, pageSize, filter));
  };

  const setClientsApiErrorCallBack = () => {
    dispatch(setClientsApiErrorAC(null));
  };

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  }

  return (
      <Clients
          clientsApiError={clientsApiError}
          apiError={apiError}
          isFetching={isFetching}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          clients={clients}
          clientsFilter={filter}
          isDeletingInProcess={isDeletingInProcess}
          isDeletingPicturesInProcess={isDeletingPicturesInProcess}
          accessError={accessError}
          onPageChanged={setCurrentPageCallBack}
          onFilterChanged={onFilterChangedCallBack}
          remove={deleteClientCallBack}
          setPageLimit={setPageLimitCallBack}
          updateGallery={updateClientGalleryCallBack}
          deleteGalleryItem={deleteClientGalleryPictureCallBack}
          archive={archiveClientCallBack}
          setClientsApiError={setClientsApiErrorCallBack}
          setApiError={setApiErrorCallBack}
      />
  )
}
