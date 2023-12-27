import * as React from "react"
import {useEffect, useState} from "react"
import { NavLink } from "react-router-dom"
// @ts-ignore
import avatar from "../../../assets/img/fox.webp"
import {ClientType, ContactType} from "../../../types/Types"
import { API_URL } from "../../../http"
import { ModalPopUp } from "../../common/ModalPopUp"
import { UpdateClientForm } from "../../Forms/UpdateClientFormFormik"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import { ClientGalleryUploadFormFormik } from "../../Forms/ClientGalleryUploadFormFormik"
import {useDispatch} from "react-redux"
import {SuccessPopUp} from "../../common/SuccessPopUp"
import {setIsSuccessAC} from "../../../redux/Clients/clients-reducer"
import {Tooltip} from "react-tooltip"

type PropsType = {
  isSuccess: boolean
  profile: ClientType
  isDeletingPicturesInProcess: Array<string>
  deleteClient: (clientId: string) => void
  editClient: (clientId: string, values: FormData) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  setIsSuccess: (bol: boolean) => void
}

type GalleryItemPropsType = {
  profileId: string
  item: string
}

export const Profile: React.FC<PropsType> = React.memo(({
    isSuccess,
    profile,
    isDeletingPicturesInProcess,
    deleteClient,
    editClient,
    updateClientGallery,
    deleteClientGalleryPicture
}) => {

  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
      setTimeout( () => {
        dispatch(setIsSuccessAC(false))
      }, 1500)
    }
  }, [isSuccess])

  //debugger
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
  const successPopUpContent = "You successfully added changes to your clients list"
  const modalTitle = 'EDIT CLIENT'

  const closeModal = () => {
    setEditClientMode(false)
    setEditGalleryMode(false)
  }

  if (!profile) {
    return <div>Sorry, we can not find such a client in data base</div>
  }

  const profileContacts: ContactType = profile.contacts

  const contactsArray = profileContacts
      ? Object.keys(profileContacts).map(contact => {
          return profileContacts[contact] ?
            <li key={contact}>
              <span>{contact}:&nbsp;</span>
              <span>{profileContacts[contact]}</span>
            </li> : null
        }) : <></>


  const Avatar = profile.avatar
      ? `${API_URL}/clients/${profile._id}/avatar/${profile.avatar}`
      : avatar

  const GalleryItem: React.FC<GalleryItemPropsType> = ({item,profileId}) => {
    return (
        <li
            onClick={() => { showBigImg(item) }}
        >
          <img src={`${API_URL}/clients/${profileId}/doneTattooGallery/${item}`} alt={''}/>
        </li>
    )
  }

  return (
    <div className="client-profile">
      <div className="client-profile__header">
        <div className="client-profile__avatar">
          <img src={`${Avatar}`} alt={profile.fullName} />
        </div>
        <div className="client-profile__details">
          <span className="client-profile__name">
            {profile.fullName}
          </span>
          <div className="client-profile__contacts">
            <ul className="list admin__card-contacts-list">
              { contactsArray }
            </ul>
          </div>
        </div>
        <div className="client-profile__action-btns">
          <button
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="Edit client info"
              className="btn btn--icon"
              onClick={() => { setEditClientMode(true) }}
          >
            <svg><use href={`${Sprite}#edit`}/></svg>
          </button>
          <button
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="Edit client's tattoos gallery"
              className="btn btn--icon"
              onClick={() => { setEditGalleryMode(true) }}
          >
            <svg><use href={`${Sprite}#images-user`}/></svg>
          </button>
          <NavLink
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="Move client to archive client"
              className={"btn btn--icon"}
              to={'/admin/clients'}
              //onClick={() => {}}
          >
            <svg><use href={`${Sprite}#archive`}/></svg>
          </NavLink>
          <NavLink
              data-tooltip-id="profile-tooltip"
              data-tooltip-content="Delete client"
              className="btn btn--icon"
              to={'/admin/clients'}
              onClick={() => { deleteClient(profile._id) }}
          >
            <svg><use href={`${Sprite}#trash`}/></svg>
          </NavLink>
        </div>
      </div>
      { profile.gallery && profile.gallery.length
          ? (
            <div className="client-profile__gallery">
              <ul className="client-profile__gallery-list list">
                {profile.gallery.map((item, i) => <GalleryItem key={i} item={item} profileId={profile._id}/>)}
              </ul>
            </div>
          )
          : null
      }
      { editClientMode &&
          <ModalPopUp
              modalTitle={modalTitle}
              closeModal={closeModal}
          >
            <UpdateClientForm
                profile={profile}
                editClient={editClient}
                closeModal={closeModal}
            />
          </ModalPopUp>
      }
      { editGalleryMode &&
          <ModalPopUp
              modalTitle="Edit Gallery"
              closeModal={closeModal}
          >
            <ClientGalleryUploadFormFormik
                profileId={profile._id}
                gallery={profile.gallery}
                updateClientGallery={updateClientGallery}
                deleteClientGalleryPicture={deleteClientGalleryPicture}
                closeModal={closeModal}
            />
          </ModalPopUp>
      }
      {
          isSuccess &&
          <SuccessPopUp closeModal={setIsSuccessAC} content={successPopUpContent} />
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
              <img src={`${API_URL}/clients/${profile._id}/doneTattooGallery/${bigImg}`} alt={''} />
            </div>
          </div>
      }
      <Tooltip id="profile-tooltip" />
    </div>
  )
})
