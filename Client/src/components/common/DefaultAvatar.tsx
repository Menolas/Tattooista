import * as React from "react";
import {Img} from 'react-image';
import foxImage from '../../assets/img/fox.webp';

type PropsType = {
    src?: string;
    alt?: string;
}
export const DefaultAvatar: React.FC<PropsType> = ({
    src,
    alt,
 }) => {
    return (
        <Img
            src={src || foxImage}
            alt={alt ?? "Default Avatar"}
        />
    );
};

DefaultAvatar.displayName = 'DefaultAvatar';
