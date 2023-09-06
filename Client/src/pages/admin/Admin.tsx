import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { withAuthRedirect } from '../../hoc/withAuthRedirect'
import { compose } from 'redux'

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
        btnUrl: "archive/archivedClients"
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

export default compose(withAuthRedirect)(Admin)
