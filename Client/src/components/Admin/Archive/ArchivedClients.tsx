import * as React from "react";
import { useEffect} from "react";
import {Paginator} from "../../common/Paginator";
import {
    setPageSize,
    setCurrentPageAC,
    getArchivedClients,
    deleteArchivedClient,
    reactivateClient,
    setFilterAC,
    setApiErrorAC,
    setSuccessModalAC
} from "../../../redux/ArchivedClients/archived-clients-reducer";
import {NothingToShow} from "../../common/NothingToShow";
import {useDispatch, useSelector} from "react-redux";
import {
    getApiErrorSelector,
    getArchivedClientsFilter,
    getArchivedClientsPageSize,
    getArchivedClientsSelector,
    getClientsIsFetching,
    getCurrentArchivedClientsPageSelector,
    getIsDeletingInProcessSelector,
    getTotalArchivedClientsCount,
    getSuccessModalSelector,
} from "../../../redux/ArchivedClients/archived-clients-selectors";
import {Preloader} from "../../common/Preloader";
import {ArchivedClient} from "./ArchivedClient";
import {ApiErrorMessage} from "../../common/ApiErrorMessage";
import {clientFilterSelectOptions} from "../../../utils/constants";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";
import {SuccessPopUp} from "../../common/SuccessPopUp";
import {SearchFilterType} from "../../../types/Types";

export const ArchivedClients: React.FC = () => {
    const isFetching = useSelector(getClientsIsFetching);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const archivedClients = useSelector(getArchivedClientsSelector);
    const totalCount = useSelector(getTotalArchivedClientsCount);
    const pageSize = useSelector(getArchivedClientsPageSize);
    const currentPage = useSelector(getCurrentArchivedClientsPageSelector);
    const filter = useSelector(getArchivedClientsFilter);
    const apiError = useSelector(getApiErrorSelector);
    const successModal = useSelector(getSuccessModalSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getArchivedClients(currentPage, pageSize, filter));
    }, [dispatch, currentPage, pageSize, filter]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                dispatch(setSuccessModalAC(false, ''));
            }, 3000);
        }
    }, [successModal]);

    const setSuccessModalCallBack = () => {
        dispatch(setSuccessModalAC(false, ''));
    }

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

    const deleteArchivedClientCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedClient(
            clientId,
            archivedClients,
            currentPage,
            totalCount,
            pageSize,
            filter
        ));
    }

    const reactivateClientCallBack = (
        clientId: string
    ) => {
        dispatch(reactivateClient(
            clientId,
            archivedClients,
            currentPage,
            totalCount,
            pageSize,
            filter
        ));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(''));
    }

    const clientsElements = archivedClients
        .map(client => {
            return (
                <ArchivedClient
                    key={client._id}
                    client={client}
                    isDeletingInProcess={isDeletingInProcess}
                    deleteClient={deleteArchivedClientCallBack}
                    reactivateClient={reactivateClientCallBack}
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
            <ApiErrorMessage
                isOpen={!!apiError}
                error={apiError}
                closeModal={setApiErrorCallBack}
            />
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />
        </>
    )
}
