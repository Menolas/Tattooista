import * as React from "react";
import {useEffect, useState} from "react";
import { Navigate } from "react-router";
import { Paginator } from "../../common/Paginator";
import { Booking } from "./Booking";
import {AddConsultationFormValues, BookedConsultationType, SearchFilterType} from "../../../types/Types";
import {SuccessModalType} from "../../../redux/Bookings/bookings-reducer";
import {ModalPopUp} from "../../common/ModalPopUp";
import {AddConsultationForm} from "../../Forms/AddConsultationForm";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {Preloader} from "../../common/Preloader";
import {NothingToShow} from "../../common/NothingToShow";
import {ApiErrorMessage} from "../../common/ApiErrorMessage";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {bookingFilterSelectOptions} from "../../../utils/constants";

type PropsType = {
  isFetching: boolean;
  successModal: SuccessModalType;
  totalCount: number;
  currentBookedConsultationsPage: number;
  pageSize: number;
  bookings?: Array<BookedConsultationType>;
  bookedConsultationsFilter: SearchFilterType;
  isStatusChanging?: Array<string>;
  isDeletingInProcess?: Array<string>;
  apiError: string;
  accessError: string;
  setCurrentPage: (page: number) => void;
  onFilterChanged: (filter: SearchFilterType) => void;
  changeStatus: (id: string, status: boolean) => void;
  deleteConsultation: (id: string) => void;
  turnConsultationToClient: (id: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void;
  setPageLimit: (pageSize: number) => void;
  addBookedConsultation: (values: AddConsultationFormValues) => void;
  archiveConsultation: (id: string) => void;
  setSuccessModal: () => void;
  setApiError: () => void;
}

export const Bookings: React.FC<PropsType> = React.memo(({
  isFetching,
  successModal,
  totalCount,
  currentBookedConsultationsPage,
  pageSize,
  bookings,
  bookedConsultationsFilter,
  isStatusChanging,
  isDeletingInProcess,
  apiError,
  accessError,
  setCurrentPage,
  onFilterChanged,
  changeStatus,
  deleteConsultation,
  turnConsultationToClient,
  setPageLimit,
  addBookedConsultation,
  archiveConsultation,
  setSuccessModal,
  setApiError
}) => {

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModal();
            }, 3000);
        }
    }, [successModal]);

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
          pageSize={pageSize}
          currentPage={currentBookedConsultationsPage}
          isStatusChanging={isStatusChanging}
          changeStatus={changeStatus}
          isDeletingInProcess={isDeletingInProcess}
          deleteConsultation={deleteConsultation}
          turnConsultationToClient={turnConsultationToClient}
          archiveConsultation={archiveConsultation}
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
                          filter={bookedConsultationsFilter}
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
                          currentPage={currentBookedConsultationsPage}
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
                      <AddConsultationForm
                          addBookedConsultation={addBookedConsultation}
                          closeBookingModal={closeModal}
                      />
                  </ModalPopUp>
                  <SuccessPopUp
                      isOpen={successModal.isSuccess}
                      closeModal={setSuccessModal}
                      content={successModal.successText}
                  />
                  <ApiErrorMessage
                      isOpen={!!apiError}
                      error={apiError}
                      closeModal={setApiError}
                  />
                </>
          }
      </>
    )
})
