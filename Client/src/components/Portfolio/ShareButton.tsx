import * as React from "react";
import { NavLink } from "react-router-dom";
import {copyToClipboard} from "../../utils/functions";

type PropsType = {
    socialLink: string;
    icon: React.ReactElement;
    isInstagram?: boolean;
    tooltipText: string;
    handleClick?: () => void;
};

export const ShareButton: React.FC<PropsType> = ({
 icon,
 socialLink,
 isInstagram,
 tooltipText,
 handleClick,
}) => {

    const encodedUrl = encodeURIComponent(`${window.location.href}`);
    const linkUrl = isInstagram ? socialLink :
        !handleClick ? `${socialLink}=${encodedUrl}` : "#";

    return (
        <li className="social-share__item">
            <NavLink
                to={linkUrl}
                className="social-share__link"
                data-tooltip-id="my-tooltip"
                data-tooltip-content={tooltipText}
                target="_blank"
                onClick={() => {
                    isInstagram && copyToClipboard();
                    handleClick && handleClick();
                }}
            >
                {icon}
            </NavLink>
        </li>
    );
};
