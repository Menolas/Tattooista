import * as React from "react"
import {useEffect} from "react";

export const Contacts: React.FC = React.memo(() => {

  useEffect(() => {
    // Check if the URL contains a hash
    if (window.location.hash) {
      // Get the target element using the hash
      const targetElement = document.querySelector(window.location.hash)
      // Scroll to the target element
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return (
    <section className = "page-block contacts container" id="contacts">
      <h2 className = "title title--secondary page-block__title">Contacts</h2>
      <div className = "contacts__map-wrap">
        <div className = "contacts__content">
          <p>
            Adelaine Hobf Studio<br />
            Bj Nicolaisensvei 18,<br />
            3290, Stavern
          </p>
          <p>
            +47 455 19 015<br />
            ah_tattoo@gmail.com
          </p>
        </div>
      </div>
    </section>
  )
})
