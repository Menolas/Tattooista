import * as React from "react";
import {FaqItems} from "./FaqItems";
import {
    getFaqItemsSelector,
    getIsDeletingInProcessSelector,
    getIsFetchingSelector
} from "../../../redux/Faq/faq-selectors";
import {
    addFaqItem,
    deleteFaqItem,
    getFaqItems,
    updateFaqItem
} from "../../../redux/Faq/faq-reducer";
import {getAuthSelector} from "../../../redux/Auth/auth-selectors";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {FaqType} from "../../../types/Types";
import {useEffect} from "react";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const FaqContainer = () => {

    const apiError = useSelector(getApiErrorSelector);
    const isAuth = useSelector(getAuthSelector);
    const faq = useSelector(getFaqItemsSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFaqItems());
    }, [dispatch]);

    const addCallBack = (values: FaqType) => {
        dispatch(addFaqItem(values));
    }

    const editCallBack = (id: string, values: any) => {
        dispatch(updateFaqItem(id, values));
    }

    const removeCallBack = (id: string) => {
        dispatch(deleteFaqItem(id));
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
            edit={editCallBack}
            add={addCallBack}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
