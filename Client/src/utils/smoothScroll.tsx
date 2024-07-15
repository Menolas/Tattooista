import React, {ReactNode,useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuth} from "../redux/Auth/auth-reducer";
import {getAuthSelector, getUserSelector} from "../redux/Auth/auth-selectors";

interface SmoothScrollProps {
    children: ReactNode;
}

export const SmoothScroll = ({children}: SmoothScrollProps) => {

    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserSelector);

    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect( () => {
        if (isAuth && !user?.isActivated) navigate("registration");
        dispatch(checkAuth());

    }, [location.pathname, isAuth, user?.isActivated]);

    return (
        <div className={"app"}>
            {children}
        </div>
    );
};
