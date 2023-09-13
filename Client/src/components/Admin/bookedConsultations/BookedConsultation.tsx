import * as React from 'react'
import {ContactType, BookedConsultationType} from '../../../types/Types'
// @ts-ignore
import Sprite from '../../../assets/svg/sprite.svg'

type PropsType = {
  consultation: BookedConsultationType
  pageSize: number
  currentPage: number
  isDeletingInProcess?: Array<string>
  isStatusChanging?: Array<string>
  changeStatus: (id: string, status: boolean) => void
  turnConsultationToClient: (id: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void
  deleteConsultation: (id: string, pageSize: number, currentPage: number) => void
  archiveConsultation: (id: string) => void
}

export const BookedConsultation: React.FC<PropsType> = React.memo(({
    consultation,
    pageSize,
    currentPage,
    isDeletingInProcess,
    isStatusChanging,
    changeStatus,
    turnConsultationToClient,
    deleteConsultation,
    archiveConsultation
}) => {
    console.log(consultation)
    const bookingContacts: ContactType = consultation.contacts
    const contacts = Object.keys(bookingContacts).map(contact => {

        return bookingContacts[contact] ?
            <li key={contact}>
                <span>{contact}:&nbsp;</span>
                <span>{bookingContacts[contact]}</span>
            </li> : null

    })

  return (
    <li className="admin__card">
      <div className="admin__card-details">
        <div className="admin__card-name">
          <span>Name:&nbsp;</span>
          <span>{consultation.fullName}</span>
        </div>
        <div>{consultation.createdAt.split('T')[0] + ' (' + consultation.createdAt.split('T')[1].split('.')[0] + ')'}</div>
        <div>
          <ul className="list">
            { contacts }
          </ul>
        </div>
        <div className="admin__card-message">
          <span>Message:&nbsp;</span>
          <p>{consultation.message}</p>
        </div>
      </div>
      <div className="admin__card-action-btns">
        <button
          className={"btn btn--icon"}
          disabled={ isStatusChanging?.some(id => id === consultation._id) }
          onClick={() => {changeStatus(consultation._id, consultation.status)}}
        >
          { !consultation.status
              ? <svg><use href={`${Sprite}#phone-arrow-right`}/></svg>
              : <svg><use href={`${Sprite}#phone-missed`}/></svg>
          }
        </button>
        <button
          className={"btn btn--icon"}
          disabled={isDeletingInProcess?.some(id => id === consultation._id)}
          onClick={() => {
              turnConsultationToClient(consultation._id, consultation.fullName, consultation.contacts, pageSize, currentPage)
          }}
        >
            <svg><use href={`${Sprite}#users-medical`}/></svg>
        </button>
        <button
          className={"btn btn--icon"}
          disabled={isDeletingInProcess?.some(id => id === consultation._id)}
          onClick={() => {
              archiveConsultation(consultation._id)
          }}
        >
            <svg><use href={`${Sprite}#archive`}/></svg>
        </button>
        <button
          className={"btn btn--icon"}
          disabled={isDeletingInProcess?.some(id => id === consultation._id)}
          onClick={() => {
              deleteConsultation(consultation._id, pageSize, currentPage)
          }}
        >
            <svg><use href={`${Sprite}#trash`}/></svg>
        </button>
      </div>
    </li>
  )
})
