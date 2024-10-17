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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuth) {
            dispatch(checkAuth())
                .finally(() => setLoading(false)); // Once auth check is done, set loading to false
        } else {
            setLoading(false);
        }
    }, [isAuth, dispatch]);

    useEffect(() => {
        if (!loading) {
            if (isAuth && !user?.isActivated) {
                navigate("registration"); // Navigate to registration if user is not activated
            } else if (isAuth && user?.isActivated && from) {
                navigate(from); // Navigate to the previously saved location
                dispatch(setFromAC(null)); // Clear the "from" state after navigation
            }
        }
    }, [isAuth, user?.isActivated, from, navigate, dispatch, loading]);

    useEffect(() => {
        if (location.pathname !== '/login') {
            dispatch(setFromAC(location.pathname)); // Save the current route for redirection after login
        }
    }, [location.pathname, isAuth, dispatch]);

    if (loading) {
        return <div>Loading...</div>; // Optionally show a loading state while auth is being checked
    }

    return (
        <div className={"app"}>
            {children}
        </div>
    );
};
