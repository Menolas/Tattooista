import * as React from "react";
import {ModalPopUp} from "./ModalPopUp";
import {useEffect, useRef, useState} from "react";

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
    const [focusedButton, setFocusedButton] = useState<'confirm' | 'cancel' | null>(null);
    const yesButtonRef = useRef<HTMLButtonElement>(null);
    const noButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            yesButtonRef.current?.focus();
            setFocusedButton('confirm');
            const handleTabPress = (event: KeyboardEvent) => {
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
            };
            document.addEventListener("keydown", handleTabPress);
            return () => {
                document.removeEventListener("keydown", handleTabPress);
            };
        }
    }, [isOpen]); // Depend on isOpen to add/remove the event listener

    useEffect(() => {
        if (isOpen) {
            yesButtonRef.current?.focus();
            setFocusedButton('confirm');
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default form submission behavior
                if (focusedButton === 'confirm') {
                    confirm();
                } else if (focusedButton === 'cancel') {
                    cancel();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, confirm, cancel]);

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
                        onBlur={() => setFocusedButton(null)}
                        onClick={() => {
                            confirm();
                            cancel();
                        }}
                    >Yep</button>
                    <button
                        ref={noButtonRef}
                        className={`btn ${focusedButton === 'cancel' ? 'btn--dark-bg' : ''}`}
                        onFocus={() => setFocusedButton('cancel')}
                        onBlur={() => setFocusedButton(null)}
                        onClick={() => {cancel();}}
                    >Nope</button>
                </div>
            </div>
        </ModalPopUp>
    );
});
