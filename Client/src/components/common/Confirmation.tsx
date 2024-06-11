import * as React from "react";
import {ModalPopUp} from "./ModalPopUp";

type PropsType = {
    isOpen: boolean
    content: string
    confirm: () => void
    cancel: () => void
}

export const Confirmation: React.FC<PropsType> = React.memo(({
    isOpen,
    content,
    confirm,
    cancel
}) => {
    return (
        <ModalPopUp
            isOpen={isOpen}
            modalTitle={''}
            closeModal={cancel}
        >
            <div className={'confirmation'}>
                <p className={'confirmation__text'}>{content}</p>
                <div className={'confirmation__actions'}>
                    <button
                        className={"btn"}
                        onClick={() => {
                            confirm();
                            cancel();
                        }}
                    >Yep</button>
                    <button
                        className={"btn"}
                        onClick={() => {cancel();}}
                    >Nope</button>
                </div>
            </div>
        </ModalPopUp>
    )
});
