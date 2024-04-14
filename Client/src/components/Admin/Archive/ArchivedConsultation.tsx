import * as React from "react";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {ContactType, BookedConsultationType} from "../../../types/Types";
import {Tooltip} from "react-tooltip";
import {useState} from "react";
import {ModalPopUp} from "../../common/ModalPopUp";
import {Confirmation} from "../../common/Confirmation";

type PropsType = {
    consultation: BookedConsultationType
    isDeletingInProcess: Array<string>
    deleteArchivedConsultation: (id: string) => void
    reactivateConsultation: (id: string) => void
}

export const ArchivedConsultation: React.FC<PropsType> = React.memo(({
   consultation,
   deleteArchivedConsultation,
   reactivateConsultation,
   isDeletingInProcess
}) => {

    const [needConfirmation, setNeedConfirmation] = useState<boolean>(false);
    const [needRestoreConfirmation, setNeedRestoreConfirmation] = useState<boolean>(false);

    const closeModal = () => {
        setNeedConfirmation(false);
        setNeedRestoreConfirmation(false);
    }

    const deleteConsultationCallBack = () => {
        deleteArchivedConsultation(consultation._id);
        setNeedConfirmation(false);
    }

    const reactivateConsultationCallBack = () => {
        reactivateConsultation(consultation._id);
        setNeedRestoreConfirmation(false);
    }

    const archivedBookingContacts: ContactType = consultation.contacts

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
                    disabled={isDeletingInProcess?.some(id => id === consultation._id)}
                    onClick={() => {
                        setNeedRestoreConfirmation(true);
                    }}
                >
                    <svg><use href={`${Sprite}#arrow-rotate-left`}/></svg>
                </button>

                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Delete consultation"
                    className={"btn btn--icon"}
                    disabled={isDeletingInProcess?.some(id => id === consultation._id)}
                    onClick={() => {
                        setNeedConfirmation(true)
                    }}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
            <div className="admin__card-details">
                <div className={"admin__card-detail-item"}>
                    <span className={"admin__card-data-type"}>Name:&nbsp;</span>
                    <span className={"admin__card-data"}>{consultation.fullName}</span>
                </div>
                { contacts }
            </div>
            <ModalPopUp
                isOpen={needConfirmation || needRestoreConfirmation}
                modalTitle={''}
                closeModal={closeModal}
            >
                {  needConfirmation &&
                    <Confirmation
                        content={'Are you sure? You about to delete this consultation FOREVER along with  all the data...'}
                        confirm={deleteConsultationCallBack}
                        cancel={closeModal}
                    />
                }
                {  needRestoreConfirmation &&
                    <Confirmation
                        content={'Are you sure? You about to restore this consultation.'}
                        confirm={reactivateConsultationCallBack}
                        cancel={closeModal}
                    />
                }

            </ModalPopUp>
            <Tooltip id="my-tooltip" />
        </li>
    )
});
