import * as React from 'react'
import {useState} from 'react'
import {PageType} from '../../types/Types'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import {SERVER_URL} from '../../utils/constants'
import {ModalPopUp} from "../common/ModalPopUp";
import { UpdateAboutPageFormFormik } from '../Forms/UpdateAboutPageFormFormik'
import {SuccessModal} from "../SuccessModal";

type PropsType = {
    isAuth: boolean
    pageAbout?: PageType
    editAboutPage: (id: string, values: FormData) => void
    changePageVisibility: (pageId: string, isActive: boolean) => void
}

export const About: React.FC<PropsType> = React.memo(({
     isAuth,
     pageAbout,
     editAboutPage,
     changePageVisibility
}) => {

    const [isEditMode, setIsEditMode] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const showSuccessModal = () => {
        setSuccess(true)
    }

    const closeSuccessModal = () => {
        setSuccess(false)
    }
    const closeEditModal = () => {
        setIsEditMode(false)
    }

    const modalTitle = ''
    const editModalTitle = 'Update "about" block'

    const imgUrl = pageAbout?.wallPaper ? `url("${SERVER_URL}/pageWallpapers/${pageAbout._id}/${pageAbout.wallPaper}")` : `url("../avatar.jpg")`

    return (
         ( pageAbout?.isActive) &&
            <section className="page-block about">
                { isAuth &&
                    <div className={"actionBar"}>
                        <button
                            className={"btn btn--icon"}
                            onClick={() => {
                                changePageVisibility(pageAbout._id, pageAbout.isActive)
                            }}
                        >
                            {pageAbout.isActive
                                    ? <svg><use href={`${Sprite}#hide`}/></svg>
                                    : <svg><use href={`${Sprite}#eye`}/></svg>
                            }
                        </button>
                        <button
                            className={"btn btn--icon"}
                            onClick={() => setIsEditMode(true)}
                        >
                            <svg><use href={`${Sprite}#edit`}/></svg>
                        </button>
                    </div>
                }
                <h2 className="page-block__title">{pageAbout?.title ? pageAbout.title : 'Tattoo Artist'}</h2>
                <div className="about__img-wrap-decor">
                    <div
                        className="about__img-wrap"
                        style={{backgroundImage: imgUrl}}
                    >{''}</div>
                </div>
                <div className={"about__content"}>{pageAbout?.content}</div>
                { isEditMode &&
                    <ModalPopUp
                        modalTitle={editModalTitle}
                        closeModal={closeEditModal}
                    >
                        <UpdateAboutPageFormFormik
                            pageAbout={pageAbout}
                            editAboutPage={editAboutPage}
                            showSuccessModal={showSuccessModal}
                            closeModal={closeEditModal}
                        />
                    </ModalPopUp>
                }
                { isSuccess &&
                    <ModalPopUp
                        modalTitle={modalTitle}
                        closeModal={closeSuccessModal}
                    >
                        <SuccessModal/>
                    </ModalPopUp>
                }
            </section>
    )
})
