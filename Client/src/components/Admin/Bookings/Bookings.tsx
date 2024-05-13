import * as React from "react";
import {useEffect, useState} from "react";
import { Navigate } from "react-router";
import { Paginator } from "../../common/Paginator";
import { Booking } from "./Booking";
import {AddConsultationFormValues, BookingType, SearchFilterType} from "../../../types/Types";
import {ModalPopUp} from "../../common/ModalPopUp";
import {AddBookingForm} from "../../Forms/AddBookingForm";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {Preloader} from "../../common/Preloader";
import {NothingToShow} from "../../common/NothingToShow";
import {ApiErrorMessage} from "../../common/ApiErrorMessage";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {bookingFilterSelectOptions} from "../../../utils/constants";

type PropsType = {
  isFetching: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  bookings?: Array<BookingType>;
  filter: SearchFilterType;
  isStatusChanging?: Array<string>;
  isDeletingInProcess?: Array<string>;
  accessError: string;
  setCurrentPage: (page: number) => void;
  onFilterChanged: (filter: SearchFilterType) => void;
  changeStatus: (id: string, status: boolean) => void;
  remove: (id: string) => void;
  turnBookingToClient: (id: string) => void;
  setPageLimit: (pageSize: number) => void;
  add: (values: AddConsultationFormValues) => void;
  archive: (id: string) => void;
}

export const Bookings: React.FC<PropsType> = React.memo(({
  isFetching,
  totalCount,
  currentPage,
  pageSize,
  bookings,
  filter,
  isStatusChanging,
  isDeletingInProcess,
  accessError,
  setCurrentPage,
  onFilterChanged,
  changeStatus,
  remove,
  turnBookingToClient,
  setPageLimit,
  add,
  archive,
}) => {

    let [addConsultationMode, setAddConsultationMode] = useState<boolean>(false);

    const closeModal = () => {
        setAddConsultationMode(false);
    }

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
                          addBooking={add}
                          closeBookingModal={closeModal}
                      />
                  </ModalPopUp>
                </>
          }
      </>
    )
});
