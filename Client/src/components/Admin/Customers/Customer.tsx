import * as React from 'react'
import {ContactType, CustomerType} from '../../../types/Types'
import Sprite from '../../../assets/svg/sprite.svg'

type PropsType = {
  customer: CustomerType
  pageSize: number
  currentPage: number
  isCustomerDeletingInProcess?: Array<string>
  isStatusChanging?: Array<string>
  changeCustomerStatus: (customerId: string, status: boolean) => void
  turnCustomerToClient: (customerId: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void
  deleteCustomer: (customerId: string, pageSize: number, currentPage: number) => void
  archiveCustomer: (customerId: string) => void
}

export const Customer: React.FC<PropsType> = React.memo(({
    customer,
    pageSize,
    currentPage,
    isCustomerDeletingInProcess,
    isStatusChanging,
    changeCustomerStatus,
    turnCustomerToClient,
    deleteCustomer,
    archiveCustomer
}) => {
    const customerContacts: ContactType = customer.contacts
    const contacts = Object.keys(customerContacts).map(contact => {

        return customerContacts[contact] ?
            <li key={contact}>
                <span>{contact}:&nbsp;</span>
                <span>{customerContacts[contact]}</span>
            </li> : null

    })

  return (
    <li className="admin__card">
      <div className="admin__card-details">
        <div className="admin__card-name">
          <span>Name:&nbsp;</span>
          <span>{customer.fullName}</span>
        </div>
        <div>
          <ul className="list">
            { contacts }
          </ul>
        </div>
        <div className="admin__card-message">
          <span>Message:&nbsp;</span>
          <p>{customer.message}</p>
        </div>
      </div>
      <div className="admin__card-action-btns">
        <button
          className={"btn btn--icon"}
          disabled={ isStatusChanging?.some(id => id === customer._id) }
          onClick={() => {changeCustomerStatus(customer._id, customer.status)}}
        >
          { !customer.status
              ? <svg><use href={`${Sprite}#phone-arrow-right`}/></svg>
              : <svg><use href={`${Sprite}#phone-missed`}/></svg>
          }
        </button>
        <button
          className={"btn btn--icon"}
          onClick={() => {
              turnCustomerToClient(customer._id, customer.fullName, customer.contacts, pageSize, currentPage)
          }}
        >
            <svg><use href={`${Sprite}#users-medical`}/></svg>
        </button>
        <button
          className={"btn btn--icon"}
          //disabled={isCustomerDeletingInProcess.some(id => id === customer._id)}
          onClick={() => {
              archiveCustomer(customer._id)
          }}
        >
            <svg><use href={`${Sprite}#archive`}/></svg>
        </button>
        <button
          className={"btn btn--icon"}
          disabled={isCustomerDeletingInProcess?.some(id => id === customer._id)}
          onClick={() => {
              deleteCustomer(customer._id, pageSize, currentPage)
          }}
        >
            <svg><use href={`${Sprite}#trash`}/></svg>
        </button>
      </div>
    </li>
  )
})
