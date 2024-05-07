import * as React from "react";
// @ts-ignore
import avatar from "../../../assets/img/fox.webp";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg";
import { UserType } from "../../../types/Types";
import { NavLink } from "react-router-dom";
import { API_URL } from "../../../http";
import { Confirmation } from "../../common/Confirmation";
import {useState} from "react";
import { ModalPopUp } from "../../common/ModalPopUp";

type PropsType = {
    data: UserType;
    isDeletingInProcess?: Array<string>;
    remove: (userId: string) => void;
    setEditMode: (mode: boolean) => void;
    setData: (user: UserType) => void;
}

export const User: React.FC<PropsType> = ({
  data,
  isDeletingInProcess,
  remove,
  setEditMode,
  setData,
}) => {

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});
    const userAvatar = data.avatar ? `${API_URL}/users/${data._id}/avatar/${data.avatar}` : avatar;

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const deleteUserCallBack = () => {
        remove(data._id);
    }

    return (
        <li key={data._id} className="admin__card admin__card--avatar admin__card--user">
            <div className="admin__card-actions">
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Edit user"
                    className={"btn btn--icon"}
                    onClick={() => {
                        setEditMode(true);
                        setData(data);
                    }}
                >
                    <svg><use href={`${Sprite}#edit`}/></svg>
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
                            context: 'Are you sure? You about to delete this user FOREVER along with  all the data...',
                            cb: deleteUserCallBack
                        });
                    }}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
            <NavLink
                to={`/admin/profile?clientId=${data._id}`}
                className="admin__card-link">
                <div className={"admin__card-avatar"}>
                    <img src={userAvatar} alt={""}/>
                </div>
                <div className={"admin__card-details"}>
                    <div className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>Display Name:&nbsp;</span>
                        <span className={"admin__card-data"}>{data.displayName}</span>
                    </div>
                    <div className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>Email:&nbsp;</span>
                        <span className={"admin__card-data"}>{data.email}</span>
                    </div>
                    <div className="admin__card-detail-item admin__card-roles">
                        <span className={"admin__card-data-type"}>Roles:&nbsp;</span>
                        { data.roles.length > 0
                            ? data.roles.map(role => <span key={role._id}>{role.value}</span>)
                            : <span className={"admin__card-data"}>{''}</span>
                        }
                    </div>
                </div>
            </NavLink>
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => confirmationData.cb()}
                cancel={closeModal}
            />
        </li>
    )
}
