import * as React from 'react'
import { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Paginator} from '../../common/Paginator'
import {NothingToShow} from '../../common/NothingToShow'
import {Preloader} from '../../common/Preloader'
import {useNavigate} from 'react-router-dom'
import {
    BookedConsultationsFilterType,
    deleteArchivedConsultation,
    getArchivedConsultations,
    reactivateConsultation,
    setArchivedConsultationsFilterAC,
    setArchivedConsultationsPageSizeAC,
    setCurrentPageForArchivedConsultationsAC
} from '../../../redux/bookedConsultations/bookedConsultations-reducer'
import {
    getArchivedConsultationsFilterSelector,
    getArchivedConsultationsPageSizeSelector,
    getArchivedConsultationsSelector,
    getCurrentArchivedConsultationsPageSelector,
    getBookedConsultationsIsFetchingSelector,
    getTotalArchivedConsultationsCountSelector, getIsDeletingInProcessSelector,
} from '../../../redux/bookedConsultations/bookedConsultations-selectors'
import {ArchivedConsultation} from './ArchivedConsultation'
import {BookedConsultationsSearchForm} from '../../Forms/BookedConsultationsSearchForm'
import {BookedConsultationType} from "../../../types/Types";

export const ArchivedConsultations: React.FC = () => {
    const isFetching = useSelector(getBookedConsultationsIsFetchingSelector)
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector)
    const archivedConsultations = useSelector(getArchivedConsultationsSelector)
    const totalCount = useSelector(getTotalArchivedConsultationsCountSelector)
    const pageSize = useSelector(getArchivedConsultationsPageSizeSelector)
    const currentPage = useSelector(getCurrentArchivedConsultationsPageSelector)
    const filter = useSelector(getArchivedConsultationsFilterSelector)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        // const urlParams = new URLSearchParams(window.location.search)
        // let actualPage = currentPage
        // let actualFilter = filter
        // if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
        // if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
        // if (!!urlParams.get('status')) actualFilter = { ...actualFilter, status: urlParams.get('status')}

        dispatch(getArchivedConsultations(currentPage, pageSize, filter))
    }, [currentPage, pageSize, filter])

    // useEffect(() => {
    //     navigate(`?term=${filter.term}&status=${filter.status}&page=${currentPage}`)
    //
    // }, [filter, currentPage])

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setCurrentPageForArchivedConsultationsAC(page))
    }

    const setArchivedConsultationsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedConsultationsPageSizeAC(pageSize))
    }

    const onFilterChangeCallBack = (
        filter: BookedConsultationsFilterType
    ) => {
        dispatch(setArchivedConsultationsFilterAC(filter))
    }

    const deleteArchivedConsultationCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedConsultation(
            clientId,
            archivedConsultations,
            currentPage,
            totalCount,
            pageSize,
            filter
        ))
    }

    const reactivateConsultationCallBack = (
        id: string
    ) => {
        dispatch(reactivateConsultation(
            id,
            archivedConsultations,
            currentPage,
            totalCount,
            pageSize,
            filter
        ))
    }

    const archivedConsultationsArray = archivedConsultations
        .map(consultation => {
            return (
                <ArchivedConsultation
                    key={consultation._id}
                    consultation={consultation}
                    deleteArchivedConsultation={deleteArchivedConsultationCallBack}
                    reactivateConsultation={reactivateConsultationCallBack}
                    isDeletingInProcess={isDeletingInProcess}
                />
            )
        })

    return (
        <>
            <div className="admin__cards-header">
                <BookedConsultationsSearchForm
                    filter={filter}
                    onFilterChanged={onFilterChangeCallBack}
                />
                <Paginator
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChanged={onPageChangedCallBack}
                    setPageLimit={setArchivedConsultationsPageSizeCallBack}
                />
            </div>
            { isFetching
                ? <Preloader />
                : totalCount && totalCount > 0
                    ? (
                        <ul className="admin__cards-list list">
                            { archivedConsultationsArray }
                        </ul>
                    ) : <NothingToShow/>
            }
        </>
    )
}
