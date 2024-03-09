import * as React from "react"
import { User } from "./User"
import {Paginator} from "../../common/Paginator"
import {RoleType, UserType} from "../../../types/Types"
import {UsersFilterType} from "../../../redux/Users/users-reducer"
import {Preloader} from "../../common/Preloader"
import {NothingToShow} from "../../common/NothingToShow"
import { usersFilterSelectOptions } from "../../../utils/constants"
import {SearchFilterForm} from "../../Forms/SearchFilterForm"
import {useState} from "react";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {UpdateUserForm} from "../../Forms/UpdateUserFormFormik";
import {ModalPopUp} from "../../common/ModalPopUp";
import {Navigate} from "react-router";

type PropsType = {
    roles: Array<RoleType>
    users: Array<UserType>
    filter: UsersFilterType
    isFetching: boolean
    total: number
    currentPage: number
    pageLimit: number
    isSuccess: boolean
    accessError: string
    setUsersPageLimit: (limit:number) => void
    setUsersCurrentPage: (page: number) => void
    setClientsFilter: (filter: UsersFilterType) => void
    deleteUser: (userId: string) => void
    updateUser: (id: string, values: FormData) => void
    addUser: (values: FormData) => void
    setIsSuccess: (bol: boolean) => void
}

export const Users: React.FC<PropsType> = ({
   roles,
   users,
   filter,
   isFetching,
   total,
   currentPage,
   pageLimit,
   isSuccess,
   accessError,
   setUsersPageLimit,
   setUsersCurrentPage,
   setClientsFilter,
   deleteUser,
   updateUser,
   addUser,
   setIsSuccess
}) => {

    const [addUserMode, setAddUserMode] = useState<boolean>(false)

    const closeModal = () => {
        setAddUserMode(false)
    }

    const modalTitle = 'ADD USER'
    const successPopUpContent = "You successfully updated user"

    const usersElements = users.map(user => {
        return (
            <User
                key={user._id}
                roles={roles}
                user={user}
                deleteUser={deleteUser}
                updateUser={updateUser}
            />
        )
    })

    console.log(accessError + " accessError !!!!!!!!!!!!!!!!!!!")

    return (
        <>
            {(accessError && accessError !== '')
                ? <Navigate to="/noAccess"/>
                : <>
                    <div className="admin__cards-header">
                        <SearchFilterForm
                            options={usersFilterSelectOptions}
                            filter={filter}
                            onFilterChanged={setClientsFilter}
                        />
                        <button
                            className="btn btn--bg btn--light-bg add-btn"
                            onClick={() => {
                                setAddUserMode(true)
                            }}
                        >
                            Add User
                        </button>
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
                            ? <Preloader/>
                            : total && total > 0
                                ? (
                                    <ul className="admin__cards-list list">
                                        {usersElements}
                                    </ul>
                                )
                                : <NothingToShow/>
                    }

                    {
                        addUserMode &&
                        <ModalPopUp
                            modalTitle={modalTitle}
                            closeModal={closeModal}
                        >
                            <UpdateUserForm
                                roles={roles}
                                addUser={addUser}
                                closeModal={closeModal}
                            />
                        </ModalPopUp>
                    }

                    {
                        isSuccess &&
                        <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent}/>
                    }

                </>
            }
        </>
    )
}
