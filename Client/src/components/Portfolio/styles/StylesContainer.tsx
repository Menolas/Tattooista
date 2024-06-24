import * as React from "react";
import { StyleType } from "../../../types/Types";
import {
    deleteStyle,
    getStyles,
    setActiveStyle,
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
        console.log(activeStyle?.value + " it is an activeStyle now!!!!!!!!!!!!!!!");
        console.log(styles.length + " styles length!!!!!!");
        dispatch(getStyles(token, false)).then(() => {
            if (!activeStyle?._id) {
                console.log("we are here !!!!!!!!!!!!!!!!!!!")
                dispatch(setActiveStyle(styles[0]));
            }
        });
    }, [dispatch, activeStyle, token]);

    const resetActiveStyleCallBack = (style: StyleType) => {
        dispatch(setActiveStyle(style));
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
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
