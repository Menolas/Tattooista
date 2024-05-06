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
  pageSize: number;
  currentPage: number;
  isDeletingInProcess?: Array<string>;
  isStatusChanging?: Array<string>;
  changeStatus: (id: string, status: boolean) => void;
  turnBookingToClient: (id: string, fullName: string, contacts: any, pageSize: number, currentPage: number) => void;
  remove: (id: string) => void;
  archive: (id: string) => void;
}

export const Booking: React.FC<PropsType> = React.memo(({
    consultation,
    pageSize,
    currentPage,
    isDeletingInProcess,
    isStatusChanging,
    changeStatus,
    turnBookingToClient,
    remove,
    archive
}) => {

    const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);
    const [needConfirmationBeforeTurnToClient, setNeedConfirmationBeforeTurnToClient] = useState<boolean>(false);
    const [needConfirmationBeforeArchiving, setNeedConfirmationBeforeArchiving] = useState<boolean>(false);

    const closeModal = () => {
        setNeedConfirmation(false);
        setNeedConfirmationBeforeTurnToClient(false);
        setNeedConfirmationBeforeArchiving(false);
    }

    const removeCallBack = () => {
        remove(consultation._id);
        setNeedConfirmation(false);
    }

    const turnBookingToClientCallBack = () => {
        turnBookingToClient(consultation._id, consultation.fullName, consultation.contacts, pageSize, currentPage);
    }

    const archiveCallBack = () => {
        archive(consultation._id);
    }

    const bookingContacts: ContactType = consultation.contacts;

    const contacts = Object.keys(bookingContacts).map(contact => {

        return bookingContacts[contact]
            ? (
                <div key={contact} className={"admin__card-detail-item"}>
                    <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
                    <span className={"admin__card-data"}>{bookingContacts[contact]}</span>
                </div>
               )
            : null;
    })

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
                setNeedConfirmationBeforeTurnToClient(true);
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
                setNeedConfirmationBeforeArchiving(true);
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
                setNeedConfirmation(true);
            }}
        >
            <svg><use href={`${Sprite}#trash`}/></svg>
        </button>
      </div>
      <div className={"admin__card-details"}>
        <div className={"admin__card-detail-item"}>
          <span className={"admin__card-data-type"}>Name:&nbsp;</span>
          <span className={"admin__card-data"}>{consultation.fullName}</span>
        </div>
        <div className={"admin__card-detail-item"}>
            <span className={"admin__card-data-type"}>Created:&nbsp;</span>
            <span className={"admin__card-data"}>
                {consultation.createdAt.split('T')[0] + ' (' + consultation.createdAt.split('T')[1].split('.')[0] + ')'}
            </span>
        </div>
        { contacts }
      </div>
        {
            consultation.message &&
            <div className={"admin__card-detail-item admin__card-detail-item--message"}>
                <span className={"admin__card-data-type"}>Message:&nbsp;</span>
                <ReadMore id={'message'} text={consultation.message} amountOfWords={6} />
            </div>
        }
        <ModalPopUp
            isOpen={needConfirmation || needConfirmationBeforeTurnToClient || needConfirmationBeforeArchiving}
            modalTitle={''}
            closeModal={closeModal}
        >
            { needConfirmation &&
                <Confirmation
                    content={'Are you sure? You about to delete this consultation FOREVER along with  all the data...'}
                    confirm={removeCallBack}
                    cancel={closeModal}
                />
            }
            { needConfirmationBeforeTurnToClient &&
                <Confirmation
                    content={'Are you sure? You about to turn this consultation into client.'}
                    confirm={turnBookingToClientCallBack}
                    cancel={closeModal}
                />
            }
            { needConfirmationBeforeArchiving &&
                <Confirmation
                    content={'Are you sure? You about to archive this consultation.'}
                    confirm={archiveCallBack}
                    cancel={closeModal}
                />
            }

        </ModalPopUp>
      <Tooltip id="my-tooltip" />
    </li>
  )
})
