import * as React from "react";
import {useCallback, useEffect, useRef} from "react";

type PropsType = {
    isOpen: boolean;
    modalClasses?: string;
    modalTitle?: string;
    closeModal: () => void;
    children: React.ReactNode;
    lightBg?: boolean;
}

export const ModalPopUp: React.FC<PropsType> = React.memo(({
    isOpen,
    modalClasses,
    modalTitle,
    closeModal,
    children,
    lightBg = true,
}) => {
  const classNames = `modal-wrap ${modalClasses} ${isOpen ? 'open' : ''}`;
  const innerBlockRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
        }
    }, [closeModal]);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = '';
        };
    } else {
        document.body.style.overflow = '';
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
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={classNames}>
      <div className={`modal-wrap__inner-block ${lightBg ? 'light-bg' : 'dark-bg'}`} ref={innerBlockRef}>
          <div className="modal__header">
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
