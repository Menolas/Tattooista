import * as React from 'react'
import { NavLink } from 'react-router-dom'
import Sprite from '../../../assets/svg/sprite.svg'
import {ContactType, CustomerType} from '../../../types/Types'

type PropsType = {
    customer: CustomerType
    deleteArchivedCustomer: (clientId: string) => void
    reactivateCustomer: (customerId: string) => void
}

export const ArchivedCustomer: React.FC<PropsType> = React.memo(({
   customer,
   deleteArchivedCustomer,
   reactivateCustomer
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
        <li className="admin__card admin__card--client">
            <div className="client-profile__header">
                <NavLink
                    to={`/admin/profile?clientId=${customer._id}`}
                    className="admin__card-link client-profile">
                    <div className="client-profile__details">
                        <div className="client-profile__name">
                            <span>Name:&nbsp;</span>
                            <span>{customer.fullName}</span>
                        </div>
                    </div>
                </NavLink>
                <div className="admin__card-action-btns client-profile__action-btns">
                    <button
                        className={"btn btn--icon"}
                        onClick={() => reactivateCustomer(customer._id)}
                    >
                        <svg><use href={`${Sprite}#smile`}/></svg>
                    </button>
                    <button
                        className={"btn btn--icon"}
                        onClick={() => {
                            deleteArchivedCustomer(customer._id)
                        }}
                    >
                        <svg><use href={`${Sprite}#trash`}/></svg>
                    </button>
                </div>
            </div>
            <div>
                <ul className="list admin__card-contacts-list">
                    { contacts }
                </ul>
            </div>
        </li>
    )
})