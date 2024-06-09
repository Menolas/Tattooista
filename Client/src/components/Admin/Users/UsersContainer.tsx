import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Users } from "./Users";
import {
    deleteUser,
    getRoles,
    getUsers,
    setCurrentPageAC,
    setUsersFilterAC,
    setPageLimitAC,
} from "../../../redux/Users/users-reducer";
import {
    getRolesSelector,
    getCurrentPageSelector,
    getFiletSelector,
    getIsFetching,
    getPageLimitSelector,
    getUsersSelector,
    getTotalCountSelector,
    getAccessErrorSelector,
} from "../../../redux/Users/users-selectors";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../../types/Types";
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {setApiErrorAC} from "../../../redux/General/general-reducer";

export const UsersContainer: React.FC = () => {

    const token = useSelector(getTokenSelector);
    const roles = useSelector(getRolesSelector);
    const users = useSelector(getUsersSelector);
    const isFetching = useSelector(getIsFetching);
    const total = useSelector(getTotalCountSelector);
    const currentPage = useSelector(getCurrentPageSelector);
    const pageLimit = useSelector(getPageLimitSelector);
    const filter = useSelector(getFiletSelector);
    const accessError = useSelector(getAccessErrorSelector);
    const apiError = useSelector(getApiErrorSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getRoles())
        dispatch(getUsers(token, currentPage, pageLimit, filter));
    }, [dispatch, token, currentPage, pageLimit, filter]);

    const setPageLimitCallBack = (limit: number) => {
        dispatch(setPageLimitAC(limit));
    };

    const setCurrentPageCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    };

    const setFilterCallBack = (filter: SearchFilterType) => {
        dispatch(setUsersFilterAC(filter));
    };

    const removeCallBack = (userId: string) => {
        dispatch(deleteUser(token, userId, users, currentPage, pageLimit, filter));
    };

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    };

    return (
        <Users
            apiError={apiError}
            roles={roles}
            users={users}
            filter={filter}
            isFetching={isFetching}
            total={total}
            currentPage={currentPage}
            pageLimit={pageLimit}
            accessError={accessError}
            setPageLimit={setPageLimitCallBack}
            setCurrentPage={setCurrentPageCallBack}
            setFilter={setFilterCallBack}
            remove={removeCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
