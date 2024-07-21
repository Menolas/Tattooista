import * as React from "react";
import {useCallback, useEffect, useRef} from "react";

type PropsType = {
    isOpen: boolean;
    modalClasses?: string;
    modalTitle?: string;
    closeModal: () => void;
    children: React.ReactNode;
}

export const ModalPopUp: React.FC<PropsType> = React.memo(({
    isOpen,
    modalClasses,
    modalTitle,
    closeModal,
    children,
}) => {

    const classNames = `modal-wrap ${modalClasses} ${isOpen ? 'open' : ''}`;

    const innerBlockRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
            }
        },
        []
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (innerBlockRef.current && !innerBlockRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeModal]);

    if (!isOpen) {
        return null;
    }

  return (
    <div className={classNames}>
      <div className={'modal-wrap__inner-block'} ref={innerBlockRef}>
          <div className={'modal__header'}>
              <h2 className={'modal__title'}>{modalTitle}</h2>
              <button
                  className={'close-button modal-wrap__close-btn'}
                  onClick={closeModal}
              >
              </button>
          </div>
          {children}
      </div>
    </div>
  );
});

ModalPopUp.displayName = 'ModalPopUp';
