import * as React from "react";
import { StyleType } from "../../../types/Types";
import {
    addStyle,
    deleteStyle,
    editStyle,
    getStyles,
    resetActiveStyle,
    setActiveStyleAC,
} from "../../../redux/Styles/styles-reducer";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {
    getIsFetchingSelector,
    getActiveStyleSelector,
    getStylesSelector,
    getIsDeletingInProcess,
} from "../../../redux/Styles/styles-selectors";
import {Styles} from "./Styles";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const StylesContainer: React.FC = () => {
    const apiError = useSelector(getApiErrorSelector);
    const isAuth = useSelector(getAuthSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcess);
    const styles = useSelector(getStylesSelector);
    let activeStyle = useSelector(getActiveStyleSelector);
    const token = useSelector(getTokenSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getStyles(token)).then(() => {
            if (styles.length > 0 && !activeStyle?._id) {
                dispatch(setActiveStyleAC(styles[0]));
            }
        });
    }, [dispatch, activeStyle, token]);

    const resetActiveStyleCallBack = (style: StyleType) => {
        dispatch(resetActiveStyle(style));
    }

    const addCallBack = (values: FormData) => {
        dispatch(addStyle(values));
    }

    const editCallBack = (id: string, values: FormData) => {
        dispatch(editStyle(id, values));
    }

    const removeCallBack = (id: string) => {
        dispatch(deleteStyle(id));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    }

    return (
        <Styles
            apiError={apiError}
            isAuth={isAuth}
            isFetching={isFetching}
            styles={styles}
            activeStyle={activeStyle}
            isDeletingInProcess={isDeletingInProcess}
            resetActiveStyle={resetActiveStyleCallBack}
            add={addCallBack}
            edit={editCallBack}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
