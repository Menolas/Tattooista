import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  getBookingProfile,
  deleteBooking,
  archiveBooking,
} from "../../../redux/Bookings/bookings-reducer";
import { BookingProfile } from "./BookingProfile";
import {
  getBookingProfileSelector,
  getBookingApiErrorSelector, getCurrentPageSelector, getPageSizeSelector, getBookingsSelector, getFilterSelector,
} from "../../../redux/Bookings/bookings-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";
import {setApiErrorAC} from "../../../redux/General/general-reducer";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";

export const BookingProfileContainer: React.FC = () => {

  const token = useSelector(getTokenSelector);
  const currentPage = useSelector(getCurrentPageSelector);
  const pageSize = useSelector(getPageSizeSelector);
  const bookings = useSelector(getBookingsSelector);
  const filter = useSelector(getFilterSelector);
  const bookingProfile = useSelector(getBookingProfileSelector);
  const apiError = useSelector(getApiErrorSelector);
  const bookingApiError = useSelector(getBookingApiErrorSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = urlParams.get('bookingId');

    if (bookingIdFromUrl && (!bookingProfile || bookingProfile._id !== bookingIdFromUrl)) {
      dispatch(getBookingProfile(bookingIdFromUrl));
    }
  }, [dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIdFromUrl = urlParams.get('bookingId');

    // Only navigate if the URL is missing the bookingId or the bookingId in the URL is different from the current bookingProfile._id
    if (bookingProfile && bookingProfile._id !== bookingIdFromUrl) {
      navigate(`?bookingId=${bookingProfile._id}`);
    }
  }, [bookingProfile, navigate]);

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(null));
  };

  const deleteBookingCallBack = async () => {
    let success = await dispatch(deleteBooking(
        token || "",
        bookingProfile._id,
        bookings,
        currentPage,
        pageSize,
        filter
    ));
    if (success) {
      navigate("/admin/bookedConsultations");
    }
  };

  const archiveBookingCallBack = async () => {
    let success = await dispatch(archiveBooking(
        token || "",
        bookingProfile._id,
        bookings,
        currentPage,
        pageSize,
        filter
    ));
    if (success) {
        navigate("/admin/bookedConsultations");
    }
  };

  return (
    <>
      <BookingProfile
        apiError={bookingApiError}
        data={bookingProfile}
        remove={deleteBookingCallBack}
        archive={archiveBookingCallBack}
      />
      {apiError &&
          <ApiErrorMessageModal
              isOpen={!!apiError}
              error={apiError}
              closeModal={setApiErrorCallBack}
          />
      }
    </>
  );
};
