import React, {ReactNode, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuth, setFromAC} from "./redux/Auth/auth-reducer";
import {getAuthSelector, getFromSelector, getUserSelector} from "./redux/Auth/auth-selectors";

interface AuthManagerProps {
    children: ReactNode;
}

export const AuthManager = ({children}: AuthManagerProps) => {

    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserSelector);
    const from = useSelector(getFromSelector);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect( () => {
        console.log(isAuth  + " isAuth - authManager");
        console.log(from  + " from - authManager");
        if (isAuth && !user?.isActivated) {
            navigate("registration");
        }
        if (isAuth && user?.isActivated && from) {
            console.log(from + " 2 isAuth - authManager");
            navigate(from);
            dispatch(setFromAC(null));
        }
        if (!isAuth) {
            dispatch(checkAuth());
        }
    }, [location.pathname, isAuth, user?.isActivated, dispatch, navigate]);

    return (
        <div className={"app"}>
            {children}
        </div>
    );
};
