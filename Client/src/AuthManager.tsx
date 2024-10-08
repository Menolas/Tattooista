import React, {ReactNode, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuth} from "./redux/Auth/auth-reducer";
import {getAuthSelector, getUserSelector} from "./redux/Auth/auth-selectors";

interface AuthManagerProps {
    children: ReactNode;
}

export const AuthManager = ({children}: AuthManagerProps) => {

    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserSelector);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect( () => {
        console.log(isAuth + " 1 isAuth - authManager");
        if (isAuth && !user?.isActivated) navigate("registration");
        if (!isAuth) {
            console.log(isAuth + " 2 isAuth - authManager");
            dispatch(checkAuth());
        }
    }, [location.pathname, isAuth, user?.isActivated, dispatch, navigate]);

    return (
        <div className={"app"}>
            {children}
        </div>
    );
};
