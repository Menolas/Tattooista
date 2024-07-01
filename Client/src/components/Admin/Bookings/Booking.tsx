import * as React from "react";
import {ContactType, BookingType} from "../../../types/Types";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {Tooltip} from "react-tooltip";
import {useState} from "react";
import {ModalPopUp} from "../../common/ModalPopUp";
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
            onClick={() => {changeStatus(consultation._id, consultation.status)}}
        >
            { !consultation.status
                ? <svg><use href={`${Sprite}#phone`}/></svg>
                : <svg><use href={`${Sprite}#phone-missed`}/></svg>
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
            <svg><use href={`${Sprite}#users-medical`}/></svg>
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
            <svg><use href={`${Sprite}#archive`}/></svg>
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
            <svg><use href={`${Sprite}#trash`}/></svg>
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
        confirm={() => confirmationData.cb()}
        cancel={closeModal}
      />
      <Tooltip id="my-tooltip" />
    </li>
  )
})
