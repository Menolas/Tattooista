import * as React from "react";
import {ReactComponent as PreloaderImg} from "../../assets/img/PreloaderImg.svg";

export const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <PreloaderImg />
    </div>
  );
};
