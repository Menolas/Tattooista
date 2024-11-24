import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  logout,
  setLoginErrorAC,
  setNeedReLoginAC
} from "../../redux/Auth/auth-reducer";
import { Header } from "./Header";
import {
  getAuthSelector,
  getLoginErrorSelector,
  getNeedReLoginSelector,
  getUserSelector
} from "../../redux/Auth/auth-selectors";
import {useLocation,} from "react-router-dom";
import {getActiveStyleSelector} from "../../redux/Styles/styles-selectors";
import {AppDispatch} from "../../redux/redux-store";

export const HeaderContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const user = useSelector(getUserSelector);
  const loginError = useSelector(getLoginErrorSelector);
  const needReLogin = useSelector(getNeedReLoginSelector);
  const activeStyle = useSelector(getActiveStyleSelector);
  const [headerClasses, setHeaderClasses] = useState('');
  const location = useLocation();
  const [pageLocation, setPageLocation] = useState(location.pathname);
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

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

  const closeLoginModal = () => {
    if (!needReLogin) setIsLogin(false);
    dispatch(setLoginErrorAC(null));
    if (needReLogin) {
      logout();
      setIsLogin(false);
      dispatch(setNeedReLoginAC(false));
    }
  }

  const openLoginModal = () => {
    setIsLogin(true);
  };

  return <Header
      isLogin={isLogin}
      isAuth={isAuth}
      loginError={loginError}
      headerClasses={headerClasses}
      needReLogin={needReLogin}
      logout={logoutCallBack}
      closeLoginModal={closeLoginModal}
      openLoginModal={openLoginModal}
      activeStyle={activeStyle}
      user={user}
  />
}
