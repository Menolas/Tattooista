import * as React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { mainNavHashLinksData } from "../utils/constants";
import {MobileMainMenu} from "./MobileMainMenu";

type PropsType = {
  isAuth: string | null;
  logout: () => void;
}

export const MainNav: React.FC<PropsType> = React.memo(({
  isAuth,
  logout
}: {
  isAuth: string | null
  logout: () => void
}) => {
  let [mainNavMenuModal, setMainMenu] = useState(false)
  let [mainNavClasses, setMainNavClasses] = useState('main-nav')

  const openMenu = () => {
    if (!mainNavMenuModal) {
      setMainMenu(true)
      setMainNavClasses('main-nav shown')
    } else {
      setMainMenu(false)
      setMainNavClasses('main-nav')
    }
  }

  const closeMenu = () => {
    setMainMenu(false)
    setMainNavClasses('main-nav')
  }

  const mainNavItems = mainNavHashLinksData.map((item, i) => {
    return (
      <li className="main-nav__item" key = { i }>
        <HashLink
          to={ item.url }
          className="main-nav__link"
          onClick={ closeMenu }>
          { item.text }
        </HashLink>
      </li>
    )
  })

  return (
    <nav className={ mainNavClasses } >
      <div
        className="hamburger"
        onClick={ openMenu }>
        <span>{''}</span>
      </div>
      <MobileMainMenu isAuth={isAuth} logout={logout} closeMenu={closeMenu} />
      <ul className="list main-nav__list main-nav--ls">
        <li className="main-nav__item">
          <NavLink
              to={`portfolio`}
              className="main-nav__link"
              onClick={ closeMenu }>
            Portfolio
          </NavLink>
        </li>
        { mainNavItems }
      </ul>
    </nav>
  )
})
