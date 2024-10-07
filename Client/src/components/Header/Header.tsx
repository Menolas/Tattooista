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
import {useState} from "react";
import {ModalPopUp} from "../common/ModalPopUp";
import {LoginForm} from "../Forms/LoginForm";

type PropsType = {
    isAuth: string | null;
    authApiError: null | string;
    headerClasses: string | null;
    logout: () => void;
    activeStyle: StyleType | null;
}

export const Header: React.FC<PropsType> = React.memo(({
  isAuth,
  authApiError,
  headerClasses,
  logout,
  activeStyle,
}) => {

  const [isLogin, setIsLogin] = useState(false);

  const openLoginModal = () => {
      setIsLogin(true);
  };

  const closeLoginModal = () => {
    setIsLogin(false);
  };

  return (
    <header className = { 'main-header ' + headerClasses }>
      <Logo />
      <MainNav
          isAuth={isAuth}
          logout={logout}
          login={openLoginModal}
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
                    <button
                        className={"btn btn--transparent"}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Log out"
                        onClick={logout}
                    >
                        <LogOutIcon />
                        Log Out
                    </button>
                  )
                : (
                    <button
                        className={"btn btn--transparent"}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Log in"
                        onClick={() => setIsLogin(true)}
                    >
                        <LoginIcon />
                        Log In
                    </button>
                )
            }
          </nav>
      </div>
      <ModalPopUp
          isOpen={isLogin}
          closeModal={closeLoginModal}
      >
          <LoginForm
              authApiError={authApiError}
              closeModal={closeLoginModal}
          />
      </ModalPopUp>
      <Tooltip id="my-tooltip" />
    </header>
  );
});

Header.displayName = 'Header';
