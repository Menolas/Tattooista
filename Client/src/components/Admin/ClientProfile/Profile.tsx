import * as React from "react";
import {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
// @ts-ignore
import avatar from "../../../assets/img/fox.webp";
import {ClientType, ContactType} from "../../../types/Types";
import { API_URL } from "../../../http";
import { ModalPopUp } from "../../common/ModalPopUp";
import { UpdateClientForm } from "../../Forms/UpdateClientFormFormik";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import { GalleryUploadForm } from "../../Forms/GalleryUploadForm";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../common/Confirmation";
import {SuccessModalType} from "../../../redux/Bookings/bookings-reducer";
import {ImageFullView} from "../../common/ImageFullView";

type PropsType = {
  successModal: SuccessModalType
  profile: ClientType
  isDeletingPicturesInProcess: Array<string>
  deleteClient: (clientId: string) => void
  editClient: (clientId: string, values: FormData) => void
  updateClientGallery: (clientId: string, values: FormData) => void
  deleteClientGalleryPicture: (clientId: string, picture: string) => void
  archiveClient: (id: string) => void
  setSuccessModal: () => void
}

export const Profile: React.FC<PropsType> = React.memo(({
    successModal,
    profile,
    isDeletingPicturesInProcess,
    deleteClient,
    editClient,
    updateClientGallery,
    deleteClientGalleryPicture,
    archiveClient,
    setSuccessModal,
}) => {

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModal();
            }, 3000);
        }
    }, [successModal]);

  //debugger
  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [editGalleryMode, setEditGalleryMode] = useState<boolean>(false);
  const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);
  const [carouselData, setCarouselData] = useState<{
        isOpen: boolean, activeIndex?: number}>({isOpen: false});

  const modalTitle = 'EDIT CLIENT';

  const closeModal = () => {
    setEditClientMode(false);
    setEditGalleryMode(false);
    setNeedConfirmation(false);
  }

  const deleteClientCallBack = () => {
      deleteClient(profile._id);
  }

  if (!profile) {
    return <div>Sorry, we can not find such a client in data base</div>
  }

  const profileContacts: ContactType = profile.contacts

  const contactsArray = profileContacts
      ? Object.keys(profileContacts).map(contact => {
          return profileContacts[contact]
              ? (
                  <div key={contact} className={"admin__card-detail-item"}>
                    <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
                    <span className={"admin__card-data"}>{profileContacts[contact]}</span>
                  </div>
              )
             : null
        }) : <></>


  const Avatar = profile.avatar
      ? `${API_URL}/clients/${profile._id}/avatar/${profile.avatar}`
      : avatar;

  let profileGallery = [];

  if (profile.gallery?.length) {
      profileGallery = profile.gallery
          .map((item, index) => {
              return (
                  <li
                      onClick={() => {
                          setCarouselData({isOpen: true, activeIndex: index});
                      }}
                  >
                      <img src={`${API_URL}/clients/${profile._id}/doneTattooGallery/${item}`} alt={''}/>
                  </li>
              )
          });
  }


  return (
    <div className="admin__card admin__card--avatar profile">
      <div className="admin__card-actions">
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
            onClick={() => { setEditGalleryMode(true); }}
        >
          <svg><use href={`${Sprite}#images-user`}/></svg>
        </button>
        <NavLink
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="Move client to archive client"
            className={"btn btn--icon"}
            to={'/admin/clients'}
            onClick={() => { archiveClient(profile._id); }}
        >
          <svg><use href={`${Sprite}#archive`}/></svg>
        </NavLink>
        <NavLink
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="Delete client"
            className="btn btn--icon"
            to={'/admin/clients'}
            onClick={() => { setNeedConfirmation(true); }}
        >
          <svg><use href={`${Sprite}#trash`}/></svg>
        </NavLink>
      </div>
      <div className="admin__card-link">
        <div className="admin__card-avatar">
          <img src={`${Avatar}`} alt={profile.fullName} />
        </div>
        <div className="admin__card-details">
          <div className={"admin__card-detail-item"}>
            <span className={"admin__card-data-type"}>Name:&nbsp;</span>
            <span className={"admin__card-data"}>{profile.fullName}</span>
          </div>
          { contactsArray }
        </div>
      </div>
      { profile.gallery && profile.gallery.length
          ? (
            <div className="client-profile__gallery">
              <ul className="client-profile__gallery-list list">
                {profileGallery}
              </ul>
            </div>
          )
          : null
      }
      <ModalPopUp
          isOpen={editClientMode}
          modalTitle={modalTitle}
          closeModal={closeModal}
      >
          {editClientMode &&
              <UpdateClientForm
                  isEditing={editClientMode}
                  profile={profile}
                  editClient={editClient}
                  closeModal={closeModal}
              />
          }
      </ModalPopUp>
      <ModalPopUp
          isOpen={editGalleryMode}
          modalTitle="Edit Gallery"
          closeModal={closeModal}
      >
          {  editGalleryMode &&
              <GalleryUploadForm
                  updateId={profile._id}
                  gallery={profile.gallery}
                  isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                  updateGallery={updateClientGallery}
                  deleteClientGalleryPicture={deleteClientGalleryPicture}
                  closeModal={closeModal}
              />
          }
      </ModalPopUp>
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
        <SuccessPopUp
            isOpen={successModal.isSuccess}
            closeModal={setSuccessModal}
            content={successModal.successText}
        />
        {  carouselData.isOpen &&
            <ImageFullView
                isOpen={carouselData.isOpen}
                clientId={profile._id}
                gallery={profile.gallery}
                activeIndex={carouselData.activeIndex}
                closeImg={()=> {setCarouselData({isOpen: false});}}
            />
        }
      <Tooltip id="profile-tooltip" />
    </div>
  )
});
