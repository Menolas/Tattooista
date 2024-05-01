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

export const StylesContainer: React.FC = () => {
    const isAuth = useSelector(getAuthSelector);
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcess);
    const tattooStyles = useSelector(getStylesSelector);
    let activeStyle = useSelector(getActiveStyleSelector);
    const token = useSelector(getTokenSelector);

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getStyles(token)).then(r => {
            if (!activeStyle?._id) {
                activeStyle = tattooStyles[0];
                dispatch(setActiveStyleAC(tattooStyles[0]));
            }
        });

    }, [activeStyle]);

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

    return (
        <Styles
            isAuth={isAuth}
            isFetching={isFetching}
            styles={tattooStyles}
            activeStyle={activeStyle}
            isDeletingInProcess={isDeletingInProcess}
            resetActiveStyle={resetActiveStyleCallBack}
            add={addCallBack}
            edit={editCallBack}
            remove={removeCallBack}
        />
    )
}
