import * as React from "react"
import { useState } from "react"
import {ServiceType} from "../../types/Types"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import {ModalPopUp} from "../common/ModalPopUp"
import {SuccessModal} from "../SuccessModal"
import {UpdateServiceItemFormFormik} from "../Forms/UpdateServiceItemFormFormik"
import {API_URL} from "../../http"
import {Tooltip} from "react-tooltip"

type PropsType = {
    isAuth: boolean
    service: ServiceType
    editService: (id: string, values: FormData) => void
    deleteService: (id: string) => void
}

export const ServiceItem: React.FC<PropsType> = React.memo(({
    isAuth,
    service,
    editService,
    deleteService
}) => {

    const [isEditMode, setIsEditMode] = useState(false)
    const [isSuccess, setSuccess] = useState(false)

    const closeSuccessModal = () => {
        setSuccess(false)
    }
    const closeEditModal = () => {
        setIsEditMode(false)
    }

    const modalTitle = ''
    const editModalTitle = 'Update "Services" block'

    const conditions = service.conditions.map((item, i) => {
      return <li key = { i }>{item}</li>
    })

    return (
        <li className="services__item">
            <article className="services__article">
                {isAuth &&
                    <div className={"actionBar"}>
                        <button
                            data-tooltip-id="service-tooltip"
                            data-tooltip-content="Edit service item"
                            className={"btn btn--icon"}
                            onClick={() => {setIsEditMode(true)}}
                        >
                            <svg><use href={`${Sprite}#edit`}/></svg>
                        </button>
                        <button
                            data-tooltip-id="service-tooltip"
                            data-tooltip-content="Delete service item"
                            className={"btn btn--icon"}
                            onClick={() => {deleteService(service._id)}}
                        >
                            <svg><use href={`${Sprite}#trash`}/></svg>
                        </button>
                    </div>
                }
                <div
                    className="services__article-img-wrap"
                    style={{ backgroundImage: service.wallPaper ? `url(${API_URL}/serviceWallpapers/${service._id}/${service.wallPaper})` : ''}}
                >{''}</div>
                <div className="services__article-text-block">
                    <h4>{service.title}:</h4>
                    <ul className="services__item-list">
                        {conditions}
                    </ul>
                </div>
            </article>
            {
                isEditMode &&
                <ModalPopUp
                    modalTitle={editModalTitle}
                    closeModal={closeEditModal}
                >
                    <UpdateServiceItemFormFormik
                        service={service}
                        editService={editService}
                        //showSuccessModal={showSuccessModal}
                        closeModal={closeEditModal}
                    />
                </ModalPopUp>
            }
            {
                isSuccess &&
                <ModalPopUp
                    modalTitle={modalTitle}
                    closeModal={closeSuccessModal}
                >
                    <SuccessModal />
                </ModalPopUp>
            }
            <Tooltip id="service-tooltip" />
        </li>
    )
})
