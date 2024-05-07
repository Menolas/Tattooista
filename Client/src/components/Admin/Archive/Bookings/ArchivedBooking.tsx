import * as React from "react";
// @ts-ignore
import Sprite from "../../../../assets/svg/sprite.svg";
import {ContactType, BookingType} from "../../../../types/Types";
import {Tooltip} from "react-tooltip";
import {useState} from "react";
import {ModalPopUp} from "../../../common/ModalPopUp";
import {Confirmation} from "../../../common/Confirmation";

type PropsType = {
    data: BookingType;
    isDeletingInProcess: Array<string>;
    remove: (id: string) => void;
    reactivate: (id: string) => void;
}

export const ArchivedBooking: React.FC<PropsType> = React.memo(({
   data,
   remove,
   reactivate,
   isDeletingInProcess
}) => {

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: (itemId: string) => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const deleteConsultationCallBack = () => {
        remove(data._id);
    }

    const reactivateConsultationCallBack = () => {
        reactivate(data._id);
    }

    const archivedBookingContacts: ContactType = data.contacts

    const contacts = Object.keys(archivedBookingContacts).map(contact => {
        return archivedBookingContacts[contact] ?
            <div key={contact} className={"admin__card-detail-item"}>
                <span className={"admin__card-data-type"}>{contact}:&nbsp;</span>
                <span className={"admin__card-data"}>{archivedBookingContacts[contact]}</span>
            </div> : null
    });

    return (
        <li className="admin__card">
            <div className="admin__card-actions">
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Restore consultation"
                    className={"btn btn--icon"}
                    disabled={isDeletingInProcess?.some(id => id === data._id)}
                    onClick={() => {
                        setConfirmationData({
                            needConfirmation: true,
                            itemId: data._id,
                            context: 'Are you sure? You about to restore this consultation.',
                            cb: reactivateConsultationCallBack
                        });
                    }}
                >
                    <svg><use href={`${Sprite}#arrow-rotate-left`}/></svg>
                </button>

                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Delete consultation"
                    className={"btn btn--icon"}
                    disabled={isDeletingInProcess?.some(id => id === data._id)}
                    onClick={() => {
                        setConfirmationData({
                            needConfirmation: true,
                            itemId: data._id,
                            context: 'Are you sure? You about to delete this consultation FOREVER along with  all the data...',
                            cb: deleteConsultationCallBack
                        });
                    }}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
            <div className="admin__card-details">
                <div className={"admin__card-detail-item"}>
                    <span className={"admin__card-data-type"}>Name:&nbsp;</span>
                    <span className={"admin__card-data"}>{data.fullName}</span>
                </div>
                { contacts }
            </div>
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => confirmationData.cb(confirmationData.itemId)}
                cancel={closeModal}
            />
            <Tooltip id="my-tooltip" />
        </li>
    )
});
