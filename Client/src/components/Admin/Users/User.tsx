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
        <li key={user._id} className="admin__card admin__card--user">
            <div className="client-profile__header">
                <NavLink
                    to={`/admin/profile?clientId=${user._id}`}
                    className="admin__card-link">
                    <div className="admin__card-avatar">
                        <img src={userAvatar} alt={""}/>
                    </div>
                    <div className="admin__card-details">
                        <div className="client-profile__name">
                            <span>Display Name:&nbsp;</span>
                            <span>{user.displayName}</span>
                        </div>
                        <div className="client-profile__email">
                            <span>Email:&nbsp;</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="admin__card-roles">
                            <span>roles:&nbsp;</span>
                            { user.roles.length > 0
                                ? user.roles.map(role => <span key={role}>{role}</span>)
                                : <span>{''}</span>
                            }
                        </div>
                    </div>
                </NavLink>
                <div className="client-profile__action-btns admin__card-action-btns">
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
            </div>
            {
                needConfirmation &&
                <ModalPopUp
                    modalTitle={''}
                    closeModal={closeModal}
                >
                    <Confirmation
                        content={'Are you sure? You about to delete this user FOREVER along with  all the data...'}
                        confirm={deleteUserCallBack}
                        cancel={closeModal}
                    />
                </ModalPopUp>
            }

            { editUserMode &&
                <ModalPopUp
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
            }
        </li>
    )
}
