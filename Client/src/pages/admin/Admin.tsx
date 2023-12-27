import * as React from "react"
import {Navigate, NavLink} from "react-router-dom"
import { Outlet } from "react-router-dom"
import { withAuthRedirect } from "../../hoc/withAuthRedirect"
import {useSelector} from "react-redux"
import {getAuthSelector, getUserSelector} from "../../redux/Auth/auth-selectors"

const adminButtonsData = [
    {
        btnText: "Booked Consultations",
        btnUrl: "bookedConsultations"
    },
    {
        btnText: "Clients",
        btnUrl: "clients"
    },
    {
        btnText: "Portfolio",
        btnUrl: "portfolio"
    },
    {
        btnText: "Archive",
        btnUrl: "archive/archivedConsultations"
    },
    {
        btnText: "Users",
        btnUrl: "users"
    }
]

const adminButtons = adminButtonsData.map((btn, i ) => {

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
  console.log(user)

  if (!isAuth) return <Navigate to='/login' />
  if (isAuth && user.isActivated !== true) {
    return <Navigate to="/registration" />
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__view-btns">
            {adminButtons}
        </div>
      </div>
      <Outlet />
    </div>
  )
})

export default Admin
