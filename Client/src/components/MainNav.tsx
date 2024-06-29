import * as React from "react";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { mainNavHashLinksData } from "../utils/constants";
import {MobileMainMenu} from "./MobileMainMenu";
import {useEffect, useRef, useState} from "react";

type PropsType = {
  isAuth: string | null;
  logout: () => void;
};

export const MainNav: React.FC<PropsType> = React.memo(({
    isAuth,
    logout,
}) => {

 const innerBlockRef = useRef<HTMLUListElement>(null);
 let [isMenuOpen, setIsMenuOpen] = useState(false);

 useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (innerBlockRef.current && !innerBlockRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };
    if (isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
 }, [isMenuOpen]);

  const mainNavItems = mainNavHashLinksData.map((item, i) => {
    return (
      <li className="main-nav__item" key={i}>
        <HashLink
          to={ item.url }
          className="main-nav__link"
          onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen(false)
          }}
        >
          { item.text }
        </HashLink>
      </li>
    )
  });

  return (
    <nav className={isMenuOpen ? 'main-nav shown' : 'main-nav'} ref={innerBlockRef}>
      <div
        className="hamburger"
        onClick={() => {
            setIsMenuOpen(prevState => !prevState)}}
        >
        <span>{''}</span>
      </div>
      <MobileMainMenu
          isAuth={isAuth}
          logout={logout}
          closeMenu={() => setIsMenuOpen(false)}
      />
      <ul className="list main-nav__list main-nav--ls">
        <li className="main-nav__item">
          <NavLink
              to={`portfolio`}
              className="main-nav__link"
              onClick={(event) => {
                  event.stopPropagation();
                  setIsMenuOpen(false)
              }}
          >
            Portfolio
          </NavLink>
        </li>
        { mainNavItems }
      </ul>
    </nav>
  );
});
