import * as React from "react";
import {Services} from "./Services";
import {
    getServicesSelector,
    getIsFetchingSelector,
    getFakeApiSelector,
    getIsDeletingInProcessSelector,
} from "../../../redux/Services/services-selectors";
import {
    addService,
    deleteService,
    editService,
    getServices,
} from "../../../redux/Services/services-reducer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAuthSelector} from "../../../redux/Auth/auth-selectors";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const ServicesContainer = () => {
    const apiError = useSelector(getApiErrorSelector);
    const isAuth = useSelector(getAuthSelector);
    const services = useSelector(getServicesSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const fakeApi = useSelector(getFakeApiSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getServices());
    }, [dispatch]);

    const editCallBack = (id: string, values: FormData) => {
        dispatch(editService(id, values));
    }

    const addCallBack = (values: FormData) => {
        dispatch(addService(values));
    }

    const removeCallBack = (id: string) => {
        dispatch(deleteService(id));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    }

    return (
        <Services
            apiError={apiError}
            fakeApi={fakeApi}
            isFetching={isFetching}
            isDeletingInProcess={isDeletingInProcess}
            isAuth={isAuth}
            services={services}
            edit={editCallBack}
            add={addCallBack}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
