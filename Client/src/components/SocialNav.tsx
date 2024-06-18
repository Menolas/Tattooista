import * as React from "react";
// @ts-ignore
import Sprite from "../assets/svg/sprite.svg";
import { socialLinksData } from "../utils/constants";

const socialLinks = socialLinksData.map(item => (
    <li className="social-nav__item" key={item.tooltipText}>
        <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content={item.tooltipText}
            className="social-nav__link"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            <svg>
                <use href={`${Sprite}#${item.icon}`}/>
            </svg>
        </a>
    </li>
));

export const SocialNav: React.FC = () => {
    return (
        <nav className="social-nav">
            <ul className="social-nav__list">
                {socialLinks}
            </ul>
        </nav>
    );
};
