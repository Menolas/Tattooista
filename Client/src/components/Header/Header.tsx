import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { SocialNav } from '../SocialNav'
import { MainNav } from '../MainNav'
import { Logo } from '../Logo'
import Sprite from '../../assets/svg/sprite.svg'

type PropsType = {
    isAuth: boolean
    userId: string | null
    activeStyleValue: string
    headerClasses: string | null
    logout: (userId: string | null) => void
}

export const Header: React.FC<PropsType> = ({
  isAuth,
  userId,
  activeStyleValue,
  headerClasses,
  logout
}) => {

  return (
    <header className = { 'main-header container ' + headerClasses }>
      <Logo />
      <MainNav
        activeStyleValue={activeStyleValue}
      />
      <SocialNav />
      { isAuth
        ?
        <>
          <NavLink to="/admin/customers" className="main-header__admin-link">
            <svg><use href={`${Sprite}#admin`}/></svg>
          </NavLink>
          <NavLink to="/" className="main-header__admin-link" onClick={() => { logout(userId) }}>
            <svg><use href={`${Sprite}#logout`}/></svg>
          </NavLink>
        </>
        :
        <NavLink to="/login" className="main-header__admin-link">
          <svg><use href={`${Sprite}#login`}/></svg>
        </NavLink>
      }
    </header>
  );
}
