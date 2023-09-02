import * as React from 'react'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { logout } from '../../redux/Auth/auth-reducer'
import { Header } from './Header'
import {getAuthSelector, getUserSelector} from '../../redux/Auth/auth-selectors'
import {useLocation} from 'react-router-dom'
import {getActiveStyleSelector} from "../../redux/Portfolio/portfolio-selectors";

export const HeaderContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector)
  const user = useSelector(getUserSelector)
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

  const logoutCallBack = () => {
    dispatch(logout())
  }

  return <Header
      isAuth={isAuth}
      headerClasses={headerClasses}
      logout={logoutCallBack}
  />
}
