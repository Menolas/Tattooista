import * as React from 'react'

export const Contacts: React.FC = React.memo(() => {
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
