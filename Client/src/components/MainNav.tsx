import * as React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

type PropsType = {
  activeStyleValue: string
}

export const MainNav: React.FC<PropsType> = React.memo(({activeStyleValue}) => {
  let [mainNavMenuModal, setMainMenu] = useState(false)
  let [mainNavClasses, setMainNavClasses] = useState('main-nav')

  const mainNavList = [

    {
      text: 'Tattoo Artist',
      url: '#about',
    },
    {
      text: 'Studio Services',
      url: '#services',
    },
    {
      text: 'F.A.Q',
      url: '#faq',
    },
    {
      text: 'Booking',
      url: '#booking',
    },
    {
      text: 'Contacts',
      url: '#contacts',
    },
  ]

  const openMenu = () => {
    if (!mainNavMenuModal) {
      setMainMenu(true)
      setMainNavClasses('main-nav shown')
    } else {
      setMainMenu(false)
      setMainNavClasses('main-nav')
    }
  }

  const closeMenu = () => {
    setMainMenu(false)
    setMainNavClasses('main-nav')
  }

  const mainNavItems = mainNavList.map((item, i) => {
    return (
      <li className="main-nav__item" key = { i }>
        <HashLink
          to={ item.url }
          className="main-nav__link"
          onClick={ closeMenu }>
          { item.text }
        </HashLink>
      </li>
    )
  })

  return (
    <nav className={ mainNavClasses } >
      <div
        className="hamburger"
        onClick={ openMenu }>
        <span>{''}</span>
      </div>
      <ul className="list main-nav__list">
        <li className="main-nav__item">
          <NavLink
              //to={`portfolio?&style=${activeStyleValue}`}
              to={`portfolio`}
              className="main-nav__link"
              onClick={ closeMenu }>
            Portfolio
          </NavLink>
        </li>
        { mainNavItems }
      </ul>
    </nav>
  )
})
