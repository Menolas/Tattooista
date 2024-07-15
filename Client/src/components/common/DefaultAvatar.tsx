import * as React from "react";
import {Img} from 'react-image';
import placeholder from '../../assets/img/fox.webp';
import foxImage from '../../assets/img/fox.webp';

type PropsType = {
    src?: string;
    alt?: string;
}
export const DefaultAvatar: React.FC<PropsType> = ({
    src,
    alt,
 }) => {
    const imgUrl = src || foxImage;
    return (
        <Img
            src={imgUrl}
            loader={<img src={placeholder} alt="Loading..." />}
            unloader={<img src={placeholder} alt="Failed to load" />}
            alt={alt ?? "Default Avatar"}
        />
    );
};

DefaultAvatar.displayName = 'DefaultAvatar';
