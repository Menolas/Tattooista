import * as React from "react"
// @ts-ignore
import avatar from "../../../assets/img/fox.webp"
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import { UserType } from "../../../types/Types"
import { NavLink } from "react-router-dom"
import { API_URL } from "../../../http"

type PropsType = {
    user: UserType,
    pageLimit?: number,
    currentPage?: number,
    isDeletingInProcess?: Array<string>
}

export const User: React.FC<PropsType> = ({
  user,
  pageLimit,
  currentPage,
  isDeletingInProcess
}) => {

    const userAvatar = user.avatar ? `${API_URL}/users/${user._id}/avatar/${user.avatar}` : avatar

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
                            { user.roles.map(role => {
                                return <span key={role}>{role}</span>
                            })}
                        </div>
                    </div>
                </NavLink>
                <div className="client-profile__action-btns admin__card-action-btns">
                    {/*<button*/}
                    {/*    data-tooltip-id="my-tooltip"*/}
                    {/*    data-tooltip-content="Edit client"*/}
                    {/*    className={"btn btn--icon"}*/}
                    {/*    //onClick={() => {setEditClientMode(true)}}*/}
                    {/*>*/}
                    {/*    <svg><use href={`${Sprite}#edit`}/></svg>*/}
                    {/*</button>*/}
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete client"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === user._id)}
                        onClick={() => {
                            //setNeedConfirmation(true)
                        }}
                    >
                        <svg><use href={`${Sprite}#trash`}/></svg>
                    </button>
                </div>
            </div>
        </li>
    )
}
