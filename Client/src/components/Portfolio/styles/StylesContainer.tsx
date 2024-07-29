import * as React from "react";
import { StyleType } from "../../../types/Types";
import {
    deleteStyle,
    getStyles,
    setActiveStyle,
} from "../../../redux/Styles/styles-reducer";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {
    getIsFetchingSelector,
    getActiveStyleSelector,
    getStylesSelector,
    getIsStyleDeletingInProcess,
} from "../../../redux/Styles/styles-selectors";
import {Styles} from "./Styles";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const StylesContainer: React.FC = () => {
    const apiError = useSelector(getApiErrorSelector);
    const isAuth = useSelector(getAuthSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsStyleDeletingInProcess);
    const styles = useSelector(getStylesSelector);
    const activeStyle = useSelector(getActiveStyleSelector);
    const token = useSelector(getTokenSelector);

    const dispatch = useDispatch();

    const [hasFetchedStyles, setHasFetchedStyles] = useState(false);

    useEffect(() => {
        if (!hasFetchedStyles) {
            dispatch(getStyles(token, false)).then(() => {
                if (styles.length > 0 && !activeStyle?._id) {
                    dispatch(setActiveStyle(styles[0]));
                }
                setHasFetchedStyles(true);
            });
        }
    }, [dispatch, token, hasFetchedStyles, styles]);

    const resetActiveStyleCallBack = (style: StyleType) => {
        dispatch(setActiveStyle(style));
    };

    const removeCallBack = (id: string) => {
        dispatch(deleteStyle(id));
    };

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    };

    return (
        <Styles
            apiError={apiError}
            isAuth={isAuth}
            isFetching={isFetching}
            styles={styles}
            activeStyle={activeStyle}
            isDeletingInProcess={isDeletingInProcess}
            resetActiveStyle={resetActiveStyleCallBack}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    );
};
