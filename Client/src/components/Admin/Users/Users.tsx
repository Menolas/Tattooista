import * as React from "react"
import { User } from "./User"
import {Paginator} from "../../common/Paginator"
import {RoleType, UserType} from "../../../types/Types"
import {UsersFilterType} from "../../../redux/Users/users-reducer"
import {Preloader} from "../../common/Preloader"
import {NothingToShow} from "../../common/NothingToShow"
import { usersFilterSelectOptions } from "../../../utils/constants"
import {SearchFilterForm} from "../../Forms/SearchFilterForm"
import {useEffect, useState} from "react";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {UpdateUserForm} from "../../Forms/UpdateUserFormFormik";
import {ModalPopUp} from "../../common/ModalPopUp";
import {Navigate} from "react-router";
import {SuccessModalType} from "../../../redux/Bookings/bookings-reducer";
import {ApiErrorMessage} from "../../common/ApiErrorMessage";

type PropsType = {
    roles: Array<RoleType>;
    users: Array<UserType>;
    filter: UsersFilterType;
    isFetching: boolean;
    total: number;
    currentPage: number;
    pageLimit: number;
    successModal: SuccessModalType;
    accessError: string;
    apiError: string;
    setUsersPageLimit: (limit:number) => void;
    setUsersCurrentPage: (page: number) => void;
    setClientsFilter: (filter: UsersFilterType) => void;
    deleteUser: (userId: string) => void;
    updateUser: (id: string, values: FormData) => void;
    addUser: (values: FormData) => void;
    setSuccessModal: () => void;
    setApiError: () => void;
}

export const Users: React.FC<PropsType> = ({
   roles,
   users,
   filter,
   isFetching,
   total,
   currentPage,
   pageLimit,
   successModal,
   accessError,
   apiError,
   setUsersPageLimit,
   setUsersCurrentPage,
   setClientsFilter,
   deleteUser,
   updateUser,
   addUser,
   setSuccessModal,
   setApiError,
}) => {

    const setSuccessModalCallBack = () => {
        setSuccessModal();
    }

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModal();
            }, 3000);
        }
    }, [successModal]);

    const [addUserMode, setAddUserMode] = useState<boolean>(false);
    const [editUserMode, setEditUserMode] = useState<boolean>(false);
    const [user, setUser] = useState<UserType>(null)

    const closeModal = () => {
        setAddUserMode(false);
        setEditUserMode(false);
        setUser(null);
    }

    const addUserModalTitle = 'ADD USER';
    const editUserModalTitle = 'Edit USER';

    const usersElements = users.map(user => {
        return (
            <User
                key={user._id}
                user={user}
                deleteUser={deleteUser}
                setEditUserMode={setEditUserMode}
                setUser={setUser}
            />
        )
    })

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
                    <ModalPopUp
                        isOpen={addUserMode || editUserMode}
                        modalTitle={addUserMode ? addUserModalTitle : editUserModalTitle}
                        closeModal={closeModal}
                    >
                        {(addUserMode || editUserMode) &&
                            <UpdateUserForm
                                isEditing={editUserMode}
                                profile={user}
                                roles={roles}
                                addUser={addUser}
                                updateUser={updateUser}
                                closeModal={closeModal}
                            />
                        }
                    </ModalPopUp>
                    <SuccessPopUp
                        isOpen={successModal.isSuccess}
                        closeModal={setSuccessModalCallBack}
                        content={successModal.successText}
                    />
                    <ApiErrorMessage
                        isOpen={!!apiError}
                        error={apiError}
                        closeModal={setApiError}
                    />
                </>
            }
        </>
    )
}
