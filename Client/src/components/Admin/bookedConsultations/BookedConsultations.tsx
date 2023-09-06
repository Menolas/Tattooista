import * as React from 'react'
import {useEffect, useState} from 'react'
import { Paginator } from '../../common/Paginator'
import { BookedConsultation } from './BookedConsultation'
import {AddConsultationFormValues, BookedConsultationType} from '../../../types/Types'
import { BookedConsultationsSearchForm } from '../../Forms/BookedConsultationsSearchForm'
import { BookedConsultationsFilterType } from '../../../redux/bookedConsultations/bookedConsultations-reducer'
import {ModalPopUp} from '../../common/ModalPopUp'
import {AddConsultationForm} from '../../Forms/AddConsultationForm'
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {setIsSuccessAC} from '../../../redux/Portfolio/portfolio-reducer'
import {useDispatch} from "react-redux";

type PropsType = {
  isSuccess: boolean
  totalBookedConsultationsCount: number
  currentBookedConsultationsPage: number
  pageSize: number
  bookedConsultations?: Array<BookedConsultationType>
  bookedConsultationsFilter: BookedConsultationsFilterType
  isStatusChanging?: Array<string>
  isConsultationDeletingInProcess?: Array<string>
  setCurrentPage: (currentPage: number) => void
  onFilterChanged: (filter: BookedConsultationsFilterType) => void
  changeStatus: (id: string, status: boolean) => void
  deleteConsultation: (id: string, pageSize: number, currentPage: number) => void
  turnConsultationToClient: (id: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void
  setPageLimit: (pageSize: number) => void
  addBookedConsultation: (values: AddConsultationFormValues) => void
  archiveConsultation: (id: string) => void
  setIsSuccess: (bol: boolean) => void
}

export const BookedConsultations: React.FC<PropsType> = React.memo(({
  isSuccess,
  totalBookedConsultationsCount,
  currentBookedConsultationsPage,
  pageSize,
  bookedConsultations,
  bookedConsultationsFilter,
  isStatusChanging,
  isConsultationDeletingInProcess,
  setCurrentPage,
  onFilterChanged,
  changeStatus,
  deleteConsultation,
  turnConsultationToClient,
  setPageLimit,
  addBookedConsultation,
  archiveConsultation,
  setIsSuccess
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
          isConsultationDeletingInProcess={isConsultationDeletingInProcess}
          deleteConsultation={deleteConsultation}
          turnConsultationToClient={turnConsultationToClient}
          archiveConsultation={archiveConsultation}
        />
      )
  })

  return (
    <>
      <div className="admin__cards-header">
        <BookedConsultationsSearchForm
          filter={bookedConsultationsFilter}
          onFilterChanged={onFilterChanged}
        />
        <Paginator
          totalCount={totalBookedConsultationsCount}
          pageSize={pageSize}
          currentPage={currentBookedConsultationsPage}
          onPageChanged={setCurrentPage}
          setPageLimit={setPageLimit}
        />
        <button
          className="btn btn--bg btn--light-bg"
          onClick={() => {setAddConsultationMode(true)}}
        >
          Add a consultation
        </button>
      </div>
      <ul className="admin__cards-list list">
        { bookedConsultationsArray }
      </ul>
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
    </>
  )
})
