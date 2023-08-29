import * as React from 'react'
import { useEffect} from 'react'
import {ClientSearchFormFormik} from "../../Forms/ClientSearchFormFormik";
import {Paginator} from "../../common/Paginator";
import {
    ClientsFilterType,
    setArchivedClientsFilter,
    setArchivedClientsPageSize,
    SetCurrentPageForArchivedClients,
    getArchivedClients, deleteArchivedClient, reactivateClient
} from "../../../redux/Clients/clients-reducer";
import {NothingToShow} from "../../common/NothingToShow";
import {useDispatch, useSelector} from "react-redux";
import {
    getArchivedClientsFilter,
    getArchivedClientsPageSize,
    getArchivedClientsSelector,
    getClientsIsFetching,
    getCurrentArchivedClientsPage,
    getTotalArchivedClientsCount
} from "../../../redux/Clients/clients-selectors";
import {Preloader} from "../../common/Preloader";
import {ArchivedClient} from "./ArchivedClient";
import {useNavigate} from "react-router-dom";

export const ArchivedClients: React.FC = () => {
    const clientsIsFetching = useSelector(getClientsIsFetching)
    const archivedClients = useSelector(getArchivedClientsSelector)
    const totalArchivedClientsCount = useSelector(getTotalArchivedClientsCount)
    const archivedClientsPageSize = useSelector(getArchivedClientsPageSize)
    const currentArchivedClientsPage = useSelector(getCurrentArchivedClientsPage)
    const archivedClientsFilter = useSelector(getArchivedClientsFilter)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)

        let actualPage = currentArchivedClientsPage
        let actualFilter = archivedClientsFilter

        if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
        if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
        if (!!urlParams.get('status')) actualFilter = { ...actualFilter, gallery: urlParams.get('gallery')}


        dispatch(getArchivedClients(actualPage, archivedClientsPageSize, actualFilter))
    }, [])

    useEffect(() => {
        navigate(`?term=${archivedClientsFilter.term}&gallery=${archivedClientsFilter.gallery}&page=${currentArchivedClientsPage}`)
    }, [archivedClientsFilter, currentArchivedClientsPage])

    const setArchivedClientsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedClientsPageSize(pageSize))
    }

    const onPageChangedCallBack = (
        currentPage: number
    ) => {
        dispatch(SetCurrentPageForArchivedClients(currentPage))
    }

    const onFilterChangeCallBack = (
        filter: ClientsFilterType
    ) => {
        dispatch(setArchivedClientsFilter(filter))
    }

    const deleteArchivedClientCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedClient(clientId))
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
                    deleteClient={deleteArchivedClientCallBack}
                    reactivateClient={reactivateClientCallBack}
                />
            )
        })

    return (
        <>
            <div className="admin__cards-header">
                { totalArchivedClientsCount && totalArchivedClientsCount > archivedClientsPageSize ? (
                    <>
                        <ClientSearchFormFormik
                            clientsFilter={archivedClientsFilter}
                            onFilterChanged={onFilterChangeCallBack}
                        />
                        <Paginator
                            totalCount={totalArchivedClientsCount}
                            pageSize={archivedClientsPageSize}
                            currentPage={currentArchivedClientsPage}
                            onPageChanged={onPageChangedCallBack}
                            setPageLimit={setArchivedClientsPageSizeCallBack}
                        />
                    </>) : null
                }
            </div>
            {/*{ clientsIsFetching && <Preloader /> }*/}
            { archivedClients.length > 0
                ? <ul className="admin__cards-list list">
                    { clientsElements }
                </ul>
                : <NothingToShow/>
            }
        </>
    )
}