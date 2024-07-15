import * as React from "react";
import { User } from "./User";
import {Paginator} from "../../common/Paginator";
import {RoleType, SearchFilterType, UserType} from "../../../types/Types";
import {Preloader} from "../../common/Preloader";
import {NothingToShow} from "../../common/NothingToShow";
import { usersFilterSelectOptions } from "../../../utils/constants";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {useEffect, useState} from "react";
import {UpdateUserForm} from "../../Forms/UpdateUserForm";
import {ModalPopUp} from "../../common/ModalPopUp";
import {Navigate} from "react-router";

type PropsType = {
    apiError: null | string;
    roles: Array<RoleType>;
    users: Array<UserType>;
    filter: SearchFilterType;
    isFetching: boolean;
    total: number;
    currentPage: number;
    pageLimit: number;
    accessError: string | null;
    setPageLimit: (limit:number) => void;
    setCurrentPage: (page: number) => void;
    setFilter: (filter: SearchFilterType) => void;
    remove: (userId: string) => void;
    setApiError: () => void;
}

export const Users: React.FC<PropsType> = React.memo(({
   apiError,
   roles,
   users,
   filter,
   isFetching,
   total,
   currentPage,
   pageLimit,
   accessError,
   setPageLimit,
   setCurrentPage,
   setFilter,
   remove,
   setApiError,
}) => {

    const [addUserMode, setAddMode] = useState<boolean>(false);
    const [editUserMode, setEditMode] = useState<boolean>(false);
    const [data, setData] = useState<UserType | null>(null);

    useEffect(() => {
        if ((addUserMode || editUserMode) && apiError === null) {
            closeModal();
        }
    }, [apiError]);

    const closeModal = () => {
        setAddMode(false);
        setEditMode(false);
        setData(null);
        setApiError();
    }

    const addUserModalTitle = 'ADD USER';
    const editUserModalTitle = 'Edit USER';

    const usersElements = users.map(data => {
        return (
            <User
                key={data._id}
                data={data}
                remove={remove}
                setEditMode={setEditMode}
                setData={setData}
            />
        )
    });

    return (
        <>
            {(accessError && accessError !== '')
                ? <Navigate to="/noAccess"/>
                : <>
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
                                apiError={apiError}
                                isEditing={editUserMode}
                                data={data}
                                roles={roles}
                                closeModal={closeModal}
                            />
                        }
                    </ModalPopUp>
                </>
            }
        </>
    );
});

Users.displayName = 'Users';
