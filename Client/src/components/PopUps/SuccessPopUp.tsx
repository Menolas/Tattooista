import * as React from "react";
import {ConfettiContainer} from "../common/Confetti";
import {ModalPopUp} from "./ModalPopUp";
import {useCallback, useEffect} from "react";

type PropsType = {
    isOpen: boolean;
    content?: string;
    closeModal: () => void;
};

export const SuccessPopUp: React.FC<PropsType> = React.memo(({
   isOpen,
   content,
   closeModal,
}) => {

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();
                closeModal();
            }
        }, [closeModal]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, handleKeyDown]);

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
    );
});

SuccessPopUp.displayName = 'SuccessPopUp';
