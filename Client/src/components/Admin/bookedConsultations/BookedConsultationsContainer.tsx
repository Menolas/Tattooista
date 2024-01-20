import * as React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  setIsSuccessAC,
  setBookedConsultationsFilterAC,
  setAddBookingApiErrorAC,
} from "../../../redux/bookedConsultations/bookedConsultations-reducer"
import {
  getBookedConsultationsSelector,
  getBookedConsultationsPageSizeSelector,
  getTotalBookedConsultationsCountSelector,
  getCurrentBookedConsultationsPageSelector,
  getBookedConsultationsIsFetchingSelector,
  getBookedConsultationsFilterSelector,
  getIsStatusChangingSelector,
  getIsDeletingInProcessSelector,
  getIsSuccessSelector,
  getAddBookingApiErrorSelector, getAccessErrorSelector
} from "../../../redux/bookedConsultations/bookedConsultations-selectors"
import { BookedConsultations } from "./BookedConsultations"
import {AddConsultationFormValues, BookedConsultationType, ContactsType} from '../../../types/Types'
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";

export const BookedConsultationsContainer: React.FC = () => {

  const isFetching = useSelector(getBookedConsultationsIsFetchingSelector)
  const totalCount = useSelector(getTotalBookedConsultationsCountSelector)
  const currentPage = useSelector(getCurrentBookedConsultationsPageSelector)
  const pageSize = useSelector(getBookedConsultationsPageSizeSelector)
  const bookedConsultations = useSelector(getBookedConsultationsSelector)
  const filter = useSelector(getBookedConsultationsFilterSelector)
  const isStatusChanging = useSelector(getIsStatusChangingSelector)
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector)
  const isSuccess = useSelector(getIsSuccessSelector)
  const addBookingApiError = useSelector(getAddBookingApiErrorSelector)
  const token = useSelector(getTokenSelector)
  const accessError = useSelector(getAccessErrorSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBookedConsultations(token, currentPage, pageSize, filter))
  }, [currentPage, pageSize, filter])

  useEffect(() => {
    dispatch(setCurrentPageForBookedConsultationsAC(1))
  }, [filter])

  const setCurrentPageCallBack = (
    page: number
  ) => {
    dispatch(setCurrentPageForBookedConsultationsAC(page))
  }

  const onFilterChangedCallBack = (
    filter: BookedConsultationsFilterType
  ) => {
    dispatch(setBookedConsultationsFilterAC(filter))
  }

  const changeBookedConsultationStatusCallBack = (
    id: string,
    status: boolean
  ) => {
    dispatch(changeBookedConsultationStatus(id, status))
  }

  const deleteConsultationCallBack = (
      id: string,
  ) => {
    dispatch(deleteBookedConsultation(token, id, bookedConsultations, currentPage, totalCount, pageSize, filter))
  }

  const turnConsultationToClientCallBack = (
    id: string,
    fullName: string,
    contacts?: ContactsType | {}
  ) => {
    dispatch(turnConsultationToClient(token, id, fullName, contacts, bookedConsultations, currentPage, totalCount, pageSize, filter))
  }

  const setBookedConsultationsPageSizeCallBack = (
    pageSize: number
  ) => {
    dispatch(setBookedConsultationsPageSizeAC(pageSize))
  }

  const addBookedConsultationCallBack = (values: AddConsultationFormValues) => {
    dispatch(addBookedConsultation(values, totalCount))
  }

  const archiveConsultationCallBack = (id: string) => {
    dispatch(archiveConsultation(token, id, bookedConsultations, currentPage, totalCount, pageSize, filter))
  }

  const setIsSuccessCallBack = (bol: boolean) => {
    dispatch(setIsSuccessAC(bol))
  }

  const setAddBookingApiErrorCallBack = (error: string) => {
    dispatch(setAddBookingApiErrorAC(error))
  }

  return (
      <BookedConsultations
        isFetching={isFetching}
        isSuccess={isSuccess}
        totalCount={totalCount}
        currentBookedConsultationsPage={currentPage}
        pageSize={pageSize}
        bookedConsultations={bookedConsultations}
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
        setIsSuccess={setIsSuccessCallBack}
        setAddBookingApiError={setAddBookingApiErrorCallBack}
      />
  )
}
