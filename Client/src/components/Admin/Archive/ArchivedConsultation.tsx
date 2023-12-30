import * as React from "react"
import { NavLink } from "react-router-dom"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import {ContactType, BookedConsultationType} from "../../../types/Types"
import {Tooltip} from "react-tooltip"
import {useState} from "react"
import {ModalPopUp} from "../../common/ModalPopUp"
import {Confirmation} from "../../common/Confirmation"

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

    const [needConfirmation, setNeedConfirmation] = useState<boolean>(false)

    const closeModal = () => {
        setNeedConfirmation(false)
    }

    const deleteConsultationCallBack = () => {
        deleteArchivedConsultation(consultation._id)
        setNeedConfirmation(false)
    }

    const archivedBookingContacts: ContactType = consultation.contacts

    const contacts = Object.keys(archivedBookingContacts).map(contact => {
        return archivedBookingContacts[contact] ?
            <li key={contact}>
                <span>{contact}:&nbsp;</span>
                <span>{archivedBookingContacts[contact]}</span>
            </li> : null
    })

    return (
        <li className="admin__card admin__card--client">
            <div className="client-profile__header">
                <NavLink
                    to={`/admin/profile?clientId=${consultation._id}`}
                    className="admin__card-link client-profile">
                    <div className="client-profile__details">
                        <div className="client-profile__name">
                            <span>Name:&nbsp;</span>
                            <span>{consultation.fullName}</span>
                        </div>
                    </div>
                </NavLink>
                <div className="admin__card-action-btns client-profile__action-btns">
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Restore consultation"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === consultation._id)}
                        onClick={() => reactivateConsultation(consultation._id)}
                    >
                        <svg><use href={`${Sprite}#smile`}/></svg>
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
            </div>
            <div>
                <ul className="list admin__card-contacts-list">
                    { contacts }
                </ul>
            </div>
            {
                needConfirmation &&
                <ModalPopUp
                    modalTitle={''}
                    closeModal={closeModal}
                >
                    <Confirmation
                        content={'Are you sure? You about to delete this client FOREVER along with  all the data and images...'}
                        confirm={deleteConsultationCallBack}
                        cancel={closeModal}
                    />
                </ModalPopUp>
            }
            <Tooltip id="my-tooltip" />
        </li>
    )
})
