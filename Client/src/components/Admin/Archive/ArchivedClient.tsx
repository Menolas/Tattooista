import * as React from 'react'
import avatar from '../../../assets/img/fox.webp'
import { NavLink } from 'react-router-dom'
import {ClientType, ContactsType, ContactType} from '../../../types/Types'
import { SERVER_URL } from '../../../utils/constants'
import Sprite from '../../../assets/svg/sprite.svg'

type PropsType = {
  client: ClientType
  deleteClient: (clientId: string) => void
  reactivateClient: (clientId: string) => void
}

export const ArchivedClient: React.FC<PropsType> = React.memo(({
  client,
  deleteClient,
  reactivateClient
}) => {

  const clientContacts: ContactType = client.contacts

  const contactsArray = Object.keys(clientContacts).map(contact => {
    return clientContacts[contact] ?
      <li key={contact}>
        <span>{contact}:&nbsp;</span>
        <span>{clientContacts[contact]}</span>
      </li> : null
  })

  const clientAvatar = client.avatar ? `${SERVER_URL}/archivedClients/${client._id}/avatar/${client.avatar}` : avatar

  return (
    <li className="admin__card admin__card--client">
      <div className="client-profile__header">
        <NavLink
            to={`/admin/profile?clientId=${client._id}`}
            className="admin__card-link client-profile">
          <div className="client-profile__avatar">
            <img src={clientAvatar} alt={""}/>
          </div>
          <div className="client-profile__details">
            <div className="client-profile__name">
              <span>Name:&nbsp;</span>
              <span>{client.fullName}</span>
            </div>
          </div>
        </NavLink>
        <div className="admin__card-action-btns client-profile__action-btns">
          <button
              className={"btn btn--icon"}
              onClick={() => reactivateClient(client._id)}
          >
            <svg><use href={`${Sprite}#smile`}/></svg>
          </button>
          <button
              className={"btn btn--icon"}
              onClick={() => {
                deleteClient(client._id)
              }}
          >
            <svg><use href={`${Sprite}#trash`}/></svg>
          </button>
        </div>
      </div>
      <div>
        <ul className="list admin__card-contacts-list">
          { contactsArray }
        </ul>
      </div>
      {
          client.gallery && client.gallery.length > 0 &&
        <div className="client-profile__gallery">
          <ul className="client-profile__gallery-list list">
            {
              client.gallery?.map((item, i) => <li key={i}>
                <img src={`${SERVER_URL}/archivedClients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
              </li>)
            }
          </ul>
        </div>
      }
    </li>
  )
})
