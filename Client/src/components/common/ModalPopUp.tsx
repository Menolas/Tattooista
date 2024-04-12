import * as React from "react";

type PropsType = {
    isOpen: boolean
    modalClasses?: string
    modalTitle?: string
    closeModal: () => void
    children: any
}

export const ModalPopUp: React.FC<PropsType> = React.memo(({
    isOpen,
    modalClasses,
    modalTitle,
    closeModal,
    children
}) => {

    let classNames = `modal-wrap ${modalClasses}`;
    if (isOpen) {
        classNames = `modal-wrap ${modalClasses} open`;
    }

  return (
    <div className={classNames}>
      <div className={'modal-wrap__inner-block'}>
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
  )
});
