import * as React from "react";
import {useState} from "react";
// @ts-ignore
import avatar from "../../../assets/img/fox.webp";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import { NavLink } from "react-router-dom";
import { ClientType, ContactType } from "../../../types/Types";
import { API_URL } from "../../../http";
import { ModalPopUp } from "../../common/ModalPopUp";
import { Tooltip } from "react-tooltip";
import { Confirmation } from "../../common/Confirmation";

type PropsType = {
  client: ClientType
  isDeletingInProcess: Array<string>
  isDeletingPicturesInProcess: Array<string>
  deleteClient: (clientId: string) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (clientId: string) => void
  setClient: (client: ClientType) => void
  setEditClientMode: (mode: boolean) => void
  setEditGalleryMode: (mode: boolean) => void
  setClientGallery: (clientGallery: Array<string>) => void
}

export const Client: React.FC<PropsType> = React.memo(({
  client,
  isDeletingInProcess,
  isDeletingPicturesInProcess,
  deleteClient,
  updateClientGallery,
  deleteClientGalleryPicture,
  archiveClient,
  setClient,
  setEditClientMode,
  setEditGalleryMode,
  setClientGallery,
}) => {

  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);

  const [bigImg, setBigImg] = useState('');

  const showBigImg = (fileName) => {
    if (!bigImg) {
      setBigImg(fileName);
    }
  }

  const closeBigImg = () => {
    setBigImg('');
  }

  const closeModal = () => {
    setNeedConfirmation(false);
  }

  const clientContacts: ContactType = client.contacts;

  const contacts = Object.keys(clientContacts).map(contact => {
    return clientContacts[contact]
      ? (
            <div key={contact} className={"admin__card-detail-item"}>
              <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
              <span className={"admin__card-data"}>{clientContacts[contact]}</span>
            </div>
        )
       : null
  });

  const clientAvatar = client.avatar ? `${API_URL}/clients/${client._id}/avatar/${client.avatar}` : avatar;

  const deleteClientCallBack = () => {
    deleteClient(client._id);
  }

  return (
    <li className="admin__card admin__card--avatar">
      <div className="admin__card-actions">
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Edit client"
            className={"btn btn--icon"}
            onClick={() => {
                setEditClientMode(true);
                setClient(client);
            }}
        >
          <svg><use href={`${Sprite}#edit`}/></svg>
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Edit client's gallery"
            className={"btn btn--icon"}
            onClick={() => {
                setEditGalleryMode(true);
                setClient(client);
            }}
        >
          <svg><use href={`${Sprite}#images-user`}/></svg>
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Move client to archive"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === client._id)}
            onClick={() => {
              archiveClient(client._id);
            }}
        >
          <svg><use href={`${Sprite}#archive`}/></svg>
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Delete client"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === client._id)}
            onClick={() => {
              setNeedConfirmation(true);
            }}
        >
          <svg><use href={`${Sprite}#trash`}/></svg>
        </button>
      </div>
      <NavLink
          to={`/admin/profile?clientId=${client._id}`}
          className={"admin__card-link"}
      >
          <div className={"admin__card-avatar"}>
            <img src={clientAvatar} alt={""}/>
          </div>
          <div className={"admin__card-details"}>
            <div className={"admin__card-detail-item"}>
              <span className={"admin__card-data-type"}>Name:&nbsp;</span>
              <span className={"admin__card-data"}>{client.fullName}</span>
            </div>
            { contacts }
          </div>
      </NavLink>
      {
        client.gallery && client.gallery.length > 0 &&
        <div className={"client-profile__gallery"}>
          <ul className={"client-profile__gallery-list list"}>
            {
              client.gallery.map(item => {
                return (
                    <li
                        key={item}
                        onClick={() => { showBigImg(item); }}
                    >
                      <img src={`${API_URL}/clients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
                    </li>
                )
              })
            }
          </ul>
        </div>
      }
      <ModalPopUp
          isOpen={needConfirmation}
          modalTitle={''}
          closeModal={closeModal}
      >
        <Confirmation
            content={'Are you sure? You about to delete this client FOREVER along with  all the data and images...'}
            confirm={deleteClientCallBack}
            cancel={closeModal}
        />
      </ModalPopUp>

      {
          bigImg &&
          <div className="gallery__large-wrap modal-wrap">
            <div className="gallery__large">
              <button
                  className="close-btn gallery__item-close-btn"
                  onClick={() => { closeBigImg() }}>
                {''}
              </button>
              <img src={`${API_URL}/clients/${client._id}/doneTattooGallery/${bigImg}`} alt={''} />
            </div>
          </div>
      }
      <Tooltip id="my-tooltip" />
    </li>
  )
})
