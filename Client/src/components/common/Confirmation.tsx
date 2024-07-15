import * as React from "react";
import {ModalPopUp} from "./ModalPopUp";
import {useCallback, useEffect, useRef, useState} from "react";

type PropsType = {
    isOpen: boolean;
    content: string;
    confirm: () => void;
    cancel: () => void;
}

export const Confirmation: React.FC<PropsType> = React.memo(({
    isOpen,
    content,
    confirm,
    cancel,
}) => {
    const [focusedButton, setFocusedButton] =
        useState<'confirm' | 'cancel'>('confirm');
    const yesButtonRef = useRef<HTMLButtonElement>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();
                if (focusedButton === 'confirm') {
                    confirm();
                    cancel();
                } else if (focusedButton === 'cancel') {
                    cancel();
                }
            }

            if (event.key === "Tab") {
                event.preventDefault();
                if (document.activeElement === yesButtonRef.current) {
                    noButtonRef.current?.focus();
                    setFocusedButton('cancel');
                } else {
                    yesButtonRef.current?.focus();
                    setFocusedButton('confirm');
                }
            }
        },
        [focusedButton, confirm, cancel]
    );

    useEffect(() => {
        if (isOpen) {
            yesButtonRef.current?.focus();
            setFocusedButton('confirm');
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, handleKeyDown]);

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
                        ref={yesButtonRef}
                        className={`btn ${focusedButton === 'confirm' ? 'btn--dark-bg' : ''}`}
                        onFocus={() => setFocusedButton('confirm')}
                        onClick={() => {
                            confirm();
                            cancel();
                        }}
                    >Yep</button>
                    <button
                        ref={noButtonRef}
                        className={`btn ${focusedButton === 'cancel' ? 'btn--dark-bg' : ''}`}
                        onFocus={() => setFocusedButton('cancel')}
                        onClick={() => {cancel();}}
                    >Nope</button>
                </div>
            </div>
        </ModalPopUp>
    );
});

Confirmation.displayName = 'Confirmation';
