import * as React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BookingType, ContactType} from "../../../types/Types";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {ReactComponent as ArchiveIcon} from "../../../assets/svg/archive.svg";
import {ReactComponent as PhoneMissedIcon} from "../../../assets/svg/phone-missed.svg";
import {ReactComponent as PhoneIcon} from "../../../assets/svg/phone.svg";
import {ReactComponent as UsersMedicalIcon} from "../../../assets/svg/users-medical.svg";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../common/Confirmation";
import {ReadMore} from "../../common/ReadMore";

type PropsType = {
  data: null | BookingType;
  isDeletingInProcess?: Array<string>;
  isStatusChanging?: Array<string>;
  changeStatus: () => void;
  turnBookingToClient: () => void;
  remove: () => void;
  archive: () => void;
}

export const BookingProfile: React.FC<PropsType> = React.memo(({
    data,
    isDeletingInProcess,
    isStatusChanging,
    changeStatus,
    turnBookingToClient,
    remove,
    archive,
}) => {

    const { bookingId } = useParams();

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [bookingId]);

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
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

  return (
    <div className="admin__card admin__card--avatar profile">
        <div className="admin__card-actions">
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content={!data.status
                    ? "Mark consultation as contacted"
                    : "Mark consultation as not contacted"
                }
                className={"btn btn--icon"}
                disabled={isStatusChanging?.some(id => id === data._id)}
                onClick={changeStatus}
            >
                {!data.status
                    ? <PhoneIcon/>
                    : <PhoneMissedIcon/>
                }
            </button>
            <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Create client from consultation"
                className={"btn btn--icon"}
                disabled={isDeletingInProcess?.some(id => id === data._id)}
                onClick={() => {
                    setConfirmationData({
                        needConfirmation: true,
                        itemId: data._id,
                        context: 'Are you sure? You about to turn this consultation into client.',
                        cb: turnBookingToClient
                    });
                }}
            >
                <UsersMedicalIcon/>
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
                        cb: archive
                    });
                }}
            >
                <ArchiveIcon/>
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
                        cb: remove
                    });
                }}
            >
                <TrashIcon/>
            </button>
        </div>
        <div className="admin__card-link">
            <div className="admin__card-details">
                <div className={"admin__card-detail-item"}>
                    <span className={"admin__card-data-type"}>Name:&nbsp;</span>
                    <span className={"admin__card-data"}>{data.fullName}</span>
                </div>
                {contactsArray}
            </div>
        </div>
        {
            data.message &&
            <div className={"admin__card-detail-item admin__card-detail-item--message"}>
                <span className={"admin__card-data-type"}>Message:&nbsp;</span>
                <ReadMore id={'message'} text={data.message} amountOfWords={6}/>
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
        <Tooltip id="profile-tooltip"/>
    </div>
  );
});

BookingProfile.displayName = 'BookingProfile';
