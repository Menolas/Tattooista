import * as React from "react";
import {ReactComponent as ArrowRotateLeftIcon} from "../../../../assets/svg/arrow-rotate-left.svg";
import {ReactComponent as TrashIcon} from "../../../../assets/svg/trash.svg";
import {ClientType, ContactType} from "../../../../types/Types";
import { API_URL } from "../../../../http";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../../common/Confirmation";
import {useState} from "react";
import {ImageFullView} from "../../../common/ImageFullView";
import {DefaultAvatar} from "../../../common/DefaultAvatar";

type PropsType = {
  data: ClientType;
  isDeletingInProcess: Array<string>;
  remove: (clientId: string) => void;
  reactivate: (clientId: string) => void;
}

export const ArchivedClient: React.FC<PropsType> = React.memo(({
  data,
  isDeletingInProcess,
  remove,
  reactivate,
}) => {

  const [carouselData, setCarouselData] = useState<{
    isOpen: boolean, activeIndex?: number}>({isOpen: false});
  const [confirmationData, setConfirmationData] = useState<{
    needConfirmation: boolean,
    itemId?: string,
    cb?: (itemId: string) => void,
    context: string
  }>({needConfirmation: false, context: ''});

  const closeModal = () => {
      setConfirmationData({needConfirmation: false, context: ''});
  }

  const deleteClientCallBack = () => {
    remove(data._id);
  }

  const reactivateClientCallBack = () => {
      reactivate(data._id);
  }

  const clientContacts: ContactType = data?.contacts;
  let contactsArray;

  if (clientContacts) {
      contactsArray = Object.keys(clientContacts).map(contact => {
          return clientContacts[contact]
              ? (
                  <div key={contact} className={"admin__card-detail-item"}>
                      <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
                      <span className={"admin__card-data"}>{clientContacts[contact]}</span>
                  </div>
              )
              : null
      });
  }

  return (
    <li className="admin__card admin__card--avatar">
      <div className="admin__card-actions">
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Restore client"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === data?._id)}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: data._id,
                    context: 'Are you sure? You about to restore this client.',
                    cb: reactivateClientCallBack
                });
            }}
        >
          <ArrowRotateLeftIcon />
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
                    context: 'Are you sure? You about to delete this client FOREVER along with  all the data...',
                    cb: deleteClientCallBack
                });
            }}
        >
            <TrashIcon />
        </button>
      </div>
      <div
        className="admin__card-link">
        <div className={"admin__card-avatar"}>
            {data?.avatar
                ? <img src={`${API_URL}/archivedClients/${data?._id}/avatar/${data?.avatar}`} alt={""}/>
                : <DefaultAvatar/>
            }
        </div>
          <div className={"admin__card-details"}>
          <div className={"admin__card-detail-item"}>
            <span className={"admin__card-data-type"}>Name:&nbsp;</span>
            <span className={"admin__card-data"}>{data?.fullName}</span>
          </div>
          { contactsArray }
        </div>
      </div>
      {
          data?.gallery && data?.gallery.length > 0 &&
        <div className={"client-profile__gallery"}>
          <ul className={"client-profile__gallery-list list"}>
            {
                data?.gallery?.map((item, i) => {
                  return (
                      <li
                          key={`${item}-${i}`}
                          onClick={() => {
                              setCarouselData({isOpen: true, activeIndex: i})
                          }}
                      >
                          <img src={`${API_URL}/archivedClients/${data?._id}/doneTattooGallery/${item}`} alt={''}/>
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
                if (confirmationData.cb && confirmationData.itemId) {
                    confirmationData.cb(confirmationData.itemId);
                } else {
                    console.error("Item ID is undefined or callback function is not provided.");
                }
            }}
            cancel={closeModal}
      />
      { carouselData.isOpen &&
        <ImageFullView
            isOpen={carouselData.isOpen}
            clientId={data?._id}
            gallery={data?.gallery || []}
            activeIndex={carouselData.activeIndex}
            closeImg={()=> setCarouselData({isOpen: false})}
            imgUrl={`${API_URL}/archivedClients/${data?._id}/doneTattooGallery/`}
        />
      }
      <Tooltip id="my-tooltip" />
    </li>
  );
});

ArchivedClient.displayName = 'ArchivedClient';
