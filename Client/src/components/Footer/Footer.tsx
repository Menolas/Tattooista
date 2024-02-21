import * as React from "react"
import { SocialNav } from "../SocialNav"
import {Logo} from "../Logo";

export const Footer = React.memo(() => {
  return (
    <footer className="main-footer container">
      <Logo />
      <SocialNav />
      <a className="main-footer__link" href="https://github.com/Menolas" target="_blank" rel="noreferrer">
            Web Developer: Olena Christensen
      </a>
      <a className="main-footer__link" href="https://www.linkedin.com/in/mariia-enhelke-b70b98267/" target="_blank" rel="noreferrer">
            Web Designer: Mariia Enhelke
      </a>
      <div className="main-footer__copyrights">@ Tattoo Studio "Adelaine Hobf"</div>
    </footer>
  )
})
