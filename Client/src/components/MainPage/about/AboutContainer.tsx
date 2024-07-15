import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {About} from "./About";
import {
    getPageSelector,
    getIsFetchingSelector,
    getIsEditingSelector,
} from "../../../redux/About/about-selectors";
import {
    getAboutPage,
    changeAboutPageVisibility,
} from "../../../redux/About/about-reducer";
import {useEffect} from "react";
import {getAuthSelector} from "../../../redux/Auth/auth-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";


export const AboutContainer = () => {
    const apiError = useSelector(getApiErrorSelector);
    const isAuth = useSelector(getAuthSelector);
    const page = useSelector(getPageSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isEditing = useSelector(getIsEditingSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAboutPage());
    }, [dispatch]);

    const changeAboutPageVisibilityCallBack = (isActive: boolean) => {
        dispatch(changeAboutPageVisibility(isActive));
    };

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    };

    if  (isAuth || page?.isActive) {
        return (
            <About
                apiError={apiError}
                isFetching={isFetching}
                isEditing={isEditing}
                isAuth={isAuth}
                page={page}
                changeVisibility={changeAboutPageVisibilityCallBack}
                setApiError={setApiErrorCallBack}
            />
        );
    } else {
        return null;
    }
};
