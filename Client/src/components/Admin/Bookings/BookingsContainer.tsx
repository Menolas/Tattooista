import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookedConsultations,
  changeBookedConsultationStatus,
  deleteBookedConsultation,
  turnConsultationToClient,
  setBookedConsultationsPageSizeAC,
  addBookedConsultation,
  BookedConsultationsFilterType,
  archiveConsultation,
  setCurrentPageForBookedConsultationsAC,
  setSuccessModalAC,
  setBookedConsultationsFilterAC,
  setAddBookingApiErrorAC,
} from "../../../redux/Bookings/bookings-reducer";
import {
  getBookingsSelector,
  getBookedConsultationsPageSizeSelector,
  getTotalBookingsCountSelector,
  getCurrentBookedConsultationsPageSelector,
  getBookedConsultationsIsFetchingSelector,
  getBookedConsultationsFilterSelector,
  getIsStatusChangingSelector,
  getIsDeletingInProcessSelector,
  getSuccessModalSelector,
  getAddBookingApiErrorSelector, getAccessErrorSelector
} from "../../../redux/Bookings/bookings-selectors";
import { Bookings } from "./Bookings";
import {AddConsultationFormValues, ContactsType} from "../../../types/Types";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";

export const BookingsContainer: React.FC = () => {

  const isFetching = useSelector(getBookedConsultationsIsFetchingSelector);
  const totalCount = useSelector(getTotalBookingsCountSelector);
  const currentPage = useSelector(getCurrentBookedConsultationsPageSelector);
  const pageSize = useSelector(getBookedConsultationsPageSizeSelector);
  const bookings = useSelector(getBookingsSelector);
  const filter = useSelector(getBookedConsultationsFilterSelector);
  const isStatusChanging = useSelector(getIsStatusChangingSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const addBookingApiError = useSelector(getAddBookingApiErrorSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAccessErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBookedConsultations(token, currentPage, pageSize, filter));
  }, [token, currentPage, pageSize, filter]);

  useEffect(() => {
    dispatch(setCurrentPageForBookedConsultationsAC(1));
  }, [filter]);

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentPageForBookedConsultationsAC(page));
  }

  const onFilterChangedCallBack = (
    filter: BookedConsultationsFilterType
  ) => {
    dispatch(setBookedConsultationsFilterAC(filter));
  }

  const changeBookedConsultationStatusCallBack = (
    id: string,
    status: boolean
  ) => {
    dispatch(changeBookedConsultationStatus(id, status));
  }

  const deleteConsultationCallBack = (
      id: string,
  ) => {
    dispatch(deleteBookedConsultation(token, id, bookings, currentPage, totalCount, pageSize, filter));
  }

  const turnConsultationToClientCallBack = (
    id: string,
    fullName: string,
    contacts?: ContactsType | {}
  ) => {
    dispatch(turnConsultationToClient(token, id, fullName, contacts, bookings, currentPage, totalCount, pageSize, filter));
  }

  const setBookedConsultationsPageSizeCallBack = (
    pageSize: number
  ) => {
    dispatch(setBookedConsultationsPageSizeAC(pageSize));
  }

  const addBookedConsultationCallBack = (values: AddConsultationFormValues) => {
    dispatch(addBookedConsultation(values, totalCount));
  }

  const archiveConsultationCallBack = (id: string) => {
    dispatch(archiveConsultation(token, id, bookings, currentPage, totalCount, pageSize, filter))
  }

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  const setAddBookingApiErrorCallBack = (error: string) => {
    dispatch(setAddBookingApiErrorAC(error));
  }

  return (
      <Bookings
        isFetching={isFetching}
        successModal={successModal}
        totalCount={totalCount}
        currentBookedConsultationsPage={currentPage}
        pageSize={pageSize}
        bookings={bookings}
        bookedConsultationsFilter={filter}
        isStatusChanging={isStatusChanging}
        isDeletingInProcess={isDeletingInProcess}
        addBookingApiError={addBookingApiError}
        accessError={accessError}
        setCurrentPage={setCurrentPageCallBack}
        onFilterChanged={onFilterChangedCallBack}
        changeStatus={changeBookedConsultationStatusCallBack}
        deleteConsultation={deleteConsultationCallBack}
        turnConsultationToClient={turnConsultationToClientCallBack}
        setPageLimit={setBookedConsultationsPageSizeCallBack}
        addBookedConsultation={addBookedConsultationCallBack}
        archiveConsultation={archiveConsultationCallBack}
        setSuccessModal={setSuccessModalCallBack}
        setAddBookingApiError={setAddBookingApiErrorCallBack}
      />
  )
}
