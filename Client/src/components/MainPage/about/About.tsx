import * as React from "react";
import {useEffect, useState} from "react"
import {PageType} from "../../../types/Types";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import {API_URL} from "../../../http";
import {ModalPopUp} from "../../common/ModalPopUp";
import { UpdateAboutPageForm } from "../../Forms/UpdateAboutPageForm";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../../utils/constants";
import {SocialNav} from "../../SocialNav";
import {BookingButton} from "../../common/BookingButton"
import {ReadMore} from "../../common/ReadMore";
import {Preloader} from "../../common/Preloader";

type PropsType = {
    apiError: null | string;
    isFetching: boolean;
    isEditing: boolean;
    fakeApi: boolean;
    isAuth: string;
    page?: PageType;
    changeVisibility: (isActive: boolean) => void;
    setApiError: () => void;
}

export const About: React.FC<PropsType> = React.memo(({
     apiError,
     isFetching,
     isEditing,
     fakeApi,
     isAuth,
     page,
     changeVisibility,
     setApiError,
}) => {

    const [isEditMode, setIsEditMode] = useState(false);

    const closeEditModal = () => {
        setIsEditMode(false);
        setApiError();
    }

    useEffect(() => {
        if (isEditMode && apiError === null) {
            closeEditModal();
        }
    }, [apiError]);

    const editModalTitle = 'Update "about" block'

    const imgUrl = fakeApi
        ? `url("./uploads/avatars/avatar.jpg")`
        : page?.wallPaper ? `url("${API_URL}/pageWallpapers/${page._id}/${page.wallPaper}")` : `url("./uploads/avatars/avatar.jpg")`

    return (
        <section className="page-block about container" id="about">
            { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                <div className={"actionBar"}>
                    <button
                        data-tooltip-id="about-tooltip"
                        data-tooltip-content={
                            page?.isActive
                            ? 'Hide "about me" block'
                            : 'Show "about me" block'
                        }
                        className={"btn btn--icon"}
                        onClick={() => {
                            changeVisibility(page.isActive);
                        }}
                    >
                        {page?.isActive
                                ? <svg><use href={`${Sprite}#hide`}/></svg>
                                : <svg><use href={`${Sprite}#eye`}/></svg>
                        }
                    </button>
                    <button
                        data-tooltip-id="about-tooltip"
                        data-tooltip-content='Edit "about me" block'
                        disabled={isEditing}
                        className={"btn btn--icon"}
                        onClick={() => setIsEditMode(true)}
                    >
                        <svg><use href={`${Sprite}#edit`}/></svg>
                    </button>
                </div>
            }
            {
                !isFetching
                    ? (
                        <>
                            <h2 className={'page-block__title'}>{page?.title ? page.title : 'Tattoo Artist'}</h2>
                            <div className={'about__layout-wrap'}>
                                <div className={'about__img-wrap-decor'}>
                                    <div
                                        className={'about__img-wrap'}
                                        style={{backgroundImage: imgUrl}}
                                    >{''}</div>
                                </div>
                                <div className={'about__content-wrap'}>
                                    <h3 className={'page-block__title-secondary'}>Facts about me</h3>
                                    <div className={'about__content'}>
                                        {
                                            page?.content &&
                                            <ReadMore id={'text-about'} text={page?.content} amountOfWords={36} />
                                        }
                                    </div>
                                    <div className={'about__add-block'}>
                                        <h3 className={'page-block__title-secondary'}>Follow me</h3>
                                        <SocialNav />
                                        <BookingButton
                                            consentId={"consent2"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                      )
                    : <Preloader />
            }
            <ModalPopUp
                isOpen={isEditMode}
                modalTitle={editModalTitle}
                closeModal={closeEditModal}
            >
                {
                    isEditMode &&
                    <UpdateAboutPageForm
                        apiError={apiError}
                        data={page}
                        closeModal={closeEditModal}
                    />
                }
            </ModalPopUp>
            <Tooltip id="about-tooltip" />
        </section>
    )
})
