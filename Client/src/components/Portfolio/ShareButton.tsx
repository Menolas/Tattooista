import * as React from "react";
import { NavLink } from "react-router-dom";

type PropsType = {
    socialLink: string;
    icon: React.ReactElement;
    handleClick?: () => void;
};

export const ShareButton: React.FC<PropsType> = ({
 icon,
 socialLink,
 handleClick,
}) => {

    const encodedUrl = encodeURIComponent(`${window.location.href}`);

    return (
        <li className="social-share__item">
            <NavLink
                to={!handleClick ? `${socialLink}=${encodedUrl}` : "#"}
                className="social-share__link"
                target="_blank"
                onClick={() => {
                    handleClick && handleClick();
                }}
            >
                {icon}
            </NavLink>
        </li>
    );
};
