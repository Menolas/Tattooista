import * as React from "react";
import { TattooStyleType } from "../../../types/Types";
import {
    addTattooStyle,
    deleteTattooStyle,
    editTattooStyle,
    getTattooStyles,
    resetActiveStyle,
    setActiveStyleAC,
} from "../../../redux/Styles/styles-reducer";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {
    getIsFetchingSelector,
    getActiveStyleSelector,
    getStylesSelector, getIsDeletingInProcess,
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
        dispatch(getTattooStyles(token)).then(r => {
            if (!activeStyle?._id) {
                activeStyle = tattooStyles[0];
                dispatch(setActiveStyleAC(tattooStyles[0]));
            }
        });

    }, [activeStyle]);

    const resetActiveStyleCallBack = (style: TattooStyleType) => {
        dispatch(resetActiveStyle(style));
    }

    const addTattooStyleCallBack = (values: FormData) => {
        dispatch(addTattooStyle(values));
    }

    const editTattooStyleCallBack = (id: string, values: FormData) => {
        dispatch(editTattooStyle(id, values));
    }

    const deleteTattooStyleCallBack = (id: string) => {
        dispatch(deleteTattooStyle(id));
    }

    return (
        <Styles
            isAuth={isAuth}
            isFetching={isFetching}
            styles={tattooStyles}
            activeStyle={activeStyle}
            isDeletingInProcess={isDeletingInProcess}
            resetActiveStyle={resetActiveStyleCallBack}
            add={addTattooStyleCallBack}
            edit={editTattooStyleCallBack}
            remove={deleteTattooStyleCallBack}
        />
    );
}
