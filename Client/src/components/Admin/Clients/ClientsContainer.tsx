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
  setClientsApiErrorAC,
  toggleFavourite,
} from "../../../redux/Clients/clients-reducer";
import {
  getClientsIsFetchingSelector,
  getTotalClientsCountSelector,
  getCurrentClientsPageSelector,
  getClientsSelector,
  getIsClientDeletingInProcessSelector,
  getClientsFilterSelector,
  getClientsPageSizeSelector,
  getIsDeletingPicturesInProcessSelector,
  getClientsApiErrorSelector,
  getClientsIsFavouriteChangingInProcessSelector,
} from "../../../redux/Clients/clients-selectors";
import { Clients } from "./Clients";
import {getAuthAccessErrorSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../../types/Types";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../redux/redux-store";

export const ClientsContainer: React.FC = () => {

  const isFetching = useSelector(getClientsIsFetchingSelector);
  const currentPage = useSelector(getCurrentClientsPageSelector);
  const totalCount = useSelector(getTotalClientsCountSelector);
  const pageSize = useSelector(getClientsPageSizeSelector);
  const clients = useSelector(getClientsSelector);
  const filter = useSelector(getClientsFilterSelector);
  const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector);
  const isDeletingPicturesInProcess = useSelector(getIsDeletingPicturesInProcessSelector);
  const isFavouriteChangingInProcess = useSelector(getClientsIsFavouriteChangingInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAuthAccessErrorSelector);
  const clientsApiError = useSelector(getClientsApiErrorSelector);
  const apiError = useSelector(getApiErrorSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getClients(token || "", currentPage, pageSize, filter));

  }, [dispatch, token, currentPage, pageSize, filter]);

  useEffect(() => {
    if (currentPage !== 1) {
      dispatch(setClientsCurrentPageAC(1));
    }
  }, [dispatch, filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setClientsCurrentPageAC(page));
  };

  const onFilterChangedCallBack = (
    filter: SearchFilterType
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
