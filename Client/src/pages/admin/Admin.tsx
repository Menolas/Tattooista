import * as React from "react"
import {Navigate, NavLink} from "react-router-dom"
import { Outlet } from "react-router-dom"
import {useSelector} from "react-redux"
import {getAuthSelector, getUserSelector} from "../../redux/Auth/auth-selectors"
import {ADMIN, ADMIN_BUTTONS_DATA, SUPER_ADMIN} from "../../utils/constants"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg";
import { useState} from "react";

const Admin: React.FC = React.memo(() => {

  const isAuth = useSelector(getAuthSelector)
  const user = useSelector(getUserSelector)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!isAuth) return <Navigate to='/login' />
  if (isAuth && user.isActivated !== true) {
    return <Navigate to="/registration" />
  }

  const AdminButton = ({
    btn
  }: {
      btn: {
          btnText: string
          btnUrl: string
      }
  }) => {
      return (
        <li key={btn.btnText}>
            <NavLink
                to={btn.btnUrl}
                className={ (isActive) => isActive ? '' : '' }
            >
                {btn.btnText}
            </NavLink>
        </li>
      )
  }

  const AdminButtonMobile = ({
    btn
  }: {
    btn: {
        btnText: string
        btnUrl: string
    }
  }) => {
        return (
            <li key={btn.btnUrl}>
                <NavLink
                    to={btn.btnUrl}
                    className={'btn btn--bg btn--dark-bg'}
                    onClick={() => {setIsMobileMenuOpen(false)}}
                >
                    {btn.btnText}
                </NavLink>
            </li>
        )
  }

  const adminButtons = ADMIN_BUTTONS_DATA.map((btn, i ) => {
    if (isAuth === "ADMIN") {
        if (btn.btnText !== "Users") {
            return <AdminButton btn={btn} key={`${btn.btnText}-${i}`}/>
        }
    }
    if (isAuth === "SUPER_ADMIN") {
      return <AdminButton btn={btn} key={`${btn.btnText}-${i}`}/>
    }
    return null
  })

  const adminButtonsMobile = ADMIN_BUTTONS_DATA.map((btn, i ) => {
    if (isAuth === "ADMIN") {
        if (btn.btnText !== "Users") {
            return <AdminButtonMobile btn={btn} key={`${btn.btnUrl}-${i}`}/>
        }
    }
    if (isAuth === "SUPER_ADMIN") {
        return <AdminButtonMobile btn={btn} key={`${btn.btnUrl}-${i}`}/>
    }
    return null
  })

  return (
    <div className="admin page-block page-block--top container">
      <aside className="admin__left-panel">
        <div
          className={isMobileMenuOpen ? "admin-panel-mobile show" : "admin-panel-mobile"}
        >
          <button
              className={"btn btn--bg btn--light-bg admin-panel-mobile__initiate-btn"}
              onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
          >
              Admin Panel
              <svg><use href={`${Sprite}#chevron-down`}/></svg>
          </button>
          <div
              className={'admin-panel-mobile__dropdown'}
          >
              <ul className={"list admin-panel-mobile__dropdown-list"}>
                  {adminButtonsMobile}
              </ul>
          </div>
        </div>
        <nav className={'admin__nav'}>
            <ul className="list admin__view-btns admin__nav-list">
                {adminButtons}
            </ul>
        </nav>
      </aside>
      <section className={'admin__content'}>
          <Outlet />
      </section>
    </div>
  )
})

export default Admin
