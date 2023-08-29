import * as React from 'react'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { logout } from '../../redux/Auth/auth-reducer.ts'
import { Header } from './Header'
import {getAuthSelector, getUserIdSelector} from '../../redux/Auth/auth-selectors'
import {useLocation} from 'react-router-dom'
import {getActiveStyleSelector} from "../../redux/Portfolio/portfolio-selectors";

export const HeaderContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector)
  const userId = useSelector(getUserIdSelector)
  const activeStyle = useSelector(getActiveStyleSelector)
  const dispatch = useDispatch()
  const [headerClasses, setHeaderClasses] = useState('')
  const location = useLocation()
  const [pageLocation, setPageLocation] = useState(location.pathname)

  useEffect(() => {

    const pathArray = pageLocation.split('/')

    if (pathArray[1]) {
      setHeaderClasses('main-header--inner')
    } else if (!pathArray[1]) {
      setHeaderClasses('')
    }
  }, [pageLocation])

  useEffect(() => {
    setPageLocation(location.pathname)
  }, [location.pathname])

  const logoutUser = (userId: string) => {
    dispatch(logout(userId))
  }

  return <Header
      isAuth={isAuth}
      userId={userId}
      activeStyle={activeStyle}
      headerClasses={headerClasses}
      logout={logoutUser}
  />
}
