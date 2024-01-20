import * as React from "react"
import {useEffect, useState} from "react"
import { Navigate } from "react-router"
import { Paginator } from "../../common/Paginator"
import { BookedConsultation } from "./BookedConsultation"
import {AddConsultationFormValues, BookedConsultationType} from "../../../types/Types"
import { BookedConsultationsFilterType } from "../../../redux/bookedConsultations/bookedConsultations-reducer"
import {ModalPopUp} from "../../common/ModalPopUp"
import {AddConsultationForm} from "../../Forms/AddConsultationForm"
import {SuccessPopUp} from "../../common/SuccessPopUp"
import {setIsSuccessAC} from "../../../redux/Portfolio/portfolio-reducer"
import {useDispatch} from "react-redux"
import {Preloader} from "../../common/Preloader"
import {NothingToShow} from "../../common/NothingToShow"
import {ApiErrorMessage} from "../../common/ApiErrorMessage"
import {SearchFilterForm} from "../../Forms/SearchFilterForm"
import { bookingFilterSelectOptions } from "../../../utils/constants"

type PropsType = {
  isFetching: boolean
  isSuccess: boolean
  totalCount: number
  currentBookedConsultationsPage: number
  pageSize: number
  bookedConsultations?: Array<BookedConsultationType>
  bookedConsultationsFilter: BookedConsultationsFilterType
  isStatusChanging?: Array<string>
  isDeletingInProcess?: Array<string>
  addBookingApiError: string | undefined
  accessError: string | undefined
  setCurrentPage: (page: number) => void
  onFilterChanged: (filter: BookedConsultationsFilterType) => void
  changeStatus: (id: string, status: boolean) => void
  deleteConsultation: (id: string) => void
  turnConsultationToClient: (id: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void
  setPageLimit: (pageSize: number) => void
  addBookedConsultation: (values: AddConsultationFormValues) => void
  archiveConsultation: (id: string) => void
  setIsSuccess: (bol: boolean) => void
  setAddBookingApiError: (error: string) => void
}

export const BookedConsultations: React.FC<PropsType> = React.memo(({
  isFetching,
  isSuccess,
  totalCount,
  currentBookedConsultationsPage,
  pageSize,
  bookedConsultations,
  bookedConsultationsFilter,
  isStatusChanging,
  isDeletingInProcess,
  addBookingApiError,
  accessError,
  setCurrentPage,
  onFilterChanged,
  changeStatus,
  deleteConsultation,
  turnConsultationToClient,
  setPageLimit,
  addBookedConsultation,
  archiveConsultation,
  setIsSuccess,
  setAddBookingApiError
}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSuccess) {
            setTimeout( () => {
                dispatch(setIsSuccessAC(false))
            }, 1500)
        }
    }, [isSuccess])

    let [addConsultationMode, setAddConsultationMode] = useState<boolean>(false)

    const closeModal = () => {
        setAddConsultationMode(false)
    }

    const modalTitle = 'Add a Consultation'
    const successPopUpContent = "You successfully changed your consultations list"

    const bookedConsultationsArray = bookedConsultations?.map(consultation => {
      return (
        <BookedConsultation
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
    })

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
                      <Paginator
                          totalCount={totalCount}
                          pageSize={pageSize}
                          currentPage={currentBookedConsultationsPage}
                          onPageChanged={setCurrentPage}
                          setPageLimit={setPageLimit}
                      />
                      <button
                          className="btn btn--bg btn--light-bg add-btn"
                          onClick={() => {setAddConsultationMode(true)}}
                      >
                          Add a consultation
                      </button>
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

                  { addConsultationMode &&
                      <ModalPopUp
                          modalTitle={modalTitle}
                          closeModal={closeModal}
                      >
                          <AddConsultationForm
                              addBookedConsultation={addBookedConsultation}
                              closeBookingModal={closeModal}
                          />
                      </ModalPopUp>
                  }
                  {
                      isSuccess &&
                      <SuccessPopUp
                          closeModal={setIsSuccess}
                          content={successPopUpContent}
                      />
                  }
                  { addBookingApiError && addBookingApiError !== '' &&
                      <ApiErrorMessage
                          error={addBookingApiError}
                          closeModal={setAddBookingApiError}
                      />
                  }
                </>
          }
      </>
    )
})
