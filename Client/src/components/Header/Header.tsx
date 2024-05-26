import * as React from "react";
import { NavLink } from "react-router-dom";
import { SocialNav } from "../SocialNav";
import { MainNav } from "../MainNav";
import { Logo } from "../Logo";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import {Tooltip} from "react-tooltip";
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";
import {BookingButton} from "../common/BookingButton";
import {useState} from "react";

type PropsType = {
    isAuth: string | null;
    headerClasses: string | null;
    logout: () => void;
}

export const Header: React.FC<PropsType> = ({
  isAuth,
  headerClasses,
  logout,
}) => {

  let [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => {
      setIsMenuOpen(false);
  }

  return (
    <header className = { 'main-header ' + headerClasses }>
      <Logo />
      <MainNav
          isMenuOpen={isMenuOpen}
          isAuth={isAuth}
          logout={logout}
          setIsMenuOpen={setIsMenuOpen}
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
              <svg>
                  <use href={`${Sprite}#phone`}/>
              </svg>
                Call me
            </NavLink>
            { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&

                <NavLink
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Admin page"
                    to={'/admin/bookedConsultations'}
                >
                    <svg>
                        <use href={`${Sprite}#admin`}/>
                    </svg>
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
                        <svg>
                            <use href={`${Sprite}#logout`}/>
                        </svg>
                        Log Out
                    </NavLink>
                  )
                : (
                    <NavLink
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Log in"
                        to={'/login'}
                    >
                        <svg><use href={`${Sprite}#login`}/></svg>
                        Log In
                    </NavLink>
                )
            }
          </nav>
      </div>
      <Tooltip id="my-tooltip" />
    </header>
  );
}
