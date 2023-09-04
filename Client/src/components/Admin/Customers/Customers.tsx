import * as React from 'react'
import {useEffect, useState} from 'react'
import { Paginator } from '../../common/Paginator'
import { Customer } from './Customer'
import {AddCustomerFormValues, CustomerType} from '../../../types/Types'
import { CustomersSearchFormFormik } from '../../Forms/CustomersSearchFormFormik'
import { CustomersFilterType } from '../../../redux/Customers/customers-reducer'
import {ModalPopUp} from '../../common/ModalPopUp'
import {AddingCustomerForm} from "../../Forms/AddingCustomerFormFormik";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {setIsSuccessAC} from "../../../redux/Portfolio/portfolio-reducer";
import {useDispatch} from "react-redux";

type PropsType = {
  isSuccess: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  customers?: Array<CustomerType>
  customersFilter: CustomersFilterType
  isStatusChanging?: Array<string>
  isCustomerDeletingInProcess?: Array<string>
  setCurrentPage: (currentPage: number) => void
  onFilterChanged: (filter: CustomersFilterType) => void
  changeStatus: (customerId: string, status: boolean) => void
  deletePerson: (customerId: string, pageSize: number, currentPage: number) => void
  turnToClient: (customerId: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void
  setPageLimit: (customersPageSize: number) => void
  addCustomer: (values: AddCustomerFormValues) => void
  archiveCustomer: (customerId: string) => void
  setIsSuccess: (bol: boolean) => void
}

export const Customers: React.FC<PropsType> = React.memo(({
  isSuccess,
  totalCount,
  currentPage,
  pageSize,
  customers,
  customersFilter,
  isStatusChanging,
  isCustomerDeletingInProcess,
  setCurrentPage,
  onFilterChanged,
  changeStatus,
  deletePerson,
  turnToClient,
  setPageLimit,
  addCustomer,
  archiveCustomer,
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

  let [addCustomerMode, setAddCustomerMode] = useState<boolean>(false)

  const closeModal = () => {
    setAddCustomerMode(false)
  }

  const modalTitle = 'ADD CUSTOMER'
  const successPopUpContent = "You successfully changed your consultations list"

  const customersElements = customers?.map(customer => {
      return (
        <Customer
          key={customer._id}
          customer={customer}
          pageSize={pageSize}
          currentPage={currentPage}
          isStatusChanging={isStatusChanging}
          changeCustomerStatus={changeStatus}
          isCustomerDeletingInProcess={isCustomerDeletingInProcess}
          deleteCustomer={deletePerson}
          turnCustomerToClient={turnToClient}
          archiveCustomer={archiveCustomer}
        />
      )
  })

  return (
    <>
      <div className="admin__cards-header">
        <CustomersSearchFormFormik
          customersFilter={customersFilter}
          onFilterChanged={onFilterChanged}
        />
        <Paginator
          totalCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChanged={setCurrentPage}
          setPageLimit={setPageLimit}
        />
        <button
          className="btn btn--bg btn--light-bg"
          onClick={() => {setAddCustomerMode(true)}}
        >
          Add Customer
        </button>
      </div>
      <ul className="admin__cards-list list">
        { customersElements }
      </ul>
      { addCustomerMode &&
          <ModalPopUp
              modalTitle={modalTitle}
              closeModal={closeModal}
          >
              <AddingCustomerForm
                addCustomer={addCustomer}
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
