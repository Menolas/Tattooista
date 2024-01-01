import * as React from "react"
// @ts-ignore
import Sprite from "../assets/svg/sprite.svg"
import { ADMIN_BUTTONS_DATA } from "../utils/constants"
import {NavLink} from "react-router-dom"
import {useState} from "react"

export const AdminPanelMobileMenu = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const adminButtons = ADMIN_BUTTONS_DATA.map((btn, i ) => {

        return (
            <NavLink
                key={i}
                to={btn.btnUrl}
                className={'btn btn--bg btn--dark-bg'}
                onClick={() => {setIsMobileMenuOpen(false)}}
            >
                {btn.btnText}
            </NavLink>
        )
    })

    return (
        <div
            className={isMobileMenuOpen ? "admin-panel-mobile show" : "admin-panel-mobile"}
        >
            <button
                className={"btn btn--bg btn--light-bg admin-panel-mobile__initiate-btn"}
                onClick={() => {setIsMobileMenuOpen(!isMobileMenuOpen)}}
            >
                Admin Panel
                <svg><use href={`${Sprite}#chevron-down`}/></svg>
            </button>
            <div
                className={'admin-panel-mobile__dropdown'}
            >
                <ul className={"list admin-panel-mobile__dropdown-list"}>
                    {adminButtons}
                </ul>
            </div>
        </div>
    )
}
