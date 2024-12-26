import * as React from "react";
import { User } from "./User";
import {Paginator} from "../../common/Paginator";
import {RoleType, SearchFilterType, UserType} from "../../../types/Types";
import {Preloader} from "../../common/Preloader";
import {NothingToShow} from "../../common/NothingToShow";
import { usersFilterSelectOptions } from "../../../utils/constants";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {useCallback, useState} from "react";
import {UpdateUserForm} from "../../Forms/UpdateUserForm";
import {ModalPopUp} from "../../common/ModalPopUp";

type PropsType = {
    userUpdateError: null | string;
    roles: Array<RoleType>;
    users: Array<UserType>;
    filter: SearchFilterType;
    isFetching: boolean;
    total: number;
    currentPage: number;
    pageLimit: number;
    //accessError: string | null;
    isDeletingInProcess: Array<string>;
    setPageLimit: (limit:number) => void;
    setCurrentPage: (page: number) => void;
    setFilter: (filter: SearchFilterType) => void;
    remove: (userId: string) => void;
    setUserUpdateError: () => void;
}

export const Users: React.FC<PropsType> = React.memo(({
   userUpdateError,
   roles,
   users,
   filter,
   isFetching,
   total,
   currentPage,
   pageLimit,
   isDeletingInProcess,
   setPageLimit,
   setCurrentPage,
   setFilter,
   remove,
   setUserUpdateError,
}) => {

    const [addUserMode, setAddMode] = useState<boolean>(false);
    const [editUserMode, setEditMode] = useState<boolean>(false);
    const [data, setData] = useState<UserType | null>(null);

    const closeModal = useCallback(() => {
        setAddMode(false);
        setEditMode(false);
        setData(null);
        setUserUpdateError();
    }, [setUserUpdateError]);

    // useEffect(() => {
    //     if ((addUserMode || editUserMode) && apiError === null) {
    //         closeModal();
    //     }
    // }, [apiError, addUserMode, editUserMode, closeModal]);

    const addUserModalTitle = 'ADD USER';
    const editUserModalTitle = 'Edit USER';

    const usersElements = users.length
        ? users.map((data, index) => {
            return <User
                    key={index}
                    data={data}
                    isDeletingInProcess={isDeletingInProcess}
                    remove={remove}
                    setEditMode={setEditMode}
                    setData={setData}
                />

            })
        : null;

    return (
        <>
            <div className="admin__cards-header">
                <SearchFilterForm
                    options={usersFilterSelectOptions}
                    filter={filter}
                    onFilterChanged={setFilter}
                />
                <button
                    className="btn btn--bg btn--light-bg add-btn"
                    onClick={() => {
                        setAddMode(true)
                    }}
                >
                    Add User
                </button>
                <Paginator
                    totalCount={total}
                    pageSize={pageLimit}
                    currentPage={currentPage}
                    onPageChanged={setCurrentPage}
                    setPageLimit={setPageLimit}
                />
            </div>
            {
                isFetching
                    ? <Preloader/>
                    : total && total > 0
                        ? (
                            <ul className="admin__cards-list list">
                                {usersElements && usersElements}
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
                        fromProfile={false}
                        apiError={userUpdateError}
                        isEditing={editUserMode}
                        data={data}
                        roles={roles}
                        closeModal={closeModal}
                    />
                }
            </ModalPopUp>
        </>
    );
});

Users.displayName = 'Users';
