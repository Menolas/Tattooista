import * as React from 'react'
import { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Paginator} from '../../common/Paginator'
import {NothingToShow} from '../../common/NothingToShow'
import {Preloader} from '../../common/Preloader'
import {useNavigate} from 'react-router-dom'
import {
    CustomersFilterType, deleteArchivedCustomer,
    getArchivedCustomers, reactivateCustomer, setArchivedCustomersFilterAC,
    setArchivedCustomersPageSizeAC,
    SetCurrentPageForArchivedCustomersAC
} from '../../../redux/Customers/customers-reducer'
import {
    getArchivedCustomersFilterSelector,
    getArchivedCustomersPageSizeSelector,
    getArchivedCustomersSelector, getCurrentArchivedCustomersPageSelector,
    getCustomersIsFetchingSelector, getTotalArchivedCustomersCountSelector
} from '../../../redux/Customers/customers-selectors'
import {ArchivedCustomer} from './ArchivedCustomer'
import {CustomersSearchFormFormik} from "../../Forms/CustomersSearchFormFormik";

export const ArchivedCustomers: React.FC = () => {
    const customersIsFetching = useSelector(getCustomersIsFetchingSelector)
    const archivedCustomers = useSelector(getArchivedCustomersSelector)
    const totalArchivedCustomersCount = useSelector(getTotalArchivedCustomersCountSelector)
    const archivedCustomersPageSize = useSelector(getArchivedCustomersPageSizeSelector)
    const currentArchivedCustomersPage = useSelector(getCurrentArchivedCustomersPageSelector)
    const archivedCustomersFilter = useSelector(getArchivedCustomersFilterSelector)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)

        let actualPage = currentArchivedCustomersPage
        let actualFilter = archivedCustomersFilter

        if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
        if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
        if (!!urlParams.get('status')) actualFilter = { ...actualFilter, status: urlParams.get('status')}


        dispatch(getArchivedCustomers(actualPage, archivedCustomersPageSize, actualFilter))
    }, [currentArchivedCustomersPage, archivedCustomersPageSize, archivedCustomersFilter])

    useEffect(() => {
        navigate(`?term=${archivedCustomersFilter.term}&status=${archivedCustomersFilter.status}&page=${currentArchivedCustomersPage}`)

    }, [archivedCustomersFilter, currentArchivedCustomersPage])

    const setArchivedClientsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedCustomersPageSizeAC(pageSize))
    }

    const onPageChangedCallBack = (
        currentPage: number
    ) => {
        dispatch(SetCurrentPageForArchivedCustomersAC(currentPage))
    }

    const onFilterChangeCallBack = (
        filter: CustomersFilterType
    ) => {
        dispatch(setArchivedCustomersFilterAC(filter))
    }

    const deleteArchivedCustomerCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedCustomer(clientId))
    }

    const reactivateCustomerCallBack = (
        customerId: string
    ) => {
        dispatch(reactivateCustomer(customerId))
    }

    const customersElements = archivedCustomers
        .map(customer => {
            return (
                <ArchivedCustomer
                    key={customer._id}
                    customer={customer}
                    deleteArchivedCustomer={deleteArchivedCustomerCallBack}
                    reactivateCustomer={reactivateCustomerCallBack}
                />
            )
        })

    return (
        <>
            <div className="admin__cards-header">
                { totalArchivedCustomersCount && totalArchivedCustomersCount > archivedCustomersPageSize &&
                    <>
                        <CustomersSearchFormFormik
                            customersFilter={archivedCustomersFilter}
                            onFilterChanged={onFilterChangeCallBack}
                        />
                        <Paginator
                            totalCount={totalArchivedCustomersCount}
                            pageSize={archivedCustomersPageSize}
                            currentPage={currentArchivedCustomersPage}
                            onPageChanged={onPageChangedCallBack}
                            setPageLimit={setArchivedClientsPageSizeCallBack}
                        />
                    </>
                }
            </div>
            { customersIsFetching
                ? <Preloader />
                : totalArchivedCustomersCount && totalArchivedCustomersCount > 0
                    ? (
                        <ul className="admin__cards-list list">
                            { customersElements }
                        </ul>
                    ) : <NothingToShow/>
            }
        </>
    )
}