import * as React from "react";
import {ReactComponent as FaceBookIcon} from "../assets/svg/facebook.svg";
import {ReactComponent as InstagramIcon} from "../assets/svg/instagram.svg";
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
            {item.icon === "instagram"
                ? <InstagramIcon />
                : <FaceBookIcon />
            }
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
