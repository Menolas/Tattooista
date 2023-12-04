import * as React from 'react'
import { useEffect} from 'react'
import {ClientSearchFormFormik} from "../../Forms/ClientSearchFormFormik";
import {Paginator} from "../../common/Paginator";
import {
    ClientsFilterType,
    setArchivedClientsPageSize,
    setCurrentPageForArchivedClientsAC,
    getArchivedClients,
    deleteArchivedClient,
    reactivateClient,
    setArchivedClientsFilterAC
} from "../../../redux/Clients/clients-reducer";
import {NothingToShow} from "../../common/NothingToShow";
import {useDispatch, useSelector} from "react-redux";
import {
    getArchivedClientsFilter,
    getArchivedClientsPageSize,
    getArchivedClientsSelector,
    getClientsIsFetching,
    getCurrentArchivedClientsPageSelector,
    getIsClientDeletingInProcessSelector,
    getTotalArchivedClientsCount
} from "../../../redux/Clients/clients-selectors";
import {Preloader} from "../../common/Preloader";
import {ArchivedClient} from "./ArchivedClient";

export const ArchivedClients: React.FC = () => {
    const isFetching = useSelector(getClientsIsFetching)
    const isDeletingInProcess = useSelector(getIsClientDeletingInProcessSelector)
    const archivedClients = useSelector(getArchivedClientsSelector)
    const totalCount = useSelector(getTotalArchivedClientsCount)
    const pageSize = useSelector(getArchivedClientsPageSize)
    const currentPage = useSelector(getCurrentArchivedClientsPageSelector)
    const filter = useSelector(getArchivedClientsFilter)

    const dispatch = useDispatch()
    //const navigate = useNavigate()

    useEffect(() => {
        // const urlParams = new URLSearchParams(window.location.search)
        // let actualPage = currentPage
        // let actualFilter = filter
        // if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
        // if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
        // if (!!urlParams.get('status')) actualFilter = { ...actualFilter, gallery: urlParams.get('gallery')}

        dispatch(getArchivedClients(currentPage, pageSize, filter))
    }, [currentPage, pageSize, filter])

    // useEffect(() => {
    //     navigate(`?term=${filter.term}&gallery=${filter.gallery}&page=${currentPage}`)
    // }, [filter, currentPage])

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
        dispatch(reactivateClient(clientId))
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
                <ClientSearchFormFormik
                    clientsFilter={filter}
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
        </>
    )
}
