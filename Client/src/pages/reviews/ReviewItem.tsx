import {DefaultAvatar} from "../../components/common/DefaultAvatar";
import * as React from "react";
import {ReactComponent as Star} from "../../assets/svg/star.svg";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {ReviewType} from "../../types/Types";
import {API_URL} from "../../http";
import {getDateFormatted} from "../../utils/functions";
import {ReactComponent as TrashIcon} from "../../assets/svg/trash.svg";
import {SUPER_ADMIN} from "../../utils/constants";
import {useState} from "react";
import {ImageFullView} from "../../components/common/ImageFullView";
import {Confirmation} from "../../components/common/Confirmation";
import {ReactComponent as EditIcon} from "../../assets/svg/edit.svg";
import {UpdateReviewForm} from "../../components/Forms/UpdateReviewForm";
import {ModalPopUp} from "../../components/PopUps/ModalPopUp";

type PropsType = {
    isAuth: null | string;
    isProfile: boolean;
    isDeletingInProcess: Array<string>;
    data: ReviewType;
    apiError: null | string;
    remove: (id: string) => void;
    setReviewApiError: () => void;
};

export const ReviewItem: React.FC<PropsType> = ({
                                                    isAuth,
                                                    isProfile,
                                                    isDeletingInProcess,
                                                    data,
                                                    apiError,
                                                    remove,
                                                    setReviewApiError,
}) => {

    const formatted = getDateFormatted(data.createdAt);
    const modalTitle = "Update your review here";
    const [carouselData, setCarouselData] = useState<{
        isOpen: boolean, activeIndex?: number}>({isOpen: false});
    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const [editReviewMode, setEditReviewMode] = useState<boolean>(false);

    const removeCallBack = () => {
        remove(data._id);
    };

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
        setEditReviewMode(false);
        setReviewApiError();
    };

    return (
        <li key={data._id} className="admin__card review-item">
            <div className="reviews-item__header">
                <div className="review-item__user">
                    {data.user.avatar
                        ? <img src={`${API_URL}/users/${data.user._id}/avatar/${data.user.avatar}`} alt=""/>
                        : <DefaultAvatar/>
                    }
                    <span className="review-item__user-name">{data.user.displayName}</span>
                    <span className="review-item__user-date">{formatted}</span>
                </div>
                { (isAuth === SUPER_ADMIN || isProfile) && (
                        <div className="admin__card-actions">
                            <button
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Edit client"
                                className={"btn btn--icon"}
                                    onClick={() => {
                                        setEditReviewMode(true);
                                        //setData(data);
                                    }}
                            >
                                <EditIcon/>
                            </button>
                            <button
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Delete client"
                                className={"btn btn--icon"}
                                disabled={isDeletingInProcess?.some(id => id === data._id)}
                                onClick={() => {
                                    setConfirmationData({
                                        needConfirmation: true,
                                        itemId: data._id,
                                        context: 'Are you sure? You about to delete this review.',
                                        cb: removeCallBack
                                    });
                                }}
                            >
                                <TrashIcon/>
                            </button>
                        </div>
                    )
                }
            </div>
            <ul className="review-item__rate">
                {
                    [1, 2, 3, 4, 5].map((num, index) => {
                        if (num <= data.rate) {
                            return <li key={index}><StarFilled/></li>
                        } else {
                            return <li key={index}><Star /></li>
                        }
                    })
                }
            </ul>
            <div className="review-item__content">
                {data.content}
            </div>
            {
                data.gallery && data.gallery.length > 0 &&
                <div className={"review-item__gallery"}>
                    <ul className={"review-item__gallery-list list"}>
                        {
                            data.gallery.map((item, index) => {
                                return (
                                    <li
                                        key={item}
                                        onClick={() => {
                                            setCarouselData({isOpen: true, activeIndex: index});
                                        }}
                                    >
                                        <img src={`${API_URL}/reviews/${data._id}/${item}`} alt={''}/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            }
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => {
                    if (confirmationData.cb) {
                        confirmationData.cb();
                    } else {
                        console.error("Item ID is undefined or callback function is not provided.");
                    }
                }}
                cancel={closeModal}
            />
            {carouselData.isOpen &&
                <ImageFullView
                    isOpen={carouselData.isOpen}
                    clientId={data._id}
                    gallery={data.gallery || []}
                    activeIndex={carouselData.activeIndex}
                    closeImg={() => {
                        setCarouselData({isOpen: false});
                    }}
                    imgUrl={`${API_URL}/reviews/${data._id}/`}
                />
            }
            <ModalPopUp
                isOpen={editReviewMode}
                modalTitle={modalTitle}
                closeModal={closeModal}
            >
                <UpdateReviewForm
                    apiError={apiError}
                    review={data}
                    isEditing={editReviewMode}
                    closeModal={closeModal}
                />
            </ModalPopUp>
        </li>
    );
};
