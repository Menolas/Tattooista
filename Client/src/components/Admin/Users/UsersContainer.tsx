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
    updateUser,
    setSuccessModalAC,
    addUser,
    setApiErrorAC
} from "../../../redux/Users/users-reducer";
import {
    getSuccessModalSelector,
    getRolesSelector,
    getCurrentPageSelector,
    getFiletSelector,
    getIsFetching,
    getPageLimitSelector,
    getUsersSelector,
    getTotalCountSelector,
    getAccessErrorSelector, getUsersApiErrorSelector
} from "../../../redux/Users/users-selectors";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../../types/Types";

export const UsersContainer: React.FC = () => {

    const token = useSelector(getTokenSelector);
    const roles = useSelector(getRolesSelector);
    const users = useSelector(getUsersSelector);
    const isFetching = useSelector(getIsFetching);
    const total = useSelector(getTotalCountSelector);
    const currentPage = useSelector(getCurrentPageSelector);
    const pageLimit = useSelector(getPageLimitSelector);
    const filter = useSelector(getFiletSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const accessError = useSelector(getAccessErrorSelector);
    const apiError = useSelector(getUsersApiErrorSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getRoles())
        dispatch(getUsers(token, currentPage, pageLimit, filter));
    }, [dispatch, token, currentPage, pageLimit, filter]);

    const setPageLimitCallBack = (limit: number) => {
        dispatch(setPageLimitAC(limit));
    }

    const setCurrentPageCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    }

    const setFilterCallBack = (filter: SearchFilterType) => {
        dispatch(setUsersFilterAC(filter));
    }

    const removeCallBack = (userId: string) => {
        dispatch(deleteUser(token, userId, users, currentPage, total, pageLimit, filter));
    }

    const setSuccessModalCallBack = () => {
        dispatch(setSuccessModalAC(false, ''));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(''));
    }

    const editCallBack = (
        id: string,
        values: FormData
    ) => {
        dispatch(updateUser(id, values));
    }

    const addUserCallBack = (values: FormData) => {
        dispatch(addUser(values, total));
    }

    return (
        <Users
            roles={roles}
            users={users}
            filter={filter}
            isFetching={isFetching}
            total={total}
            currentPage={currentPage}
            pageLimit={pageLimit}
            successModal={successModal}
            accessError={accessError}
            apiError={apiError}
            setPageLimit={setPageLimitCallBack}
            setCurrentPage={setCurrentPageCallBack}
            setFilter={setFilterCallBack}
            remove={removeCallBack}
            edit={editCallBack}
            add={addUserCallBack}
            setSuccessModal={setSuccessModalCallBack}
            setApiError={setApiErrorCallBack}
        />
    )
}
