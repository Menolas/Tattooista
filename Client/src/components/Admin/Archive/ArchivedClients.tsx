import * as React from "react"
import { useEffect} from "react"
import {Paginator} from "../../common/Paginator"
import {
    ClientsFilterType,
    setArchivedClientsPageSize,
    setCurrentPageForArchivedClientsAC,
    getArchivedClients,
    deleteArchivedClient,
    reactivateClient,
    setArchivedClientsFilterAC, setAddClientApiErrorAC
} from "../../../redux/Clients/clients-reducer"
import {NothingToShow} from "../../common/NothingToShow"
import {useDispatch, useSelector} from "react-redux"
import {
    getAddClientApiErrorSelector,
    getArchivedClientsFilter,
    getArchivedClientsPageSize,
    getArchivedClientsSelector,
    getClientsIsFetching,
    getCurrentArchivedClientsPageSelector,
    getIsClientDeletingInProcessSelector,
    getTotalArchivedClientsCount
} from "../../../redux/Clients/clients-selectors"
import {Preloader} from "../../common/Preloader"
import {ArchivedClient} from "./ArchivedClient"
import {ApiErrorMessage} from "../../common/ApiErrorMessage"
import {clientFilterSelectOptions} from "../../../utils/constants";
import {SearchFilterForm} from "../../Forms/SearchFilterForm";

export const ArchivedClients: React.FC = () => {
    const isFetching = useSelector(getClientsIsFetching)
    const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector)
    const archivedClients = useSelector(getArchivedClientsSelector)
    const totalCount = useSelector(getTotalArchivedClientsCount)
    const pageSize = useSelector(getArchivedClientsPageSize)
    const currentPage = useSelector(getCurrentArchivedClientsPageSelector)
    const filter = useSelector(getArchivedClientsFilter)
    const addClientApiError = useSelector(getAddClientApiErrorSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getArchivedClients(currentPage, pageSize, filter))
    }, [currentPage, pageSize, filter])

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setCurrentPageForArchivedClientsAC(page))
    }

    const setArchivedClientsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedClientsPageSize(pageSize))
    }

    const onFilterChangeCallBack = (
        filter: ClientsFilterType
    ) => {
        dispatch(setArchivedClientsFilterAC(filter))
    }

    const deleteArchivedClientCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedClient(clientId, archivedClients, currentPage, totalCount, pageSize, filter))
    }

    const reactivateClientCallBack = (
        clientId: string
    ) => {
        dispatch(reactivateClient(clientId, archivedClients, currentPage, totalCount, pageSize, filter))
    }

    const setAddClientApiErrorCallBack = (error: string) => {
        dispatch(setAddClientApiErrorAC(error))
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
                    setPageLimit={setArchivedClientsPageSizeCallBack}
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

            { addClientApiError && addClientApiError !== '' &&
                <ApiErrorMessage
                    error={addClientApiError}
                    closeModal={setAddClientApiErrorCallBack}
                />
            }
        </>
    )
}
