import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuth} from "../redux/Auth/auth-reducer";
import {getAuthSelector, getUserSelector} from "../redux/Auth/auth-selectors";
import {Navigate} from "react-router";

export const SmoothScroll = ({children}) => {

    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserSelector);

    const location = useLocation();

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(checkAuth());

    }, [location.pathname]);

    return (
        <div
            className={"app"}
        >
            {isAuth && !user?.isActivated &&
                <Navigate to="registration" />
            }
            {children}
        </div>
    );
}
