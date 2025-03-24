import {DefaultAvatar} from "../../components/common/DefaultAvatar";
import * as React from "react";
import {ReactComponent as Star} from "../../assets/svg/star.svg";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {ReviewType} from "../../types/Types";
import {API_URL} from "../../http";
import {getDateFormatted} from "../../utils/functions";

type PropsType = {
    data: ReviewType;
};

export const ReviewItem: React.FC<PropsType> = ({data}) => {
    const formatted = getDateFormatted(data.createdAt);
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
            </div>

            <div className="reviews__content">
                {data.content}
            </div>
        </li>
    );
};
