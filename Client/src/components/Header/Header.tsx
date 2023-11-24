import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { SocialNav } from '../SocialNav'
import { MainNav } from '../MainNav'
import { Logo } from '../Logo'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import {Tooltip} from "react-tooltip";

type PropsType = {
    isAuth: boolean
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
      <MainNav/>
      <SocialNav />
      { isAuth
        ? <>
              <NavLink
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Admin page"
                  to="/admin/bookedConsultations"
                  className="main-header__admin-link"
              >
                <svg><use href={`${Sprite}#admin`}/></svg>
              </NavLink>
              <NavLink
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Log out"
                  to="/" className="main-header__admin-link"
                  onClick={() => { logout() }}
              >
                <svg><use href={`${Sprite}#logout`}/></svg>
              </NavLink>
          </>
        : <NavLink
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Log in"
              to="/login"
              className="main-header__admin-link">
              <svg><use href={`${Sprite}#login`}/></svg>
          </NavLink>
      }
      <Tooltip id="my-tooltip" />
    </header>
  );
}
