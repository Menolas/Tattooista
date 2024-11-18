import React, {ReactNode, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuth, setFromAC} from "./redux/Auth/auth-reducer";
import {getAuthSelector, getFromSelector, getUserSelector} from "./redux/Auth/auth-selectors";
import {AppDispatch} from "./redux/redux-store";

interface AuthManagerProps {
    children: ReactNode;
}

export const AuthManager = ({children}: AuthManagerProps) => {
    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserSelector);
    const from = useSelector(getFromSelector);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const tokenExists = !!localStorage.getItem('refreshToken');
        setHasToken(tokenExists);
    }, []);

    useEffect(() => {
        if (!isAuth && hasToken) {
            dispatch(checkAuth())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [isAuth, hasToken, dispatch]);

    useEffect(() => {
        if (!loading) {
            if (isAuth && !user?.isActivated) {
                navigate("registration");
            } else if (isAuth && user?.isActivated && from) {
                navigate(from);
                dispatch(setFromAC(null));
            }
        }
    }, [isAuth, user?.isActivated, from, navigate, dispatch, loading]);

    useEffect(() => {
        if (location.pathname !== '/login') {
            dispatch(setFromAC(location.pathname));
        }
    }, [location.pathname, isAuth, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"app"}>
            {children}
        </div>
    );
};
