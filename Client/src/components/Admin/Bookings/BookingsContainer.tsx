import * as React from "react";
import {useEffect,} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookings,
  changeStatus,
  deleteBooking,
  turnBookingToClient,
  setPageSizeAC,
  archiveBooking,
  setCurrentPageAC,
  setFilterAC, setBookingApiErrorAC,
} from "../../../redux/Bookings/bookings-reducer";
import {
  getBookingsSelector,
  getPageSizeSelector,
  getTotalSelector,
  getCurrentPageSelector,
  getIsFetchingSelector,
  getFilterSelector,
  getIsStatusChangingSelector,
  getIsDeletingInProcessSelector,
  getBookingApiErrorSelector,
} from "../../../redux/Bookings/bookings-selectors";
import { Bookings } from "./Bookings";
import {SearchFilterType} from "../../../types/Types";
import {getAuthAccessErrorSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../redux/redux-store";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const BookingsContainer: React.FC = () => {

  const isFetching = useSelector(getIsFetchingSelector);
  const totalCount = useSelector(getTotalSelector);
  const currentPage = useSelector(getCurrentPageSelector);
  const pageSize = useSelector(getPageSizeSelector);
  const bookings = useSelector(getBookingsSelector);
  const filter = useSelector(getFilterSelector);
  const isStatusChanging = useSelector(getIsStatusChangingSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const token = useSelector(getTokenSelector);
  const accessError = useSelector(getAuthAccessErrorSelector);
  const bookingApiError = useSelector(getBookingApiErrorSelector);
  const apiError = useSelector(getApiErrorSelector)

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBookings(token, currentPage, pageSize, filter));
  }, [dispatch, token, currentPage, pageSize, filter]);

  useEffect(() => {
    if (currentPage !== 1) {
      dispatch(setCurrentPageAC(1));
    }
  }, [filter, dispatch]);

  // useEffect(() => {
  //   console.log(accessError + " !ACCESS ERROR!!!!!!!!");
  //   if (accessError) {
  //     navigate("/noAccess");
  //   }
  // }, [accessError]);

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

  const changeStatusCallBack = (
    id: string,
  ) => {
    dispatch(changeStatus(token, id));
  };

  const removeCallBack = (
      id: string,
  ) => {
    dispatch(deleteBooking(token, id, bookings, currentPage, pageSize, filter));
  };

  const turnBookingToClientCallBack = (
    id: string,
  ) => {
    dispatch(turnBookingToClient(token, id, bookings, currentPage, pageSize, filter));
  };

  const setPageSizeCallBack = (
    pageSize: number
  ) => {
    dispatch(setPageSizeAC(pageSize));
  };

  const archiveCallBack = (id: string) => {
    dispatch(archiveBooking(token, id, bookings, currentPage, pageSize, filter));
  };

  const setBookingApiErrorCallBack = () => {
    dispatch(setBookingApiErrorAC(null));
  };

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  }

  return (
      <Bookings
        bookingApiError={bookingApiError}
        apiError={apiError}
        isFetching={isFetching}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        bookings={bookings}
        filter={filter}
        isStatusChanging={isStatusChanging}
        isDeletingInProcess={isDeletingInProcess}
        setCurrentPage={setCurrentPageCallBack}
        onFilterChanged={onFilterChangedCallBack}
        changeStatus={changeStatusCallBack}
        remove={removeCallBack}
        turnBookingToClient={turnBookingToClientCallBack}
        setPageLimit={setPageSizeCallBack}
        archive={archiveCallBack}
        setBookingApiError={setBookingApiErrorCallBack}
        setApiError={setApiErrorCallBack}
      />
  );
};
