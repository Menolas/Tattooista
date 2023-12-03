import * as React from 'react'
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {
  getBookedConsultations,
  changeBookedConsultationStatus,
  deleteBookedConsultation,
  turnConsultationToClient,
  setBookedConsultationsPageSizeAC,
  addBookedConsultation,
  BookedConsultationsFilterType,
  archiveConsultation,
  setCurrentPageForBookedConsultationsAC, setIsSuccessAC, setBookedConsultationsFilterAC, setAddBookingApiErrorAC,
} from '../../../redux/bookedConsultations/bookedConsultations-reducer'
import {
  getBookedConsultationsSelector,
  getBookedConsultationsPageSizeSelector,
  getTotalBookedConsultationsCountSelector,
  getCurrentBookedConsultationsPageSelector,
  getBookedConsultationsIsFetchingSelector,
  getBookedConsultationsFilterSelector,
  getIsStatusChangingSelector,
  getIsDeletingInProcessSelector,
  getIsSuccessSelector, getAddBookingApiErrorSelector
} from '../../../redux/bookedConsultations/bookedConsultations-selectors'
import { BookedConsultations } from './BookedConsultations'
import {AddConsultationFormValues, ContactsType} from '../../../types/Types'

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

  const dispatch = useDispatch()
  //const navigate = useNavigate()

  useEffect(() => {
    //const urlParams = new URLSearchParams(window.location.search)
    //let actualPage = currentPage
    //let actualFilter = filter
    //if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
    //if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
    //if (!!urlParams.get('status')) actualFilter = { ...actualFilter, status: urlParams.get('status')}

    dispatch(getBookedConsultations(currentPage, pageSize, filter))
  }, [currentPage, pageSize, filter])

  // useEffect(() => {
  //   navigate(`?term=${filter.term}&status=${filter.status}&page=${currentPage}`)
  // }, [navigate, filter, currentPage])

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

  const deleteConsultationCallBack = (id: string) => {
    dispatch(deleteBookedConsultation(id))
  }

  const turnConsultationToClientCallBack = (
    id: string,
    fullName: string,
    contacts?: ContactsType | {}
  ) => {
    dispatch(turnConsultationToClient(id, fullName, contacts))
  }

  const setBookedConsultationsPageSizeCallBack = (
    pageSize: number
  ) => {
    dispatch(setBookedConsultationsPageSizeAC(pageSize))
  }

  const addBookedConsultationCallBack = (values: AddConsultationFormValues) => {
    dispatch(addBookedConsultation(values))
  }

  const archiveConsultationCallBack = (id: string) => {
    dispatch(archiveConsultation(id))
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
