import * as React from "react";
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import { NavLink } from "react-router-dom";
import {BookingButton} from "../common/BookingButton";

export const Advertisement: React.FC = React.memo(() => {

  return (
    <section className="advertisement">
      <div className="social-share">
          <h3 className={'page-block__title-secondary'}>Share this page:</h3>
          <ul className="social-share__list list">
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#instagram`}/></svg>
              </NavLink>
            </li>
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#facebook`}/></svg>
              </NavLink>
            </li>
          </ul>
      </div>
      <BookingButton
          consentId={"consentAdvertisement"}
      />
    </section>
  )
})
