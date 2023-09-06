import * as React from 'react'
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getBookedConsultations,
  bookedConsultationsOnFilterChanged,
  changeBookedConsultationStatus,
  deleteBookedConsultation,
  turnConsultationToClient,
  setBookedConsultationsPageSizeAC,
  addBookedConsultation,
  BookedConsultationsFilterType,
  archiveConsultation,
  setCurrentPageForBookedConsultationsAC, setIsSuccessAC,
} from '../../../redux/bookedConsultations/bookedConsultations-reducer'
import {
  getBookedConsultationsSelector,
  getBookedConsultationsPageSizeSelector,
  getTotalBookedConsultationsCountSelector,
  getCurrentBookedConsultationsPageSelector,
  getBookedConsultationsIsFetchingSelector,
  getBookedConsultationsFilterSelector,
  getIsStatusChangingSelector,
  getIsConsultationDeletingInProcessSelector,
  getIsSuccessSelector
} from '../../../redux/bookedConsultations/bookedConsultations-selectors'
import { BookedConsultations } from './BookedConsultations'
import { Preloader } from '../../common/Preloader'
import {AddConsultationFormValues, ContactsType} from '../../../types/Types'

export const BookedConsultationsContainer: React.FC = () => {

  const bookedConsultationsIsFetching = useSelector(getBookedConsultationsIsFetchingSelector)
  const totalBookedConsultationsCount = useSelector(getTotalBookedConsultationsCountSelector)
  const currentBookedConsultationsPage = useSelector(getCurrentBookedConsultationsPageSelector)
  const bookedConsultationsPageSize = useSelector(getBookedConsultationsPageSizeSelector)
  const bookedConsultations = useSelector(getBookedConsultationsSelector)
  const bookedConsultationsFilter = useSelector(getBookedConsultationsFilterSelector)
  const isStatusChanging = useSelector(getIsStatusChangingSelector)
  const isConsultationDeletingInProcess = useSelector(getIsConsultationDeletingInProcessSelector)
  const isSuccess = useSelector(getIsSuccessSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    console.log("It Is A hit!!!!!!!!!!!!!!!!!!!")
    const urlParams = new URLSearchParams(window.location.search)

    let actualPage = currentBookedConsultationsPage
    let actualFilter = bookedConsultationsFilter

    if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
    if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
    if (!!urlParams.get('status')) actualFilter = { ...actualFilter, status: urlParams.get('status')}

    dispatch(getBookedConsultations(actualPage, bookedConsultationsPageSize, actualFilter))
  }, [dispatch, currentBookedConsultationsPage, bookedConsultationsPageSize, bookedConsultationsFilter, isSuccess])

  useEffect(() => {
    navigate(`?term=${bookedConsultationsFilter.term}&status=${bookedConsultationsFilter.status}&page=${currentBookedConsultationsPage}`)

  }, [navigate, bookedConsultationsFilter, currentBookedConsultationsPage])

  const setCurrentPageForBookedConsultationsCallBack = (
    currentPage: number
  ) => {
    dispatch(setCurrentPageForBookedConsultationsAC(currentPage))
  }

  const onFilterChangedCallBack = (
    filter: BookedConsultationsFilterType
  ) => {
    dispatch(bookedConsultationsOnFilterChanged(bookedConsultationsPageSize, filter))
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

  return (
    <>
      { bookedConsultationsIsFetching
        ? <Preloader/>
        : <BookedConsultations
            isSuccess={isSuccess}
            totalBookedConsultationsCount={totalBookedConsultationsCount}
            currentBookedConsultationsPage={currentBookedConsultationsPage}
            pageSize={bookedConsultationsPageSize}
            bookedConsultations={bookedConsultations}
            bookedConsultationsFilter={bookedConsultationsFilter}
            isStatusChanging={isStatusChanging}
            isConsultationDeletingInProcess={isConsultationDeletingInProcess}
            setCurrentPage={setCurrentPageForBookedConsultationsCallBack}
            onFilterChanged={onFilterChangedCallBack}
            changeStatus={changeBookedConsultationStatusCallBack}
            deleteConsultation={deleteConsultationCallBack}
            turnConsultationToClient={turnConsultationToClientCallBack}
            setPageLimit={setBookedConsultationsPageSizeCallBack}
            addBookedConsultation={addBookedConsultationCallBack}
            archiveConsultation={archiveConsultationCallBack}
            setIsSuccess={setIsSuccessCallBack}
          />
      }
    </>
  )
}
