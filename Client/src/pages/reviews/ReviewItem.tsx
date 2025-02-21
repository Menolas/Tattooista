import {DefaultAvatar} from "../../components/common/DefaultAvatar";
import * as React from "react";
import {ReactComponent as Star} from "../../../assets/svg/star.svg";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {ReviewType} from "../../types/Types";
import {API_URL} from "../../http";

type PropsType = {
    data: ReviewType;
}

export const ReviewItem: React.FC<PropsType> = ({data}) => {
    return (
        <li className="reviews__item">
            <div className="reviews__item-header">
                <div className="reviews__item-user">
                    {data.user.avatar
                        ? <img src={`${API_URL}/users/${data.user._id}/avatar/${data.user.avatar}`} alt=""/>
                        : <DefaultAvatar/>
                    }
                    <span className="reviews__item-user-name">{data.user.displayName}</span>
                    <span className="reviews__item-user-date">{data.createdAt?.split('T')[0] + ' (' + data.createdAt?.split('T')[1].split('.')[0] + ')'}</span>
                </div>
                <div className="reviews__rate">
                    <StarFilled/>
                    <StarFilled/>
                    <StarFilled/>
                    <StarFilled/>
                    <StarFilled/>
                </div>
            </div>

            <div className="reviews__content">
                {data.content}
            </div>
        </li>
    )
}
