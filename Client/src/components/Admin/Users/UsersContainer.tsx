import * as React from "react"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import { Users } from "./Users"
import {
    getUsers,
    setUsersCurrentPageAC,
    setUsersFilterAC,
    setUsersPageLimitAC,
    UsersFilterType
} from "../../../redux/Users/users-reducer"
import {
    getUsersCurrentPageSelector, getUsersFiletSelector,
    getUsersIsFetching,
    getUsersPageLimitSelector,
    getUsersSelector,
    getUsersTotalCountSelector
} from "../../../redux/Users/users-selectors"
import {getTokenSelector} from "../../../redux/Auth/auth-selectors"

export const UsersContainer: React.FC = () => {

    const token = useSelector(getTokenSelector)
    const users = useSelector(getUsersSelector)
    const isFetching = useSelector(getUsersIsFetching)
    const total = useSelector(getUsersTotalCountSelector)
    const currentPage = useSelector(getUsersCurrentPageSelector)
    const pageLimit = useSelector(getUsersPageLimitSelector)
    const filter = useSelector(getUsersFiletSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsers(currentPage, pageLimit, filter))
    }, [currentPage, pageLimit, filter])

    const setUsersPageLimitCallBack = (limit: number) => {
        dispatch(setUsersPageLimitAC(limit))
    }

    const setUsersCurrentPageCallBack = (page: number) => {
        dispatch(setUsersCurrentPageAC(page))
    }

    const setClientsFilterCallBack = (filter: UsersFilterType) => {
        dispatch(setUsersFilterAC(filter))
    }

    return (
        <Users
            users={users}
            filter={filter}
            isFetching={isFetching}
            total={total}
            currentPage={currentPage}
            pageLimit={pageLimit}
            setUsersPageLimit={setUsersPageLimitCallBack}
            setUsersCurrentPage={setUsersCurrentPageCallBack}
            setClientsFilter={setClientsFilterCallBack}
        />
    )
}
