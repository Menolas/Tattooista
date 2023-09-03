import * as React from 'react'
import {ConfettiContainer} from './Confetti'

type PropsType = {
    closeModal: (bol: boolean) => void
    content?: string
}

export const SuccessPopUp: React.FC<PropsType> = ({
   closeModal,
   content
}) => {
    return (
        <div
            className="modal-wrap successPopUp"
            onClick={() => {closeModal(false)}}
        >
            <div className="modal-wrap__inner-block">
                <ConfettiContainer />
                <div className="modal__header">
                    <button
                        className="close-button modal-wrap__close-btn"
                        onClick={() => {closeModal(false)}}
                    >{''}</button>
                </div>
                <div className="success">
                    <h1 className={"title--first"}>This is Success!!</h1>
                    <p >{content ? content : 'See you soon!!!'}</p>
                </div>
            </div>
        </div>
)}
