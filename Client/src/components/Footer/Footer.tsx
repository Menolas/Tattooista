import * as React from "react";
import { SocialNav } from "../SocialNav";
import {Logo} from "../Logo";
import {NavLink} from "react-router-dom";

export const Footer = React.memo(() => {
  return (
    <footer className="main-footer">
      <div className={'container'}>
          <div className={'main-footer__social'}>
              <Logo />
              <SocialNav />
          </div>
          <div className={'main-footer__creators-links'}>
              <NavLink
                  className={'main-footer__link'}
                  to={'https://github.com/Menolas'}
                  target={'_blank'}
                  rel={'noreferrer'}
              >
                    Web Developer: Olena Christensen
              </NavLink>
              <NavLink
                  className={'main-footer__link'}
                  to={'https://www.linkedin.com/in/mariia-enhelke-b70b98267/'}
                  target={'_blank'}
                  rel={'noreferrer'}>
                    Web Designer: Mariia Enhelke
              </NavLink>
          </div>
          <div className={'main-footer__copyrights'}>@ Tattoo Studio "Adelaine Hobf"</div>
      </div>
    </footer>
  )
});
