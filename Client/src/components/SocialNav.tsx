import * as React from 'react'
import { NavLink } from 'react-router-dom'
// @ts-ignore
import Sprite from '../assets/svg/sprite.svg'
import {Tooltip} from "react-tooltip";

export const SocialNav: React.FC = React.memo(() => {
  return (
    <nav className="social-nav">
      <ul className="social-nav__list">
        <li className="social-nav__item">
          <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Look at my Instagram"
              className="social-nav__link"
              href="https://www.instagram.com/adelainehobf/"
              target={"_blank"}>
            <span><svg><use href={`${Sprite}#instagram`}/></svg></span>
            Instagram
          </a>
          {/*<Tooltip id="social-istagram" place="bottom" effect="solid"/>*/}
        </li>
        <li className="social-nav__item">
          <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Look at my Facebook"
              className="social-nav__link"
              href="https://www.facebook.com/a.hobf"
              target={"_blank"}>
            <span><svg><use href={`${Sprite}#facebook`}/></svg></span>
            Messenger
          </a>
        </li>
        <li className="social-nav__item">
          <a
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Call me"
              className="social-nav__link"
              href="tel:+4745519015"
              target={"_blank"}>
            <span><svg><use href={`${Sprite}#phone`}/></svg></span>
            Facebook
          </a>
        </li>
      </ul>
    </nav>
  )
})
