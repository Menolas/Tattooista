import * as React from "react";
// @ts-ignore
import PreloaderImg from "../../assets/img/PreloaderImg.svg";

export const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <img src={PreloaderImg} alt="" />
    </div>
  )
};
