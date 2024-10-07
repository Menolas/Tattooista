import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector, getFromSelector} from "../redux/Auth/auth-selectors";
import {useNavigate} from "react-router-dom";
import {ADMIN, SUPER_ADMIN} from "../utils/constants";

export const NoAccess = () => {

    const isAuth = useSelector(getAuthSelector);
    const from = useSelector(getFromSelector);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(isAuth + " noAccess!!!!!!!")
        if (isAuth === ADMIN || isAuth === SUPER_ADMIN ) {
            console.log(from + isAuth + " noAccess!!!!!!!")
            if (from) {
                navigate(from);
            } else {
                navigate('/');
            }
        }
    }, [dispatch, navigate, isAuth]);

    return (
        <div className={"not-found"}>
            <img src={'./uploads/noaccess.webp'} alt={''} />
        </div>
    );
};
