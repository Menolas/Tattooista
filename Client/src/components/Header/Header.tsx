import * as React from "react"
import { NavLink } from "react-router-dom"
import { SocialNav } from "../SocialNav"
import { MainNav } from "../MainNav"
import { Logo } from "../Logo"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import {Tooltip} from "react-tooltip"
import {ADMIN, SUPER_ADMIN} from "../../utils/constants";

type PropsType = {
    isAuth: string | null
    headerClasses: string | null
    logout: () => void
}

export const Header: React.FC<PropsType> = ({
  isAuth,
  headerClasses,
  logout
}) => {

  return (
    <header className = { 'main-header container ' + headerClasses }>
      <Logo />
      <MainNav
          isAuth={isAuth}
          logout={logout}
      />
      <SocialNav />
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
                to={'/admin'}
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
      <Tooltip id="my-tooltip" />
    </header>
  );
}
