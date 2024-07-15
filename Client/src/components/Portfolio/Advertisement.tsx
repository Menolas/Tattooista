import * as React from "react";
import {ReactComponent as FaceBookIcon} from "../../assets/svg/facebook.svg";
import {ReactComponent as InstagramIcon} from "../../assets/svg/instagram.svg";
import { NavLink } from "react-router-dom";
import {BookingButton} from "../common/BookingButton";

export const Advertisement: React.FC = () => {

  return (
    <section className="advertisement">
      <div className="social-share">
          <h3 className={'page-block__title-secondary'}>Share this page:</h3>
          <ul className="social-share__list list">
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <InstagramIcon/>
              </NavLink>
            </li>
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <FaceBookIcon/>
              </NavLink>
            </li>
          </ul>
      </div>
      <BookingButton
          consentId={"consentAdvertisement"}
      />
    </section>
  )
};
