import * as React from "react"
import {useState} from "react"
// @ts-ignore
import avatar from "../../../assets/img/fox.webp"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import { NavLink } from "react-router-dom"
import { ClientType, ContactType } from "../../../types/Types"
import { API_URL } from "../../../http"
import { ModalPopUp } from "../../common/ModalPopUp"
import { UpdateClientForm } from "../../Forms/UpdateClientFormFormik"
import { GalleryUploadForm } from "../../Forms/GalleryUploadForm"
import { Tooltip } from "react-tooltip"
import { Confirmation } from "../../common/Confirmation"

type PropsType = {
  client: ClientType
  pageSize: number
  currentPage: number
  isDeletingInProcess: Array<string>
  isDeletingPicturesInProcess: Array<string>
  deleteClient: (clientId: string) => void
  editClient: (clientId: string, values: FormData) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (clientId: string) => void
}

export const Client: React.FC<PropsType> = React.memo(({
  client,
  isDeletingInProcess,
  isDeletingPicturesInProcess,
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
  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false)

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

  const closeModal = () => {
    setNeedConfirmation(false)
  }

  const modalTitle = 'EDIT CLIENT'

  const clientContacts: ContactType = client.contacts

  const contacts = Object.keys(clientContacts).map(contact => {
    return clientContacts[contact] ?
      <div key={contact} className={"admin__card-detail-item"}>
        <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
        <span className={"admin__card-data"}>{clientContacts[contact]}</span>
      </div> : null
  })

  const clientAvatar = client.avatar ? `${API_URL}/clients/${client._id}/avatar/${client.avatar}` : avatar

  const deleteClientCallBack = () => {
    deleteClient(client._id)
  }

  return (
    <li className="admin__card admin__card--avatar admin__card--client">
      <div className="admin__card-actions">
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
              setNeedConfirmation(true)
            }}
        >
          <svg><use href={`${Sprite}#trash`}/></svg>
        </button>
      </div>
      <NavLink
            to={`/admin/profile?clientId=${client._id}`}
            className="admin__card-link"
      >
          <div className="admin__card-avatar">
            <img src={clientAvatar} alt={""}/>
          </div>
          <div className="admin__card-details">
            <div className={"admin__card-detail-item"}>
              <span className={"admin__card-data-type"}>Name:&nbsp;</span>
              <span className={"admin__card-data"}>{client.fullName}</span>
            </div>
            { contacts }
          </div>
      </NavLink>
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
                      <img src={`${API_URL}/clients/${client._id}/doneTattooGallery/${item}`} alt={''}/>
                    </li>
                )
              })
            }
          </ul>
        </div>
      }
      {
        needConfirmation &&
          <ModalPopUp
              modalTitle={''}
              closeModal={closeModal}
          >
            <Confirmation
                content={'Are you sure? You about to delete this client FOREVER along with  all the data and images...'}
                confirm={deleteClientCallBack}
                cancel={closeModal}
            />
          </ModalPopUp>
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
            <GalleryUploadForm
                updateId={client._id}
                gallery={client.gallery}
                isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                updateGallery={updateClientGallery}
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
              <img src={`${API_URL}/clients/${client._id}/doneTattooGallery/${bigImg}`} alt={''} />
            </div>
          </div>
      }
      <Tooltip id="my-tooltip" />
    </li>
  )
})
