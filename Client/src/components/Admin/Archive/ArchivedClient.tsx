import * as React from "react";
// @ts-ignore
import avatar from "../../../assets/img/fox.webp";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import { NavLink } from "react-router-dom";
import {ClientType, ContactType} from "../../../types/Types";
import { API_URL } from "../../../http";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../common/Confirmation";
import {useState} from "react";
import {ModalPopUp} from "../../common/ModalPopUp";

type PropsType = {
  client: ClientType
  isDeletingInProcess: Array<string>
  deleteClient: (clientId: string) => void
  reactivateClient: (clientId: string) => void
}

export const ArchivedClient: React.FC<PropsType> = React.memo(({
  client,
  isDeletingInProcess,
  deleteClient,
  reactivateClient
}) => {

  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);
  const [needRestoreConfirmation, setNeedRestoreConfirmation] = useState<boolean>(false);

  const closeModal = () => {
    setNeedConfirmation(false);
  }

  const deleteClientCallBack = () => {
    deleteClient(client._id);
  }

  const reactivateClientCallBack = () => {
      reactivateClient(client._id);
  }

  const clientContacts: ContactType = client.contacts;

  const contactsArray = Object.keys(clientContacts).map(contact => {
    return clientContacts[contact]
        ? (
            <div key={contact} className={"admin__card-detail-item"}>
              <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
              <span className={"admin__card-data"}>{clientContacts[contact]}</span>
            </div>
        )
        : null
  })

  const clientAvatar = client.avatar ? `${API_URL}/archivedClients/${client._id}/avatar/${client.avatar}` : avatar;

  return (
    <li className="admin__card admin__card--avatar">
      <div className="admin__card-actions">
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Restore client"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === client._id)}
            onClick={() => setNeedRestoreConfirmation(true)}
        >
          <svg><use href={`${Sprite}#arrow-rotate-left`}/></svg>
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Delete client"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === client._id)}
            onClick={() => {
              setNeedConfirmation(true)
            }}
        >
          <svg><use href={`${Sprite}#trash`}/></svg>
        </button>
      </div>
      <NavLink
        to={`/admin/profile?clientId=${client._id}`}
        className="admin__card-link">
        <div className={"admin__card-avatar"}>
          <img src={clientAvatar} alt={""}/>
        </div>
        <div className={"admin__card-details"}>
          <div className={"admin__card-detail-item"}>
            <span className={"admin__card-data-type"}>Name:&nbsp;</span>
            <span className={"admin__card-data"}>{client.fullName}</span>
          </div>
          { contactsArray }
        </div>
      </NavLink>
      {
          client.gallery && client.gallery.length > 0 &&
        <div className={"client-profile__gallery"}>
          <ul className={"client-profile__gallery-list list"}>
            {
              client.gallery?.map((item, i) => <li key={i}>
                <img src={`${API_URL}/archivedClients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
              </li>)
            }
          </ul>
        </div>
      }
      <ModalPopUp
          isOpen={needConfirmation || needRestoreConfirmation}
          modalTitle={''}
          closeModal={closeModal}
      >
          { needConfirmation &&
              <Confirmation
                  content={'Are you sure? You about to delete this client from archive FOREVER along with all the data and images...'}
                  confirm={deleteClientCallBack}
                  cancel={closeModal}
              />
          }
          { needRestoreConfirmation &&
              <Confirmation
                  content={'Are you sure? You about to restore this client from archive along with all the data and images...'}
                  confirm={reactivateClientCallBack}
                  cancel={closeModal}
              />
          }
      </ModalPopUp>
      <Tooltip id="my-tooltip" />
    </li>
  )
})
