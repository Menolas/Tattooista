import * as React from "react";
import {ConfettiContainer} from "./Confetti";
import {ModalPopUp} from "./ModalPopUp";

type PropsType = {
    isOpen: boolean
    content?: string
    closeModal: () => void
};

export const SuccessPopUp: React.FC<PropsType> = ({
   isOpen,
   content,
   closeModal
}) => {
    return (
        <ModalPopUp isOpen={isOpen} closeModal={closeModal}>
            <ConfettiContainer />
            { isOpen &&
                <div className="success">
                    <h1 className={"title--first"}>This is Success!!</h1>
                    <p >{content ? content : 'See you soon!!!'}</p>
                </div>
            }

        </ModalPopUp>
    )
};
