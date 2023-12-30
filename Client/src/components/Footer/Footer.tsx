import * as React from "react"
import { SocialNav } from "../SocialNav"

export const Footer = React.memo(() => {
  return (
    <footer className="main-footer container">
      <div className="main-footer__copyrights">@ Tattoo Studio "Adelaine Hobf"</div>
      <div className="main-footer__middle-section">
        <SocialNav />
      </div>
      <a className="main-footer__link" href="https://github.com/Menolas" target="_blank" rel="noreferrer">
            Web Developer: Olena Christensen
      </a>
    </footer>
  )
})
