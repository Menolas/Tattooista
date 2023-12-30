import * as React from "react"

type PropsType = {
    error: string
    closeModal: (value: string) => void
}

export const ApiErrorMessage: React.FC<PropsType> = ({error, closeModal}) => {
    return (
        <div className="modal-wrap apiErrorMessage">
            <div className="modal-wrap__inner-block">
                <div className="modal__header">
                    <button
                        className="close-button modal-wrap__close-btn"
                        onClick={() => {closeModal('')}}
                    >{''}</button>
                </div>
                <p>Sorry, but something went wrong on the server side, please try a bit later</p>
                <p>{error}</p>
            </div>
        </div>
    )
}
