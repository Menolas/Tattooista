import * as React from "react";
import { NavLink } from "react-router-dom";
import { SocialNav } from "../SocialNav";
import { MainNav } from "../MainNav";
import { Logo } from "../Logo";
import {ReactComponent as PhoneIcon} from "../../assets/svg/phone.svg";
import {ReactComponent as AdminIcon} from "../../assets/svg/admin.svg";
import {ReactComponent as LoginIcon} from "../../assets/svg/login.svg";
import {ReactComponent as LogOutIcon} from "../../assets/svg/logout.svg";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {BookingButton} from "../common/BookingButton";
import {StyleType} from "../../types/Types";

type PropsType = {
    isAuth: string | null;
    headerClasses: string | null;
    logout: () => void;
    activeStyle: StyleType | null;
}

export const Header: React.FC<PropsType> = React.memo(({
  isAuth,
  headerClasses,
  logout,
  activeStyle,
}) => {

  return (
    <header className = { 'main-header ' + headerClasses }>
      <Logo />
      <MainNav
          isAuth={isAuth}
          logout={logout}
          activeStyle={activeStyle}
      />
      <SocialNav />
      <div className={'main-header__right'}>
          {
              (headerClasses === 'main-header--portfolio') &&
                  <BookingButton
                      consentId={"consentAdvertisementHeader"}
                  />
          }
          <nav className={'admin-nav'}>
            <NavLink
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Call me"
              to={'tel:+4745519015'}
            >
              <PhoneIcon />
                Call me
            </NavLink>
            { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&

                <NavLink
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Admin page"
                    to={'/admin/bookedConsultations'}
                >
                    <AdminIcon />
                    Admin
                </NavLink>
            }
            { isAuth
                ? (
                    <NavLink
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Log out"
                        to={'/'}
                        onClick={logout}
                    >
                        <LogOutIcon />
                        Log Out
                    </NavLink>
                  )
                : (
                    <NavLink
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Log in"
                        to={'/login'}
                    >
                        <LoginIcon />
                        Log In
                    </NavLink>
                )
            }
          </nav>
      </div>
      <Tooltip id="my-tooltip" />
    </header>
  );
});

Header.displayName = 'Header';
