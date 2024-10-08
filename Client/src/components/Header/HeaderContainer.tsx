import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/Auth/auth-reducer";
import { Header } from "./Header";
import {getAuthApiErrorSelector, getAuthSelector, getFromSelector} from "../../redux/Auth/auth-selectors";
import {useLocation, useNavigate} from "react-router-dom";
import {getActiveStyleSelector} from "../../redux/Styles/styles-selectors";

export const HeaderContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const authApiError = useSelector(getAuthApiErrorSelector);
  const dispatch = useDispatch();
  const [headerClasses, setHeaderClasses] = useState('');
  const location = useLocation();
  const [pageLocation, setPageLocation] = useState(location.pathname);
  const activeStyle = useSelector(getActiveStyleSelector);
  const from = useSelector(getFromSelector);
  const navigate = useNavigate();

  useEffect(() => {
    const pathArray = pageLocation.split('/');
    if (pathArray[1] === 'portfolio') {
      setHeaderClasses('main-header--portfolio');
    } else if (pathArray[1] === 'admin') {
      setHeaderClasses('main-header--admin');
    } else if (!pathArray[1]) {
      setHeaderClasses('');
    }
  }, [pageLocation]);

  useEffect(() => {
    setPageLocation(location.pathname)
  }, [location.pathname]);

  const logoutCallBack = () => {
    dispatch(logout());
  }

  return <Header
      isAuth={isAuth}
      authApiError={authApiError}
      headerClasses={headerClasses}
      logout={logoutCallBack}
      activeStyle={activeStyle}
  />
}
