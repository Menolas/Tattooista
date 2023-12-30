import * as React from "react"
import { User } from "./User"
import {Paginator} from "../../common/Paginator"
import {UserType} from "../../../types/Types"
import {UsersFilterType} from "../../../redux/Users/users-reducer"
import {Preloader} from "../../common/Preloader"
import {NothingToShow} from "../../common/NothingToShow"
import {UserSearchFormFormik} from "../../Forms/UserSearchFormFormik"

type PropsType = {
    users: Array<UserType>
    filter: UsersFilterType
    isFetching: boolean
    total: number
    currentPage: number
    pageLimit: number
    setUsersPageLimit: (limit:number) => void
    setUsersCurrentPage: (page: number) => void
    setClientsFilter: (filter: UsersFilterType) => void
}

export const Users: React.FC<PropsType> = ({
   users,
   filter,
   isFetching,
   total,
   currentPage,
   pageLimit,
   setUsersPageLimit,
   setUsersCurrentPage,
   setClientsFilter
}) => {

    const usersElements = users.map(user => {
        return (
            <User
                key={user._id}
                user={user}
            />
        )
    })

    return (
        <>
            <div className="admin__cards-header">
                <UserSearchFormFormik
                    filter={filter}
                    onFilterChanged={setClientsFilter}
                />
                <Paginator
                    totalCount={total}
                    pageSize={pageLimit}
                    currentPage={currentPage}
                    onPageChanged={setUsersCurrentPage}
                    setPageLimit={setUsersPageLimit}
                />
            </div>
            {
                isFetching
                    ? <Preloader />
                    : total && total > 0
                        ? (
                            <ul className="admin__cards-list list">
                                {usersElements}
                            </ul>
                        )
                    : <NothingToShow />
            }

        </>
    )
}
