import * as React from "react"
// @ts-ignore
import avatar from "../../../assets/img/fox.webp"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import {RoleType, UserType} from "../../../types/Types"
import { NavLink } from "react-router-dom"
import { API_URL } from "../../../http"
import { Confirmation } from "../../common/Confirmation"
import {useState} from "react";
import {ModalPopUp} from "../../common/ModalPopUp";
import {UpdateUserForm} from "../../Forms/UpdateUserFormFormik";

type PropsType = {
    roles: Array<RoleType>
    user: UserType,
    pageLimit?: number,
    currentPage?: number,
    isDeletingInProcess?: Array<string>
    deleteUser: (userId: string) => void
    updateUser: (id: string, values: FormData) => void
}

export const User: React.FC<PropsType> = ({
  roles,
  user,
  isDeletingInProcess,
  deleteUser,
  updateUser
}) => {

    const [editUserMode, setEditUserMode] = useState<boolean>(false)
    const [needConfirmation, setNeedConfirmation] = useState<boolean>(false)
    const userAvatar = user.avatar ? `${API_URL}/users/${user._id}/avatar/${user.avatar}` : avatar

    const closeModal = () => {
        setNeedConfirmation(false)
    }

    const closeEditModal = () => {
        setEditUserMode(false)
    }

    const modalTitle = 'Edit User'

    const deleteUserCallBack = () => {
        deleteUser(user._id)
    }

    return (
        <li key={user._id} className="admin__card admin__card--avatar admin__card--user">
            <div className="admin__card-actions">
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Edit user"
                    className={"btn btn--icon"}
                    onClick={() => {setEditUserMode(true)}}
                >
                    <svg><use href={`${Sprite}#edit`}/></svg>
                </button>
                <button
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Delete client"
                    className={"btn btn--icon"}
                    disabled={isDeletingInProcess?.some(id => id === user._id)}
                    onClick={() => {
                        setNeedConfirmation(true)
                    }}
                >
                    <svg><use href={`${Sprite}#trash`}/></svg>
                </button>
            </div>
            <NavLink
                to={`/admin/profile?clientId=${user._id}`}
                className="admin__card-link">
                <div className={"admin__card-avatar"}>
                    <img src={userAvatar} alt={""}/>
                </div>
                <div className={"admin__card-details"}>
                    <div className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>Display Name:&nbsp;</span>
                        <span className={"admin__card-data"}>{user.displayName}</span>
                    </div>
                    <div className={"admin__card-detail-item"}>
                        <span className={"admin__card-data-type"}>Email:&nbsp;</span>
                        <span className={"admin__card-data"}>{user.email}</span>
                    </div>
                    <div className="admin__card-detail-item admin__card-roles">
                        <span className={"admin__card-data-type"}>Roles:&nbsp;</span>
                        { user.roles.length > 0
                            ? user.roles.map(role => <span key={role._id}>{role.value}</span>)
                            : <span className={"admin__card-data"}>{''}</span>
                        }
                    </div>
                </div>
            </NavLink>
            <ModalPopUp
                isOpen={needConfirmation}
                modalTitle={''}
                closeModal={closeModal}
            >
                <Confirmation
                    content={'Are you sure? You about to delete this user FOREVER along with  all the data...'}
                    confirm={deleteUserCallBack}
                    cancel={closeModal}
                />
            </ModalPopUp>
            <ModalPopUp
                isOpen={editUserMode}
                modalTitle={modalTitle}
                closeModal={closeEditModal}
            >
                <UpdateUserForm
                    roles={roles}
                    profile={user}
                    updateUser={updateUser}
                    closeModal={closeEditModal}
                />
            </ModalPopUp>
        </li>
    )
}
