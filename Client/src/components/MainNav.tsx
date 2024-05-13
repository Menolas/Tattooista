import * as React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { mainNavHashLinksData } from "../utils/constants";
import {MobileMainMenu} from "./MobileMainMenu";

type PropsType = {
  isMenuOpen: boolean;
  isAuth: string | null;
  logout: () => void;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const MainNav: React.FC<PropsType> = React.memo(({
    isMenuOpen,
    isAuth,
    logout,
    setIsMenuOpen,
}) => {

  const mainNavItems = mainNavHashLinksData.map((item, i) => {
    return (
      <li className="main-nav__item" key={i}>
        <HashLink
          to={ item.url }
          className="main-nav__link"
          onClick={() => setIsMenuOpen(false)}>
          { item.text }
        </HashLink>
      </li>
    )
  });

  return (
    <nav className={isMenuOpen ? 'main-nav shown' : 'main-nav'} >
      <div
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span>{''}</span>
      </div>
      <MobileMainMenu isAuth={isAuth} logout={logout} closeMenu={() => setIsMenuOpen(false)} />
      <ul className="list main-nav__list main-nav--ls">
        <li className="main-nav__item">
          <NavLink
              to={`portfolio`}
              className="main-nav__link"
              onClick={() => setIsMenuOpen(false)}>
            Portfolio
          </NavLink>
        </li>
        { mainNavItems }
      </ul>
    </nav>
  )
});
