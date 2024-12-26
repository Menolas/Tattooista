import * as React from "react";
import {ReactComponent as EditIcon} from "../../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../../assets/svg/trash.svg";
import { UserType } from "../../../types/Types";
import { API_URL } from "../../../http";
import { Confirmation } from "../../common/Confirmation";
import {useState} from "react";
import {DefaultAvatar} from "../../common/DefaultAvatar";

type PropsType = {
    data: UserType;
    isDeletingInProcess: Array<string>;
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

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const deleteUserCallBack = () => {
        if (data) remove(data._id);
    }

    const userRolesElements = data?.roles?.map(role => <span key={role._id}>{role.value}</span>);

    return (
        <li key={data?._id} className="admin__card admin__card--avatar admin__card--user">
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
                    <EditIcon/>
                </button>
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Delete client"
                    className={"btn btn--icon"}
                    disabled={isDeletingInProcess?.some(id => id === data?._id)}
                    onClick={() => {
                        setConfirmationData({
                            needConfirmation: true,
                            itemId: data?._id,
                            context: 'Are you sure? You about to delete this user FOREVER along with  all the data...',
                            cb: deleteUserCallBack
                        });
                    }}
                >
                    <TrashIcon/>
                </button>
            </div>
            <div
                className="admin__card-link">
                <div className={"admin__card-avatar"}>
                    {!data?.avatar
                        ? <DefaultAvatar/>
                        : <img src={`${API_URL}/users/${data._id}/avatar/${data.avatar}`} alt="preview"/>
                    }
                </div>
                <div className={"admin__card-details"}>
                    <div className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>Display Name:&nbsp;</span>
                        <span className={"admin__card-data"}>{data?.displayName}</span>
                    </div>
                    <div className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>Email:&nbsp;</span>
                        <span className={"admin__card-data"}>{data?.email}</span>
                    </div>
                    <div className="admin__card-detail-item admin__card-roles">
                        <span className={"admin__card-data-type"}>Roles:&nbsp;</span>
                        { userRolesElements}
                    </div>
                </div>
            </div>
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
        </li>
    )
}
