import * as React from "react";
import {useEffect,} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  getClients,
  setClientsCurrentPageAC,
  deleteClient,
  archiveClient,
  setPageSize,
  setFilterAC,
  setClientsApiErrorAC, setIsFavouriteAC, toggleFavourite,
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
  getClientsApiErrorSelector, getClientsIsFavouriteChangingInProcessSelector,
} from "../../../redux/Clients/clients-selectors";
import { Clients } from "./Clients";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {getAccessErrorSelector} from "../../../redux/Bookings/bookings-selectors";
import {ClientsSearchFilterType, SearchFilterType} from "../../../types/Types";
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
  const isFavouriteChangingInProcess = useSelector(getClientsIsFavouriteChangingInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAccessErrorSelector);
  const clientsApiError = useSelector(getClientsApiErrorSelector);
  const apiError = useSelector(getApiErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClients(token || "", currentPage, pageSize, filter));

  }, [dispatch, token, currentPage, pageSize, filter]);

  useEffect(() => {
    dispatch(setClientsCurrentPageAC(1));
  }, [dispatch, filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setClientsCurrentPageAC(page));
  };

  const onFilterChangedCallBack = (
    filter: ClientsSearchFilterType
  ) => {
    dispatch(setFilterAC(filter));
  };

  const toggleIsFavouriteCallBack = (id:string) => {
    dispatch(toggleFavourite(token, id));
  }

  const deleteClientCallBack = (
    clientId: string
  ) => {
    dispatch(deleteClient(token || "", clientId, clients, currentPage, pageSize, filter));
  };

  const setPageLimitCallBack = (
    clientsPageSize: number
  ) => {
    dispatch(setPageSize(clientsPageSize));
  };

  const archiveClientCallBack = (clientId: string) => {
    dispatch(archiveClient(token || "", clientId, clients, currentPage, pageSize, filter));
  };

  const setClientsApiErrorCallBack = () => {
    dispatch(setClientsApiErrorAC(null));
  };

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

  return (
      <Clients
          apiError={apiError}
          clientsApiError={clientsApiError}
          isFetching={isFetching}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          clients={clients}
          clientsFilter={filter}
          isDeletingInProcess={isDeletingInProcess}
          isDeletingPicturesInProcess={isDeletingPicturesInProcess}
          isFavouriteChangingInProcess={isFavouriteChangingInProcess}
          accessError={accessError}
          onPageChanged={setCurrentPageCallBack}
          onFilterChanged={onFilterChangedCallBack}
          toggleIsFavourite={toggleIsFavouriteCallBack}
          remove={deleteClientCallBack}
          setPageLimit={setPageLimitCallBack}
          archive={archiveClientCallBack}
          setApiError={setApiErrorCallBack}
          setClientsApiError={setClientsApiErrorCallBack}
      />
  );
};
