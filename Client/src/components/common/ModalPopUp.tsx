import * as React from 'react'

type PropsType = {
    modalTitle?: string
    closeModal: () => void
    children: any
}

export const ModalPopUp: React.FC<PropsType> = React.memo(({
    modalTitle,
    closeModal,
    children
}) => {
  return (
    <div className="modal-wrap">
      <div className="modal-wrap__inner-block">
          { modalTitle &&
              <div className="modal__header">
                  <h2 className="modal__title">{modalTitle}</h2>
                  <button
                      className="close-button modal-wrap__close-btn"
                      onClick={closeModal}
                  >
                  </button>
              </div>
          }
          {children}
      </div>
    </div>
  )
})
