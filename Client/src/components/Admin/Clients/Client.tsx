import * as React from "react";
import {useState} from "react";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {ReactComponent as ArchiveIcon} from "../../../assets/svg/archive.svg";
import {ReactComponent as ImageUserIcon} from "../../../assets/svg/images-user.svg";
import { NavLink } from "react-router-dom";
import { ClientType, ContactType } from "../../../types/Types";
import { API_URL } from "../../../http";
import { ModalPopUp } from "../../common/ModalPopUp";
import { Tooltip } from "react-tooltip";
import { Confirmation } from "../../common/Confirmation";
import {ImageFullView} from "../../common/ImageFullView";
import {GalleryUploadForm} from "../../Forms/GalleryUploadForm";
import {DefaultAvatar} from "../../common/DefaultAvatar";

type PropsType = {
  apiError: null | string;
  data: ClientType;
  isDeletingInProcess: Array<string>;
  isDeletingPicturesInProcess: Array<string>;
  remove: (clientId: string) => void;
  archive: (clientId: string) => void;
  setData: (client: ClientType) => void;
  setEditClientMode: (mode: boolean) => void;
  deleteGalleryItem: (clientId: string, picture: string) => void;
}

export const Client: React.FC<PropsType> = React.memo(({
  apiError,
  data,
  isDeletingInProcess,
  isDeletingPicturesInProcess,
  remove,
  archive,
  setData,
  setEditClientMode,
  deleteGalleryItem,
}) => {

  const [carouselData, setCarouselData] = useState<{
      isOpen: boolean, activeIndex?: number}>({isOpen: false});

  const [editGalleryMode, setEditGalleryMode] = useState<boolean>(false);

  const [confirmationData, setConfirmationData] = useState<{
    needConfirmation: boolean,
    itemId?: string,
    cb?: () => void,
    context: string
  }>({needConfirmation: false, context: ''});

  const closeModal = () => {
    setConfirmationData({needConfirmation: false, context: ''});
  }

  const archiveCallBack = () => {
      archive(data._id);
  }

  const removeCallBack = () => {
      remove(data._id);
  }

  const clientContacts: ContactType = data.contacts;

  const contacts = clientContacts
    ? Object.keys(clientContacts).map(contact => {
        return clientContacts[contact]
          ? (
                <div key={contact} className={"admin__card-detail-item"}>
                  <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
                  <span className={"admin__card-data"}>{clientContacts[contact]}</span>
                </div>
            )
           : null
      })
  : null;

  return (
    <li className="admin__card admin__card--avatar">
      <div className="admin__card-actions">
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Edit client"
            className={"btn btn--icon"}
            onClick={() => {
                setEditClientMode(true);
                setData(data);
            }}
        >
          <EditIcon/>
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Edit client's gallery"
            className={"btn btn--icon"}
            onClick={() => {
                setEditGalleryMode(true);
                setData(data);
            }}
        >
          <ImageUserIcon />
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Move client to archive"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === data._id)}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: data._id,
                    context: 'Are you sure? You about to archive this client.',
                    cb: archiveCallBack
                });
            }}
        >
          <ArchiveIcon/>
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Delete client"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === data._id)}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: data._id,
                    context: 'Are you sure? You about to delete this client.',
                    cb: removeCallBack
                });
            }}
        >
          <TrashIcon/>
        </button>
      </div>
      <NavLink
          to={`/admin/profile?clientId=${data._id}`}
          className={"admin__card-link"}
      >
          <div className={"admin__card-avatar"}>
              {!data.avatar
                  ? <DefaultAvatar/>
                  : <img src={`${API_URL}/clients/${data._id}/avatar/${data.avatar}`} alt="preview"/>
              }
          </div>
          <div className={"admin__card-details"}>
            <div className={"admin__card-detail-item"}>
              <span className={"admin__card-data-type"}>Name:&nbsp;</span>
              <span className={"admin__card-data"}>{data.fullName}</span>
            </div>
            { contacts }
          </div>
      </NavLink>
      {
          data.gallery && data.gallery.length > 0 &&
        <div className={"client-profile__gallery"}>
          <ul className={"client-profile__gallery-list list"}>
            {
                data.gallery.map((item, index) => {
                return (
                    <li
                        key={item}
                        onClick={() => {
                            setCarouselData({isOpen: true, activeIndex: index});
                        }}
                    >
                      <img src={`${API_URL}/clients/${data._id}/doneTattooGallery/${item}`} alt={''}/>
                    </li>
                )
              })
            }
          </ul>
        </div>
      }
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
      <ModalPopUp
            isOpen={editGalleryMode}
            modalTitle={'Edit Client Gallery'}
            closeModal={() => {setEditGalleryMode(false);}}
      >
        {editGalleryMode &&
            <GalleryUploadForm
                apiError={apiError}
                isEditPortfolio={false}
                client={data}
                isDeletingPicturesInProcess={isDeletingPicturesInProcess}
                deleteClientGalleryPicture={deleteGalleryItem}
                closeModal={() => {setEditGalleryMode(false);}}
            />
        }
      </ModalPopUp>
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
      <Tooltip id="my-tooltip" />
    </li>
  );
});

Client.displayName = 'Client';
