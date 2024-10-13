import * as React from "react";
import {Services} from "./Services";
import {
    getServicesSelector,
    getIsFetchingSelector,
    getIsDeletingInProcessSelector,
} from "../../../redux/Services/services-selectors";
import {
    deleteService,
    getServices,
} from "../../../redux/Services/services-reducer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAuthSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const ServicesContainer = () => {
    const apiError = useSelector(getApiErrorSelector);
    const token = useSelector(getTokenSelector);
    const isAuth = useSelector(getAuthSelector);
    const services = useSelector(getServicesSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getServices());
    }, [dispatch]);

    const removeCallBack = (id: string) => {
        dispatch(deleteService(token, id));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    }

    return (
        <Services
            apiError={apiError}
            isFetching={isFetching}
            isDeletingInProcess={isDeletingInProcess}
            isAuth={isAuth}
            services={services}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
