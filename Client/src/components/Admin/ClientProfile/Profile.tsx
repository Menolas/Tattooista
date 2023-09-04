import * as React from 'react'
import {useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom'
// @ts-ignore
import avatar from '../../../assets/img/fox.webp'
import {ClientType, ContactType} from '../../../types/Types'
import { SERVER_URL } from '../../../utils/constants'
import { ModalPopUp } from '../../common/ModalPopUp'
import { UpdateClientForm } from '../../Forms/UpdateClientFormFormik'
// @ts-ignore
import Sprite from '../../../assets/svg/sprite.svg'
import { ClientGalleryUploadFormFormik } from '../../Forms/ClientGalleryUploadFormFormik'
import {useDispatch} from "react-redux";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {setIsSuccessAC} from "../../../redux/Clients/clients-reducer";

type PropsType = {
  isSuccess: boolean
  profile: ClientType
  deleteClient: (clientId: string) => void,
  editClient: (clientId: string, values: FormData) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  setIsSuccess: (bol: boolean) => void
}

export const Profile: React.FC<PropsType> = React.memo(({
    isSuccess,
    profile,
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
  let [editClientMode, setEditClientMode] = useState<boolean>(false)
  let [editGalleryMode, setEditGalleryMode] = useState<boolean>(false)
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
      ? `${SERVER_URL}/clients/${profile._id}/avatar/${profile.avatar}`
      : avatar

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
              className="btn btn--icon"
              onClick={() => { setEditClientMode(true) }}
          >
            <svg><use href={`${Sprite}#edit`}/></svg>
          </button>
          <button
              className="btn btn--icon"
              onClick={() => { setEditGalleryMode(true) }}
          >
            <svg><use href={`${Sprite}#images-user`}/></svg>
          </button>
          <NavLink
              className={"btn btn--icon"}
              to={'/admin/clients'}
              //onClick={() => {}}
          >
            <svg><use href={`${Sprite}#archive`}/></svg>
          </NavLink>
          <NavLink
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
    </div>
  )
})

type GalleryItemPropsType = {
  profileId: string
  item: string
}

const GalleryItem: React.FC<GalleryItemPropsType> = ({item,profileId}) => {
  return <li><img src={`${SERVER_URL}/clients/${profileId}/doneTattooGallery/${item}`} alt={''}/></li>
}
