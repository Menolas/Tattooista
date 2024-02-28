import * as React from "react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { HashLink } from "react-router-hash-link"
import {ADMIN, mainNavHashLinksData, socialLinksData, SUPER_ADMIN} from "../utils/constants"
// @ts-ignore
import Sprite from "../assets/svg/sprite.svg"

export const MobileMainMenu = ({
    isAuth,
    logout,
    closeMenu
}: {
    isAuth: string
    logout: () => void
    closeMenu: () => void
}) => {

    const hashMobileMenuItems = mainNavHashLinksData.map(item => {
        return (
            <li className={'mobile-main-menu__item'}>
                <HashLink
                    to={item.url}
                    onClick={ closeMenu }
                >
                    {item.text}
                </HashLink>
            </li>
        )
    })

    const socialMobileMenuItems = socialLinksData.map(item => {
        return (
            <li className={'mobile-main-menu__item'}>
                <NavLink
                    to={item.url}
                    target={"_blank"}
                    onClick={ closeMenu }
                >
                    <span><svg><use href={`${Sprite}#${item.icon}`}/></svg></span>
                    {item.text}
                </NavLink>
            </li>
        )
    })

    return (
        <nav className={'mobile-main-menu'}>
            <ul className={'list mobile-main-menu__list'}>
                <li className={'mobile-main-menu__item'}>
                    <NavLink
                        to={`portfolio`}
                        className="main-nav__link"
                        onClick={ closeMenu }
                    >
                        Portfolio
                    </NavLink>
                </li>
                { hashMobileMenuItems }
                { socialMobileMenuItems }
                <li className={'mobile-main-menu__item'}>
                    <NavLink
                        to={'tel:+4745519015'}
                        onClick={ closeMenu }
                    >
                        <svg>
                            <use href={`${Sprite}#phone`}/>
                        </svg>
                        Call me
                    </NavLink>
                </li>
                { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                    <li className={'mobile-main-menu__item'}>
                        <NavLink
                            to={'/admin/bookedConsultations'}
                            onClick={ closeMenu }
                        >
                            <svg>
                                <use href={`${Sprite}#admin`}/>
                            </svg>
                            Admin page
                        </NavLink>
                    </li>
                }
                { isAuth
                    ? (
                        <li className={'mobile-main-menu__item'}>
                            <NavLink
                                to="/"
                                onClick={() => {
                                    closeMenu()
                                    logout()
                                }}
                            >
                                <svg>
                                    <use href={`${Sprite}#logout`}/>
                                </svg>
                                Log out
                            </NavLink>
                        </li>
                    )
                    : (
                        <li className={'mobile-main-menu__item'}>
                            <NavLink
                                to="/login"
                                onClick={ closeMenu }
                            >
                                <svg><use href={`${Sprite}#login`}/></svg>
                                Log in
                            </NavLink>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}
