import * as React from 'react'
import { useState } from 'react'
import { Paginator } from '../../common/Paginator'
import { Customer } from './Customer'
import {AddCustomerFormValues, CustomerType} from '../../../types/Types'
import { CustomersSearchFormFormik } from '../../Forms/CustomersSearchFormFormik'
import { CustomersFilterType } from '../../../redux/Customers/customers-reducer'
import {ModalPopUp} from '../../common/ModalPopUp'
import {AddingCustomerForm} from "../../Forms/AddingCustomerFormFormik";
import {SuccessModal} from "../../SuccessModal";

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
  closeSuccessModal: () => void
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
  closeSuccessModal
 }) => {

  let [addCustomerMode, setAddCustomerMode] = useState<boolean>(false)
  const successModalTitle = ''

  const closeModal = () => {
    setAddCustomerMode(false)
  }

  const modalTitle = 'ADD CUSTOMER'

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
                consentId="consent"
                addCustomer={addCustomer}
                closeBookingModal={closeModal}
              />
          </ModalPopUp>
      }
      {
        isSuccess &&
        <ModalPopUp
            modalTitle={successModalTitle}
            closeModal={closeSuccessModal}
        >
            <SuccessModal />
        </ModalPopUp>
      }
    </>
  )
})
