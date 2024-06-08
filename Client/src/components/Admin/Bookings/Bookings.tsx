import * as React from "react";
import {useEffect, useState} from "react";
import { Navigate } from "react-router";
import { Paginator } from "../../common/Paginator";
import { Booking } from "./Booking";
import {AddConsultationFormValues, BookingType, SearchFilterType} from "../../../types/Types";
import {ModalPopUp} from "../../common/ModalPopUp";
import {AddBookingForm} from "../../Forms/AddBookingForm";
import {Preloader} from "../../common/Preloader";
import {NothingToShow} from "../../common/NothingToShow";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {bookingFilterSelectOptions} from "../../../utils/constants";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";

type PropsType = {
  bookingApiError: null | string;
  isFetching: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  bookings?: Array<BookingType>;
  filter: SearchFilterType;
  isStatusChanging?: Array<string>;
  isDeletingInProcess?: Array<string>;
  accessError: string;
  apiError: string;
  setCurrentPage: (page: number) => void;
  onFilterChanged: (filter: SearchFilterType) => void;
  changeStatus: (id: string, status: boolean) => void;
  remove: (id: string) => void;
  turnBookingToClient: (id: string) => void;
  setPageLimit: (pageSize: number) => void;
  add: (values: AddConsultationFormValues) => void;
  archive: (id: string) => void;
  setBookingApiError: () => void;
  setApiError: () => void;
}

export const Bookings: React.FC<PropsType> = React.memo(({
  bookingApiError,
  isFetching,
  totalCount,
  currentPage,
  pageSize,
  bookings,
  filter,
  isStatusChanging,
  isDeletingInProcess,
  accessError,
  apiError,
  setCurrentPage,
  onFilterChanged,
  changeStatus,
  remove,
  turnBookingToClient,
  setPageLimit,
  add,
  archive,
  setBookingApiError,
  setApiError,
}) => {

    let [addConsultationMode, setAddConsultationMode] = useState<boolean>(false);

    const closeModal = () => {
      setAddConsultationMode(false);
      setApiError()
    }

    useEffect(() => {
      if (addConsultationMode && apiError === null) {
        closeModal();
      }
    }, [apiError]);


  const modalTitle = 'Add a Consultation';

    const bookedConsultationsArray = bookings?.map(consultation => {
      return (
        <Booking
          key={consultation._id}
          consultation={consultation}
          isStatusChanging={isStatusChanging}
          changeStatus={changeStatus}
          isDeletingInProcess={isDeletingInProcess}
          remove={remove}
          turnBookingToClient={turnBookingToClient}
          archive={archive}
        />
      )
    });

    return (
      <>
          { (accessError && accessError !== '')
              ? <Navigate to="/noAccess" />
              : <>
                  <div className="admin__cards-header">
                      <SearchFilterForm
                          options={bookingFilterSelectOptions}
                          filter={filter}
                          onFilterChanged={onFilterChanged}
                      />
                      <button
                          className="btn btn--bg btn--light-bg add-btn"
                          onClick={() => {setAddConsultationMode(true)}}
                      >
                          Add a consultation
                      </button>
                      <Paginator
                          totalCount={totalCount}
                          pageSize={pageSize}
                          currentPage={currentPage}
                          onPageChanged={setCurrentPage}
                          setPageLimit={setPageLimit}
                      />
                  </div>
                  {
                      isFetching
                          ? <Preloader />
                          : totalCount && totalCount > 0
                              ? (
                                  <ul className="admin__cards-list list">
                                      { bookedConsultationsArray }
                                  </ul>
                              )
                              : <NothingToShow/>
                  }
                  <ModalPopUp
                      isOpen={addConsultationMode}
                      modalTitle={modalTitle}
                      closeModal={closeModal}
                  >
                      <AddBookingForm
                          apiError={apiError}
                          addBooking={add}
                          closeBookingModal={closeModal}
                      />
                  </ModalPopUp>
                  <ApiErrorMessageModal
                        isOpen={!!bookingApiError}
                        error={bookingApiError}
                        closeModal={setBookingApiError}
                  />
                </>
          }
      </>
    )
});
