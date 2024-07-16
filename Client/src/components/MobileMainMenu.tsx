import * as React from "react";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import {ADMIN, mainNavHashLinksData, socialLinksData, SUPER_ADMIN} from "../utils/constants";
import {ReactComponent as PhoneIcon} from "../assets/svg/phone.svg";
import {ReactComponent as AdminIcon} from "../assets/svg/admin.svg";
import {ReactComponent as LoginIcon} from "../assets/svg/login.svg";
import {ReactComponent as LogOutIcon} from "../assets/svg/logout.svg";
import {ReactComponent as FaceBookIcon} from "../assets/svg/facebook.svg";
import {ReactComponent as InstagramIcon} from "../assets/svg/instagram.svg";

type PropsType = {
    isAuth: string | null
    logout: () => void
    closeMenu: () => void
}

export const MobileMainMenu: React.FC<PropsType> = React.memo(({
    isAuth,
    logout,
    closeMenu
}) => {

    const hashMobileMenuItems = mainNavHashLinksData.map(item => {
        return (
            <li className={'mobile-main-menu__item'} key={item.url}>
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
            <li className={'mobile-main-menu__item'} key={item.text}>
                <NavLink
                    to={item.url}
                    target={"_blank"}
                    onClick={ closeMenu }
                >
                    {item.icon === "instagram"
                        ? <InstagramIcon />
                        : <FaceBookIcon />
                    }
                    {item.text}
                </NavLink>
            </li>
        )
    })

    return (
        <nav className={'mobile-main-menu'}>
            <ul className={'list mobile-main-menu__list'}>
                <li className={'mobile-main-menu__item'} key={'Portfolio'}>
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
                <li className={'mobile-main-menu__item'} key={'Call me'}>
                    <NavLink
                        to={'tel:+4745519015'}
                        onClick={ closeMenu }
                    >
                        <PhoneIcon />
                        Call me
                    </NavLink>
                </li>
                { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
                    <li className={'mobile-main-menu__item'} key={'/admin/bookedConsultations'}>
                        <NavLink
                            to={'/admin/bookedConsultations'}
                            onClick={ closeMenu }
                        >
                            <AdminIcon />
                            Admin page
                        </NavLink>
                    </li>
                }
                { isAuth
                    ? (
                        <li className={'mobile-main-menu__item'} key={'Log out'}>
                            <NavLink
                                to="/"
                                onClick={() => {
                                    closeMenu();
                                    logout();
                                }}
                            >
                                <LogOutIcon />
                                Log out
                            </NavLink>
                        </li>
                    )
                    : (
                        <li className={'mobile-main-menu__item'} key={'Log in'}>
                            <NavLink
                                to="/login"
                                onClick={ closeMenu }
                            >
                                <LoginIcon />
                                Log in
                            </NavLink>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
});

MobileMainMenu.displayName = 'MobileMainMenu';
