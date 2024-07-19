import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ClientType, ContactType} from "../../../types/Types";
import {API_URL} from "../../../http";
import {ModalPopUp} from "../../common/ModalPopUp";
import {UpdateClientForm} from "../../Forms/UpdateClientForm";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {ReactComponent as ArchiveIcon} from "../../../assets/svg/archive.svg";
import {ReactComponent as ImageUserIcon} from "../../../assets/svg/images-user.svg";
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../common/Confirmation";
import {ImageFullView} from "../../common/ImageFullView";
import {DefaultAvatar} from "../../common/DefaultAvatar";

type PropsType = {
  apiError: null | string;
  data: ClientType;
  isDeletingPicturesInProcess: Array<string>;
  remove: (clientId: string) => void;
  deleteGalleryItem: (clientId: string, picture: string) => void;
  archive: (id: string) => void;
}

export const Profile: React.FC<PropsType> = React.memo(({
    apiError,
    data,
    isDeletingPicturesInProcess,
    remove,
    deleteGalleryItem,
    archive,
}) => {
    const navigate = useNavigate();

    const { clientId } = useParams();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [clientId]);

    useEffect(() => {
        if (editClientMode && apiError === null) {
            setEditClientMode(false);
        }
    }, [apiError]);

  const [editClientMode, setEditClientMode] = useState<boolean>(false);
  const [editGalleryMode, setEditGalleryMode] = useState<boolean>(false);
  const [carouselData, setCarouselData] = useState<{
        isOpen: boolean, activeIndex?: number}>({isOpen: false});

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

  const modalTitle = 'EDIT CLIENT';

  const closeModal = () => {
    setEditClientMode(false);
    setEditGalleryMode(false);
      setConfirmationData({needConfirmation: false, context: ''});
  };

  const deleteClientCallBack = () => {
      remove(data._id);
      navigate("/admin/clients");
  };

  const archiveClientCallBack = () => {
      archive(data._id);
      navigate("/admin/clients");
  };

  if (!data) {
    return <div>Sorry, we can not find such a client in data base</div>
  }

  const profileContacts: ContactType = data.contacts;

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

  let profileGallery: JSX.Element[] = [];

  if (data.gallery?.length) {
      profileGallery = data.gallery
          .map((item, index) => {
              return (
                  <li
                      key={index}
                      onClick={() => {
                          setCarouselData({isOpen: true, activeIndex: index});
                      }}
                  >
                      <img src={`${API_URL}/clients/${data._id}/doneTattooGallery/${item}`} alt={''}/>
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
          <EditIcon />
        </button>
        <button
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="Edit client's tattoos gallery"
            className="btn btn--icon"
            onClick={() => { setEditGalleryMode(true); }}
        >
          <ImageUserIcon />
        </button>
        <button
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="Move client to archive client"
            className={"btn btn--icon"}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: data._id,
                    context: 'Are you sure? You about to archive this client.',
                    cb: archiveClientCallBack
                });
            }}
        >
          <ArchiveIcon />
        </button>
        <button
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="Delete client"
            className="btn btn--icon"
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: data._id,
                    context: 'Are you sure? You about to delete this client FOREVER along with all data...',
                    cb: deleteClientCallBack
                });
            }}
        >
          <TrashIcon />
        </button>
      </div>
      <div className="admin__card-link">
        <div className="admin__card-avatar">
            {!data?.avatar
                ? <DefaultAvatar/>
                : <img src={`${API_URL}/clients/${data._id}/avatar/${data.avatar}`} alt={data.fullName}/>
            }
        </div>
          <div className="admin__card-details">
          <div className={"admin__card-detail-item"}>
            <span className={"admin__card-data-type"}>Name:&nbsp;</span>
            <span className={"admin__card-data"}>{data.fullName}</span>
          </div>
          { contactsArray }
        </div>
      </div>
      { data.gallery && data.gallery.length
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
                  apiError={apiError}
                  isEditing={editClientMode}
                  data={data}
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
                  apiError={apiError}
                  isEditPortfolio={false}
                  client={data}
                  isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                  deleteClientGalleryPicture={deleteGalleryItem}
                  closeModal={closeModal}
              />
          }
      </ModalPopUp>
      <Confirmation
            isOpen={confirmationData.needConfirmation}
            content={confirmationData.context}
            confirm={() => {
                if (confirmationData.cb) {
                    confirmationData.cb();
                } else {
                    console.error("Item ID is undefined or callback function is not provided.");
                }
            }}
            cancel={closeModal}
      />
      {  carouselData.isOpen &&
        <ImageFullView
                isOpen={carouselData.isOpen}
                clientId={data._id}
                gallery={data.gallery || []}
                activeIndex={carouselData.activeIndex}
                closeImg={()=> {setCarouselData({isOpen: false});}}
                imgUrl={`${API_URL}/clients/${data._id}/doneTattooGallery/`}
        />
      }
      <Tooltip id="profile-tooltip" />
    </div>
  );
});

Profile.displayName = 'Profile';
