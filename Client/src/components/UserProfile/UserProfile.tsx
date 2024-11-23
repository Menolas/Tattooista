import * as React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DefaultAvatar} from "../common/DefaultAvatar";
import {API_URL} from "../../http";
import {ModalPopUp} from "../common/ModalPopUp";
import {Confirmation} from "../common/Confirmation";
import {Tooltip} from "react-tooltip";
import {ReactComponent as EditIcon} from "../../assets/svg/edit.svg";
import {ReactComponent as TrashIcon} from "../../assets/svg/trash.svg";
import {UserType} from "../../types/Types";
import {UpdateUserForm} from "../Forms/UpdateUserForm";

type PropsType = {
    apiError: null | string;
    data: UserType;
    isDeletingPicturesInProcess: Array<string>;
    remove: () => void;
}

export const UserProfile: React.FC<PropsType> = ({
    apiError,
    data,
    isDeletingPicturesInProcess,
    remove,

}) => {

    const { userId } = useParams();
    const [user, setUser] = useState<UserType | null>(null);
    const [editUserMode, setEditUserMode] = useState<boolean>(false);

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const modalTitle = 'EDIT YOUR PROFILE';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [userId]);

    const closeModal = () => {
        setEditUserMode(false);
        setConfirmationData({needConfirmation: false, context: ''});
        setUser(null);
    }

    if (!data) {
        return <div>Sorry, we can not find such a client in data base</div>
    }

    return (
        <div className={"user-profile container"}>
            <div className="admin__card admin__card--avatar profile">
                <div className="admin__card-actions">
                    <button
                        data-tooltip-id="profile-tooltip"
                        data-tooltip-content="Edit client info"
                        className="btn btn--icon"
                        onClick={() => {
                            setEditUserMode(true);
                        }}
                    >
                        <EditIcon/>
                    </button>
                    <button
                        data-tooltip-id="profile-tooltip"
                        data-tooltip-content="Delete client"
                        className="btn btn--icon"
                        disabled={isDeletingPicturesInProcess?.some(id => id === data._id)}
                        onClick={() => {
                            setConfirmationData({
                                needConfirmation: true,
                                itemId: data._id,
                                context: 'Are you sure? You about to delete this client FOREVER along with all data...',
                                cb: remove
                            });
                        }}
                    >
                        <TrashIcon/>
                    </button>
                </div>
                <div className="admin__card-link">
                    <div className="admin__card-avatar">
                        {!data?.avatar
                            ? <DefaultAvatar/>
                            : <img src={`${API_URL}/users/${data._id}/avatar/${data.avatar}`} alt={data.displayName}/>
                        }
                    </div>
                    <div className="admin__card-details">
                        <div className={"admin__card-detail-item"}>
                            <span className={"admin__card-data-type"}>Name:&nbsp;</span>
                            <span className={"admin__card-data"}>{data.displayName}</span>
                        </div>
                        <div className={"admin__card-detail-item"}>
                            <span className={"admin__card-data-type"}>Email:&nbsp;</span>
                            <span className={"admin__card-data"}>{data.email}</span>
                        </div>
                    </div>
                </div>
                <ModalPopUp
                    isOpen={editUserMode}
                    modalTitle={modalTitle}
                    closeModal={closeModal}
                >
                    {editUserMode &&
                        <UpdateUserForm
                            apiError={apiError}
                            isEditing={editUserMode}
                            data={data}
                            closeModal={closeModal}
                        />
                    }
                </ModalPopUp>
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
                <Tooltip id="profile-tooltip"/>
            </div>
        </div>
    );
};

UserProfile.displayName = 'UserProfile';
