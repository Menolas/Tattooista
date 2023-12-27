import React from "react"
import { Navigate } from "react-router-dom"

export const withAuthRedirect = ({
  isAuth,
  user,
  Component
 }) => {

    if (!isAuth) return <Navigate to='/login' />
    if (isAuth && !user.isActivated) {
      return <Navigate to="/registration" />
    }
    return <Component />
}

