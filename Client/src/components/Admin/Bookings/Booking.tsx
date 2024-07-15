import * as React from "react";
import {BookingType} from "../../../types/Types";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import {ReactComponent as ArchiveIcon} from "../../../assets/svg/archive.svg";
import {ReactComponent as PhoneMissedIcon} from "../../../assets/svg/phone-missed.svg";
import {ReactComponent as PhoneIcon} from "../../../assets/svg/phone.svg";
import {ReactComponent as UsersMedicalIcon} from "../../../assets/svg/users-medical.svg";
import {Tooltip} from "react-tooltip";
import {useState} from "react";
import {Confirmation} from "../../common/Confirmation";
import {ReadMore} from "../../common/ReadMore";

type PropsType = {
  consultation: BookingType;
  isDeletingInProcess?: Array<string>;
  isStatusChanging?: Array<string>;
  changeStatus: (id: string, status: boolean) => void;
  turnBookingToClient: (id: string) => void;
  remove: (id: string) => void;
  archive: (id: string) => void;
}

export const Booking: React.FC<PropsType> = React.memo(({
    consultation,
    isDeletingInProcess,
    isStatusChanging,
    changeStatus,
    turnBookingToClient,
    remove,
    archive
}) => {

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const removeCallBack = () => {
        remove(consultation._id);
    }

    const turnBookingToClientCallBack = () => {
        turnBookingToClient(consultation._id,);
    }

    const archiveCallBack = () => {
        archive(consultation._id);
    }

    const bookingContacts = consultation?.contacts
        ? Object.keys(consultation?.contacts).map(contact => {
            return consultation.contacts[contact]
                ? (
                    <div key={contact} className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
                        <span className={"admin__card-data"}>{consultation.contacts[contact]}</span>
                    </div>
                )
                : null;
          })
        : null;

  return (
    <li className={"admin__card"}>
      <div className={"admin__card-actions"}>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content={ !consultation.status
                ? "Mark consultation as contacted"
                : "Mark consultation as not contacted"
            }
            className={"btn btn--icon"}
            disabled={ isStatusChanging?.some(id => id === consultation._id) }
            onClick={() => {changeStatus(consultation._id, consultation.status || false)}}
        >
            { !consultation.status
                ? <PhoneIcon />
                : <PhoneMissedIcon />
            }
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Create client from consultation"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === consultation._id)}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: consultation._id,
                    context: 'Are you sure? You about to turn this consultation into client.',
                    cb: turnBookingToClientCallBack
                });
            }}
        >
            <UsersMedicalIcon />
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Move consultation to archive"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === consultation._id)}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: consultation._id,
                    context: 'Are you sure? You about to archive this consultation.',
                    cb: archiveCallBack
                });
            }}
        >
            <ArchiveIcon />
        </button>
        <button
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Delete consultation"
            className={"btn btn--icon"}
            disabled={isDeletingInProcess?.some(id => id === consultation._id)}
            onClick={() => {
                setConfirmationData({
                    needConfirmation: true,
                    itemId: consultation._id,
                    context: 'Are you sure? You about to delete this consultation FOREVER along with  all the data...',
                    cb: removeCallBack
                });
            }}
        >
            <TrashIcon />
        </button>
      </div>
      <div className={"admin__card-details"}>
        <>
            <div className={"admin__card-detail-item"}>
              <span className={"admin__card-data-type"}>Name:&nbsp;</span>
              <span className={"admin__card-data"}>{consultation.fullName}</span>
            </div>
            <div className={"admin__card-detail-item"}>
                <span className={"admin__card-data-type"}>Created:&nbsp;</span>
                <span className={"admin__card-data"}>
                    {consultation.createdAt?.split('T')[0] + ' (' + consultation.createdAt?.split('T')[1].split('.')[0] + ')'}
                </span>
            </div>
            { bookingContacts }
        </>
      </div>
      {
        consultation.message &&
        <div className={"admin__card-detail-item admin__card-detail-item--message"}>
            <span className={"admin__card-data-type"}>Message:&nbsp;</span>
            <ReadMore id={'message'} text={consultation.message} amountOfWords={6} />
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
      <Tooltip id="my-tooltip" />
    </li>
  );
});

Booking.displayName = 'Booking';
