import * as React from "react"
import {useState} from "react"
import {PageType} from "../../types/Types"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import {API_URL} from "../../http"
import {ModalPopUp} from "../common/ModalPopUp"
import { UpdateAboutPageFormFormik } from "../Forms/UpdateAboutPageFormFormik"
import {Tooltip} from "react-tooltip"

type PropsType = {
    fakeApi: boolean
    isAuth: boolean
    pageAbout?: PageType
    editAboutPage: (values: FormData) => void
    changeAboutPageVisibility: (isActive: boolean) => void
}

export const About: React.FC<PropsType> = React.memo(({
     fakeApi,
     isAuth,
     pageAbout,
     editAboutPage,
     changeAboutPageVisibility
}) => {

    const [isEditMode, setIsEditMode] = useState(false)

    const closeEditModal = () => {
        setIsEditMode(false)
    }

    const editModalTitle = 'Update "about" block'

    const imgUrl = fakeApi
        ? `url("./uploads/avatars/avatar.jpg")`
        : pageAbout?.wallPaper ? `url("${API_URL}/pageWallpapers/${pageAbout._id}/${pageAbout.wallPaper}")` : `url("./uploads/avatars/avatar.jpg")`

    return (
        <section className="page-block about">
            { isAuth &&
                <div className={"actionBar"}>
                    <button
                        data-tooltip-id="about-tooltip"
                        data-tooltip-content={
                            pageAbout.isActive
                            ? 'Hide "about me" block'
                            : 'Show "about me" block'
                        }
                        className={"btn btn--icon"}
                        onClick={() => {
                            changeAboutPageVisibility(pageAbout.isActive)
                        }}
                    >
                        {pageAbout.isActive
                                ? <svg><use href={`${Sprite}#hide`}/></svg>
                                : <svg><use href={`${Sprite}#eye`}/></svg>
                        }
                    </button>
                    <button
                        data-tooltip-id="about-tooltip"
                        data-tooltip-content='Edit "about me" block'
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
                        closeModal={closeEditModal}
                    />
                </ModalPopUp>
            }
            <Tooltip id="about-tooltip" />
        </section>
    )
})
