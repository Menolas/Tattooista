import * as React from 'react'
import {useState} from 'react'
// @ts-ignore
import avatar from '../../../assets/img/fox.webp'
// @ts-ignore
import Sprite from '../../../assets/svg/sprite.svg'
import { NavLink } from 'react-router-dom'
import {ClientType, ContactType} from '../../../types/Types'
import { SERVER_URL } from '../../../utils/constants'
import { ModalPopUp } from '../../common/ModalPopUp'
import { UpdateClientForm } from '../../Forms/UpdateClientFormFormik'
import {ClientGalleryUploadFormFormik} from '../../Forms/ClientGalleryUploadFormFormik'
import {Tooltip} from "react-tooltip";

type PropsType = {
  client: ClientType
  pageSize: number
  currentPage: number
  isDeletingInProcess: Array<string>
  deleteClient: (clientId: string, pageSize: number, currentPage: number) => void
  editClient: (clientId: string, values: FormData) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (clientId: string) => void
}

export const Client: React.FC<PropsType> = React.memo(({
  client,
  isDeletingInProcess,
  deleteClient,
  editClient,
  pageSize,
  currentPage,
  updateClientGallery,
  deleteClientGalleryPicture,
  archiveClient,
}) => {

  const [editClientMode, setEditClientMode] = useState<boolean>(false)
  const [editGalleryMode, setEditGalleryMode] = useState<boolean>(false)

  const [bigImg, setBigImg] = useState('')

  const showBigImg = (fileName) => {
    if (!bigImg) {
      setBigImg(fileName)
    }
  }

  const closeBigImg = () => {
    setBigImg('')
  }

  const closeEditModal = () => {
    setEditClientMode(false)
    setEditGalleryMode(false)
  }

  const modalTitle = 'EDIT CLIENT'

  const clientContacts: ContactType = client.contacts

  const contacts = Object.keys(clientContacts).map(contact => {
    return clientContacts[contact] ?
      <li key={contact}>
        <span>{contact}:&nbsp;</span>
        <span>{clientContacts[contact]}</span>
      </li> : null
  })

  const clientAvatar = client.avatar ? `${SERVER_URL}/clients/${client._id}/avatar/${client.avatar}` : avatar

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
        <div className="client-profile__action-btns admin__card-action-btns">
          <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Edit client"
              className={"btn btn--icon"}
              onClick={() => {setEditClientMode(true)}}
          >
            <svg><use href={`${Sprite}#edit`}/></svg>
          </button>
          <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Edit client's gallery"
              className={"btn btn--icon"}
              onClick={() => {setEditGalleryMode(true)}}
          >
            <svg><use href={`${Sprite}#images-user`}/></svg>
          </button>
          <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Move client to archive"
              className={"btn btn--icon"}
              disabled={isDeletingInProcess?.some(id => id === client._id)}
              onClick={() => {

                archiveClient(client._id)
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
                deleteClient(client._id, pageSize, currentPage)
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
      {
        client.gallery && client.gallery.length > 0 &&
        <div className="client-profile__gallery">
          <ul className="client-profile__gallery-list list">
            {
              client.gallery.map(item => {
                return (
                    <li
                        key={item}
                        onClick={() => { showBigImg(item) }}
                    >
                      <img src={`${SERVER_URL}/clients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
                    </li>
                )
              })
            }
          </ul>
        </div>
      }
      { editClientMode &&
        <ModalPopUp
            modalTitle={modalTitle}
            closeModal={closeEditModal}
        >
          <UpdateClientForm
              profile={client}
              editClient={editClient}
              closeModal={closeEditModal}
          />
        </ModalPopUp>
      }
      { editGalleryMode &&
          <ModalPopUp
              modalTitle="Edit Gallery"
              closeModal={closeEditModal}
          >
            <ClientGalleryUploadFormFormik
                profileId={client._id}
                gallery={client.gallery}
                isDeletingInProcess={isDeletingInProcess}
                updateClientGallery={updateClientGallery}
                deleteClientGalleryPicture={deleteClientGalleryPicture}
                closeModal={closeEditModal}
            />
          </ModalPopUp>
      }
      {
          bigImg &&
          <div className="gallery__large-wrap modal-wrap">
            <div className="gallery__large">
              <button
                  className="close-btn gallery__item-close-btn"
                  onClick={() => { closeBigImg() }}>
                {''}
              </button>
              <img src={`${SERVER_URL}/clients/${client._id}/doneTattooGallery/${bigImg}`} alt={''} />
            </div>
          </div>
      }
      <Tooltip id="my-tooltip" />
    </li>
  )
})
