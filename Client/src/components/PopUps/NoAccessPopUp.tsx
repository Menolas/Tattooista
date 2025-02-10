import * as React from "react";
import {ModalPopUp} from "./ModalPopUp";

type PropsType = {
    isOpen: boolean;
    closeModal: () => void;
}

export const NoAccessPopUp: React.FC<PropsType> = ({
    isOpen,
    closeModal,
}) => {
    return (
        <ModalPopUp
            isOpen={isOpen}
            closeModal={closeModal}
        >
            <div>
                <img src={'./uploads/noaccess.webp'} alt={''}/>
                <p className={"text-dark"}>No access</p>
            </div>
        </ModalPopUp>
    );
}

NoAccessPopUp.displayName = 'NoAccessPopUp';
