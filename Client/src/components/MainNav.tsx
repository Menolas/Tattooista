import * as React from "react";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { mainNavHashLinksData } from "../utils/constants";
import {MobileMainMenu} from "./MobileMainMenu";
import {useEffect, useRef} from "react";

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

 const innerBlockRef = useRef<HTMLUListElement>(null);

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

    // Cleanup the event listener on component unmount
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
 }, [isMenuOpen, setIsMenuOpen]);

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
      <ul className="list main-nav__list main-nav--ls" ref={innerBlockRef}>
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
