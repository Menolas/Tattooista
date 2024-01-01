import * as React from "react"
import {Navigate, NavLink} from "react-router-dom"
import { Outlet } from "react-router-dom"
import {useSelector} from "react-redux"
import {getAuthSelector, getUserSelector} from "../../redux/Auth/auth-selectors"
import {AdminPanelMobileMenu} from "../../components/AdminPanelMobileMenu"
import { ADMIN_BUTTONS_DATA } from "../../utils/constants"

const adminButtons = ADMIN_BUTTONS_DATA.map((btn, i ) => {

    return (
        <NavLink
            key={i}
            to={btn.btnUrl}
            className={({ isActive }) => (isActive ? 'btn btn--bg btn--light-bg' : 'btn btn--bg btn--dark-bg')}
        >
            {btn.btnText}
        </NavLink>
    )
})

const Admin: React.FC = React.memo(() => {

  const isAuth = useSelector(getAuthSelector)
  const user = useSelector(getUserSelector)

  if (!isAuth) return <Navigate to='/login' />
  if (isAuth && user.isActivated !== true) {
    return <Navigate to="/registration" />
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <AdminPanelMobileMenu />
        <div className="admin__view-btns">
            {adminButtons}
        </div>
      </div>
      <Outlet />
    </div>
  )
})

export default Admin
