import * as React from "react";
// @ts-ignore
import Sprite from "../assets/svg/sprite.svg";
import { socialLinksData } from "../utils/constants";

const socialLinks = socialLinksData.map(item => {
  return (
      <li className="social-nav__item" key={item.tooltipText}>
        <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content={item.tooltipText}
            className="social-nav__link"
            href={item.url}
            target={"_blank"}>
          <span><svg><use href={`${Sprite}#${item.icon}`}/></svg></span>
          {item.text}
        </a>
      </li>
  )
})


export const SocialNav: React.FC = React.memo(() => {
  return (
    <nav className="social-nav">
      <ul className="social-nav__list">
        {socialLinks}
      </ul>
    </nav>
  )
})
