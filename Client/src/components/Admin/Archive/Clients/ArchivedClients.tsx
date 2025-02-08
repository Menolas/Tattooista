import * as React from "react";
import { useEffect} from "react";
import {Paginator} from "../../../common/Paginator";
import {
    setPageSize,
    setCurrentPageAC,
    getArchivedClients,
    deleteArchivedClient,
    reactivateClient,
    setFilterAC, setArchivedClientsApiErrorAC,
} from "../../../../redux/ArchivedClients/archived-clients-reducer";
import {NothingToShow} from "../../../common/NothingToShow";
import {useDispatch, useSelector} from "react-redux";
import {
    getArchivedClientsAccessErrorSelector,
    getArchivedClientsApiErrorSelector,
    getArchivedClientsFilter,
    getArchivedClientsPageSize,
    getArchivedClientsSelector,
    getClientsIsFetching,
    getCurrentArchivedClientsPageSelector,
    getIsDeletingInProcessSelector,
    getTotalArchivedClientsCount,
} from "../../../../redux/ArchivedClients/archived-clients-selectors";
import {Preloader} from "../../../common/Preloader";
import {ArchivedClient} from "./ArchivedClient";
import {clientFilterSelectOptions} from "../../../../utils/constants";
import {SearchFilterForm} from "../../../Forms/SearchFilterForm";
import {SearchFilterType} from "../../../../types/Types";
import {ApiErrorMessageModal} from "../../../common/ApiErrorMessageModal";
import {getTokenSelector} from "../../../../redux/Auth/auth-selectors";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../../redux/redux-store";

export const ArchivedClients: React.FC = React.memo(() => {
    const isFetching = useSelector(getClientsIsFetching);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const archivedClients = useSelector(getArchivedClientsSelector);
    const totalCount = useSelector(getTotalArchivedClientsCount);
    const pageSize = useSelector(getArchivedClientsPageSize);
    const currentPage = useSelector(getCurrentArchivedClientsPageSelector);
    const filter = useSelector(getArchivedClientsFilter);
    const archivedClientsApiError = useSelector(getArchivedClientsApiErrorSelector);
    const token = useSelector(getTokenSelector);
    const accessError = useSelector(getArchivedClientsAccessErrorSelector);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getArchivedClients(token, currentPage, pageSize, filter));
    }, [token, dispatch, currentPage, pageSize, filter]);

    // useEffect(() => {
    //     if (accessError) {
    //         navigate("/noAccess");
    //     }
    // }, [accessError]);

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setCurrentPageAC(page));
    }

    const setPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setPageSize(pageSize));
    }

    const onFilterChangeCallBack = (
        filter: SearchFilterType
    ) => {
        dispatch(setFilterAC(filter));
    }

    const removeCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedClient(
            token,
            clientId,
            archivedClients,
            currentPage,
            pageSize,
            filter
        ));
    }

    const reactivateCallBack = (
        clientId: string
    ) => {
        dispatch(reactivateClient(
            token,
            clientId,
            archivedClients,
            currentPage,
            pageSize,
            filter
        ));
    }

    const setArchivedClientsApiErrorCallBack = () => {
        dispatch(setArchivedClientsApiErrorAC(null));
    }

    const clientsElements = archivedClients
        .map(data => {
            return (
                <ArchivedClient
                    key={data?._id}
                    data={data}
                    isDeletingInProcess={isDeletingInProcess}
                    remove={removeCallBack}
                    reactivate={reactivateCallBack}
                />
            )
        })

    return (
        <>
            <div className="admin__cards-header">
                <SearchFilterForm
                    options={clientFilterSelectOptions}
                    filter={filter}
                    onFilterChanged={onFilterChangeCallBack}
                />
                <Paginator
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChanged={onPageChangedCallBack}
                    setPageLimit={setPageSizeCallBack}
                />
            </div>
            {
                isFetching
                    ? <Preloader />
                    : totalCount && totalCount > 0
                        ? (
                            <ul className="admin__cards-list list">
                                { clientsElements }
                            </ul>
                          )
                        : <NothingToShow/>
            }
            <ApiErrorMessageModal
                isOpen={!!archivedClientsApiError}
                error={archivedClientsApiError}
                closeModal={setArchivedClientsApiErrorCallBack}
            />
        </>
    );
});

ArchivedClients.displayName = 'ArchivedClients';
