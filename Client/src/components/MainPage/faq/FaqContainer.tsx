import * as React from "react";
import {FaqItems} from "./FaqItems";
import {
    getFaqItemsSelector,
    getIsDeletingInProcessSelector,
    getIsFetchingSelector
} from "../../../redux/Faq/faq-selectors";
import {
    deleteFaqItem,
    getFaqItems,
} from "../../../redux/Faq/faq-reducer";
import {getIsAuthSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {useEffect} from "react";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";
import {AppDispatch} from "../../../redux/redux-store";

export const FaqContainer = () => {
    const token = useSelector(getTokenSelector);
    const apiError = useSelector(getApiErrorSelector);
    const isAuth = useSelector(getIsAuthSelector);
    const faq = useSelector(getFaqItemsSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getFaqItems());
    }, [dispatch]);

    const removeCallBack = (id: string) => {
        dispatch(deleteFaqItem(token, id));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    }

    return (
        <FaqItems
            apiError={apiError}
            isAuth={isAuth}
            isFetching={isFetching}
            isDeletingInProcess={isDeletingInProcess}
            faq={faq}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
