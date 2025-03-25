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

type PropsType = {
    isAuth: null | string;
    isDeletingInProcess: Array<string>;
    data: ReviewType;
    remove: (id: string) => void;
};

export const ReviewItem: React.FC<PropsType> = ({
                                                    isAuth,
                                                    isDeletingInProcess,
                                                    data,
                                                    remove,
}) => {

    const formatted = getDateFormatted(data.createdAt);
    const [carouselData, setCarouselData] = useState<{
        isOpen: boolean, activeIndex?: number}>({isOpen: false});
    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const removeCallBack = () => {
        remove(data._id);
    };

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
        //setApiError();
    };

    return (
        <li className="reviews__item">
            <div className="reviews__item-header">
                <div className="reviews__item-user">
                    {data.user.avatar
                        ? <img src={`${API_URL}/users/${data.user._id}/avatar/${data.user.avatar}`} alt=""/>
                        : <DefaultAvatar/>
                    }
                    <span className="reviews__item-user-name">{data.user.displayName}</span>
                    <span className="reviews__item-user-date">{formatted}</span>
                </div>
                <div className="reviews__rate">
                    {
                        [1, 2, 3, 4, 5].map((num) => {
                            if (num <= data.rate) {
                                return <StarFilled/>
                            } else {
                                return <Star />
                            }
                        })
                    }
                </div>
                {isAuth === SUPER_ADMIN &&
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
                }
            </div>

            <div className="reviews__content">
                {data.content}
            </div>
            {
                data.gallery && data.gallery.length > 0 &&
                <div className={"client-profile__gallery"}>
                    <ul className={"client-profile__gallery-list list"}>
                        {
                            data.gallery.map((item, index) => {
                                return (
                                    <li
                                        key={item}
                                        onClick={() => {
                                            setCarouselData({isOpen: true, activeIndex: index});
                                        }}
                                    >
                                        <img src={`${API_URL}/clients/${data._id}/doneTattooGallery/${item}`} alt={''}/>
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
        </li>
    );
};
