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

export const FaqContainer = () => {

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

    return (
        <FaqItems
            isAuth={isAuth}
            isFetching={isFetching}
            isDeletingInProcess={isDeletingInProcess}
            faq={faq}
            edit={editCallBack}
            add={addCallBack}
            remove={removeCallBack}
        />
    )
}
