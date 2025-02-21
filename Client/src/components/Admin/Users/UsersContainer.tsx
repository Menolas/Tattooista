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
    setUsersApiErrorAC, setUserUpdateErrorAC,
} from "../../../redux/Users/users-reducer";
import {
    getRolesSelector,
    getCurrentPageSelector,
    getFilterSelector,
    getIsFetching,
    getPageLimitSelector,
    getUsersSelector,
    getTotalCountSelector,
    getUsersApiErrorSelector,
    getIsDeletingInProcessSelector,
    getUserUpdateErrorSelector,
} from "../../../redux/Users/users-selectors";
import {getAuthAccessErrorSelector, getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../../types/Types";
import {ApiErrorMessageModal} from "../../common/ApiErrorMessageModal";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../redux/redux-store";

export const UsersContainer: React.FC = () => {

    const token = useSelector(getTokenSelector);
    const roles = useSelector(getRolesSelector);
    const users = useSelector(getUsersSelector);
    const isFetching = useSelector(getIsFetching);
    const total = useSelector(getTotalCountSelector);
    const currentPage = useSelector(getCurrentPageSelector);
    const pageLimit = useSelector(getPageLimitSelector);
    const filter = useSelector(getFilterSelector);
    const userUpdateError = useSelector(getUserUpdateErrorSelector);
    const usersApiError = useSelector(getUsersApiErrorSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getUsers(token || "", currentPage, pageLimit, filter));
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
        dispatch(deleteUser(token || "", userId, users, currentPage, pageLimit, filter));
    };

    const setUserUpdateErrorCallBack = () => {
        dispatch(setUserUpdateErrorAC(null));
    };

    const setUsersApiErrorCallBack = () => {
        dispatch(setUsersApiErrorAC(null));
    };

    return (
        <>
            <Users
                userUpdateError={userUpdateError}
                roles={roles}
                users={users}
                filter={filter}
                isFetching={isFetching}
                total={total}
                currentPage={currentPage}
                pageLimit={pageLimit}
                isDeletingInProcess={isDeletingInProcess}
                setPageLimit={setPageLimitCallBack}
                setCurrentPage={setCurrentPageCallBack}
                setFilter={setFilterCallBack}
                remove={removeCallBack}
                setUserUpdateError={setUserUpdateErrorCallBack}
            />
            {usersApiError &&
                <ApiErrorMessageModal
                    isOpen={!!usersApiError}
                    error={usersApiError}
                    closeModal={setUsersApiErrorCallBack}
                />
            }
        </>
    );
};
