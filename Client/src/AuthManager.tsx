import React, {ReactNode, useEffect} from "react";
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
        if (isAuth && !user?.isActivated) {
            navigate("registration");
        }
        if (isAuth && user?.isActivated && from) {
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
