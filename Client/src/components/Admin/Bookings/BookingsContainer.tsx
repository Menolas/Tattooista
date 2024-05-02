import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookings,
  changeStatus,
  deleteBooking,
  turnBookingToClient,
  setPageSizeAC,
  addBooking,
  archiveBooking,
  setCurrentPageAC,
  setSuccessModalAC,
  setFilterAC,
  setApiErrorAC,
} from "../../../redux/Bookings/bookings-reducer";
import {
  getBookingsSelector,
  getBookedConsultationsPageSizeSelector,
  getTotalBookingsCountSelector,
  getCurrentBookedConsultationsPageSelector,
  getIsFetchingSelector,
  getFilterSelector,
  getIsStatusChangingSelector,
  getIsDeletingInProcessSelector,
  getSuccessModalSelector,
  getApiErrorSelector, getAccessErrorSelector
} from "../../../redux/Bookings/bookings-selectors";
import { Bookings } from "./Bookings";
import {AddConsultationFormValues, ContactsType, SearchFilterType} from "../../../types/Types";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";

export const BookingsContainer: React.FC = () => {

  const isFetching = useSelector(getIsFetchingSelector);
  const totalCount = useSelector(getTotalBookingsCountSelector);
  const currentPage = useSelector(getCurrentBookedConsultationsPageSelector);
  const pageSize = useSelector(getBookedConsultationsPageSizeSelector);
  const bookings = useSelector(getBookingsSelector);
  const filter = useSelector(getFilterSelector);
  const isStatusChanging = useSelector(getIsStatusChangingSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAccessErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBookings(token, currentPage, pageSize, filter));
  }, [token, currentPage, pageSize, filter]);

  useEffect(() => {
    dispatch(setCurrentPageAC(1));
  }, [filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentPageAC(page));
  }

  const onFilterChangedCallBack = (
    filter: SearchFilterType
  ) => {
    dispatch(setFilterAC(filter));
  }

  const changeStatusCallBack = (
    id: string,
    status: boolean
  ) => {
    dispatch(changeStatus(id, status));
  }

  const removeCallBack = (
      id: string,
  ) => {
    dispatch(deleteBooking(token, id, bookings, currentPage, totalCount, pageSize, filter));
  }

  const turnBookingToClientCallBack = (
    id: string,
    fullName: string,
    contacts?: ContactsType | {}
  ) => {
    dispatch(turnBookingToClient(token, id, fullName, contacts, bookings, currentPage, totalCount, pageSize, filter));
  }

  const setPageSizeCallBack = (
    pageSize: number
  ) => {
    dispatch(setPageSizeAC(pageSize));
  }

  const addCallBack = (values: AddConsultationFormValues) => {
    dispatch(addBooking(values, totalCount));
  }

  const archiveCallBack = (id: string) => {
    dispatch(archiveBooking(token, id, bookings, currentPage, totalCount, pageSize, filter))
  }

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(''));
  }

  return (
      <Bookings
        isFetching={isFetching}
        successModal={successModal}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        bookings={bookings}
        filter={filter}
        isStatusChanging={isStatusChanging}
        isDeletingInProcess={isDeletingInProcess}
        apiError={apiError}
        accessError={accessError}
        setCurrentPage={setCurrentPageCallBack}
        onFilterChanged={onFilterChangedCallBack}
        changeStatus={changeStatusCallBack}
        remove={removeCallBack}
        turnBookingToClient={turnBookingToClientCallBack}
        setPageLimit={setPageSizeCallBack}
        add={addCallBack}
        archive={archiveCallBack}
        setSuccessModal={setSuccessModalCallBack}
        setApiError={setApiErrorCallBack}
      />
  )
}
