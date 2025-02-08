import React, {ReactNode, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {checkAuth, setFromAC} from "./redux/Auth/auth-reducer";
import {
    getAuthAccessErrorSelector,
    getAuthSelector,
    getFromSelector,
    getUserProfileSelector,
} from "./redux/Auth/auth-selectors";
import {AppDispatch} from "./redux/redux-store";
import {ModalPopUp} from "./components/common/ModalPopUp";
import {NoAccessPopUp} from "./components/common/NoAccessPopUp";

interface AuthManagerProps {
    children: ReactNode;
}

export const AuthManager = ({children}: AuthManagerProps) => {
    const isAuth = useSelector(getAuthSelector);
    const user = useSelector(getUserProfileSelector);
    const from = useSelector(getFromSelector);
    const accessError = useSelector(getAuthAccessErrorSelector);
    console.log(accessError + " !auth manager ACCESS ERROR!!!!!!!!")

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);
    const [noAccess, setNoAccess] = useState(false);

    useEffect(() => {
        if (accessError) {
            setNoAccess(true);
        }
    }, [accessError]);

    useEffect(() => {
        const tokenExists = !!localStorage.getItem('refreshToken');
        setHasToken(tokenExists);
    }, []);

    useEffect(() => {
        console.log(isAuth + " !AUTH!!!!!!!!");
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
        dispatch(setFromAC(location.pathname));
    }, [location.pathname, isAuth, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const closeNoAccess = () => {
        setNoAccess(false);
        if (accessError) {
            navigate("/");
        }
    }

    return (
        <div className={"app"}>
            {children}
            {noAccess && <ModalPopUp isOpen={noAccess} closeModal={closeNoAccess}>
                <NoAccessPopUp/>
            </ModalPopUp>}
        </div>
    );
};
