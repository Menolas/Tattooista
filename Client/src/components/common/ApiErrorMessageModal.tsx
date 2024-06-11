import * as React from "react";
import {ModalPopUp} from "./ModalPopUp";

type PropsType = {
    isOpen: boolean;
    error: string;
    closeModal: () => void;
}

export const ApiErrorMessageModal: React.FC<PropsType> = React.memo(({
  isOpen,
  error,
  closeModal,
}) => {
    return (
        <ModalPopUp isOpen={isOpen} closeModal={closeModal} modalClasses={"apiErrorMessage"}>
            <p>Sorry, but something went wrong on the server side, please try with another data or a bit later</p>
            <p>{error}</p>
        </ModalPopUp>
    )
});
