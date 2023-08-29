import * as React from 'react'
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getCustomers,
  customersOnFilterChanged,
  changeCustomerStatus,
  deleteCustomer,
  turnCustomerToClient,
  setCustomersPageSize,
  addCustomer,
  CustomersFilterType,
  archiveCustomer,
  setCurrentPageAC, setIsSuccessAC,
} from '../../../redux/Customers/customers-reducer'
import {
  getCustomersSelector,
  getCustomersPageSizeSelector,
  getTotalCustomersCountSelector,
  getCurrentCustomersPageSelector,
  getCustomersIsFetchingSelector,
  getCustomersFilterSelector,
  getIsStatusChangingSelector,
  getIsCustomerDeletingInProcessSelector, getIsSuccessSelector
} from '../../../redux/Customers/customers-selectors'
import { Customers } from './Customers'
import { Preloader } from '../../common/Preloader'
import {AddCustomerFormValues, ContactsType} from '../../../types/Types'

export const CustomersContainer: React.FC = () => {

  const customersIsFetching = useSelector(getCustomersIsFetchingSelector)
  const totalCustomersCount = useSelector(getTotalCustomersCountSelector)
  const currentCustomersPage = useSelector(getCurrentCustomersPageSelector)
  const customersPageSize = useSelector(getCustomersPageSizeSelector)
  const customers = useSelector(getCustomersSelector)
  const customersFilter = useSelector(getCustomersFilterSelector)
  const isStatusChanging = useSelector(getIsStatusChangingSelector)
  const isCustomerDeletingInProcess = useSelector(getIsCustomerDeletingInProcessSelector)
  const isSuccess = useSelector(getIsSuccessSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    let actualPage = currentCustomersPage
    let actualFilter = customersFilter

    if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
    if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
    if (!!urlParams.get('status')) actualFilter = { ...actualFilter, status: urlParams.get('status')}

    dispatch(getCustomers(actualPage, customersPageSize, actualFilter))
  }, [dispatch, currentCustomersPage, customersPageSize, customersFilter, isSuccess])

  useEffect(() => {
    navigate(`?term=${customersFilter.term}&status=${customersFilter.status}&page=${currentCustomersPage}`)

  }, [navigate, customersFilter, currentCustomersPage])

  const setCurrentPageCallBack = (
    currentPage: number
  ) => {
    dispatch(setCurrentPageAC(currentPage))
  }

  const onFilterChanged = (
    filter: CustomersFilterType
  ) => {
    dispatch(customersOnFilterChanged(customersPageSize, filter))
  }

  const changeStatus = (
    customerId: string,
    status: boolean
  ) => {
    dispatch(changeCustomerStatus(customerId, status))
  }

  const deleteCustomerCallBack = (customerId: string) => {
    dispatch(deleteCustomer(customerId))
  }

  const turnToClient = (
    customerId: string,
    fullName: string,
    contacts?: ContactsType | {}
  ) => {
    dispatch(turnCustomerToClient(customerId, fullName, contacts))
  }

  const setPageLimit = (
    customersPageSize: number
  ) => {
    dispatch(setCustomersPageSize(customersPageSize))
  }

  const addCustomerCallBack = (values: AddCustomerFormValues) => {
    dispatch(addCustomer(values))
  }

  const archiveCustomerCallBack = (customerId: string) => {
    dispatch(archiveCustomer(customerId))
  }

  const closeSuccessModalCallBack = () => {
    dispatch(setIsSuccessAC(false))
  }

  return (
    <>
      { customersIsFetching
        ? <Preloader/>
        : <Customers
            isSuccess={isSuccess}
            totalCount={totalCustomersCount}
            currentPage={currentCustomersPage}
            pageSize={customersPageSize}
            customers={customers}
            customersFilter={customersFilter}
            isStatusChanging={isStatusChanging}
            isCustomerDeletingInProcess={isCustomerDeletingInProcess}
            setCurrentPage={setCurrentPageCallBack}
            onFilterChanged={onFilterChanged}
            changeStatus={changeStatus}
            deletePerson={deleteCustomerCallBack}
            turnToClient={turnToClient}
            setPageLimit={setPageLimit}
            addCustomer={addCustomerCallBack}
            archiveCustomer={archiveCustomerCallBack}
            closeSuccessModal={closeSuccessModalCallBack}
          />
      }
    </>
  )
}
