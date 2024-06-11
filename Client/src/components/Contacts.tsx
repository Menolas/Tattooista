import * as React from "react";
import {useEffect} from "react";
import {NavLink} from "react-router-dom";

export const Contacts: React.FC = () => {

  useEffect(() => {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, []);

  return (
    <section className = "page-block contacts" id="contacts">
      <h2 className = "title title--secondary page-block__title">Contacts</h2>
      <NavLink
          to={'https://www.google.com/maps/place/Bj+Nicolaisensvei+18,+3290+Stavern,+Norway/@59.0091885,10.0354468,17z/data=!3m1!4b1!4m6!3m5!1s0x4646e95c873067c5:0xd41a56ea63c87b62!8m2!3d59.0091885!4d10.0354468!16s%2Fg%2F11c4jk7s4_?entry=ttu'}
          className={'contacts__map-wrap container'}
      >
        <div className={'contacts__content'}>
          <h4>Adelaine Hobf <br/>Studio</h4>
          <p className={'contacts__address'}>
            Bj Nicolaisensvei 18,<br />
            3290, Stavern
          </p>
          <p className={'contacts__phone'}>
            +47 455 19 015<br />
            ah_tattoo@gmail.com
          </p>
        </div>
      </NavLink>
    </section>
  )
};
