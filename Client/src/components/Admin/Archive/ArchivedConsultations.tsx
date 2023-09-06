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
    getTotalArchivedConsultationsCountSelector,
} from '../../../redux/bookedConsultations/bookedConsultations-selectors'
import {ArchivedConsultation} from './ArchivedConsultation'
import {BookedConsultationsSearchForm} from '../../Forms/BookedConsultationsSearchForm'

export const ArchivedConsultations: React.FC = () => {
    const bookedConsultationsIsFetching = useSelector(getBookedConsultationsIsFetchingSelector)
    const archivedConsultations = useSelector(getArchivedConsultationsSelector)
    const totalArchivedConsultationsCount = useSelector(getTotalArchivedConsultationsCountSelector)
    const archivedConsultationsPageSize = useSelector(getArchivedConsultationsPageSizeSelector)
    const currentArchivedConsultationsPage = useSelector(getCurrentArchivedConsultationsPageSelector)
    const archivedConsultationsFilter = useSelector(getArchivedConsultationsFilterSelector)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)

        let actualPage = currentArchivedConsultationsPage
        let actualFilter = archivedConsultationsFilter

        if (!!urlParams.get('page')) actualPage = Number(urlParams.get('page'))
        if (!!urlParams.get('term')) actualFilter = { ...actualFilter, term: urlParams.get('term') as string }
        if (!!urlParams.get('status')) actualFilter = { ...actualFilter, status: urlParams.get('status')}


        dispatch(getArchivedConsultations(actualPage, archivedConsultationsPageSize, actualFilter))
    }, [currentArchivedConsultationsPage, archivedConsultationsPageSize, archivedConsultationsFilter])

    useEffect(() => {
        navigate(`?term=${archivedConsultationsFilter.term}&status=${archivedConsultationsFilter.status}&page=${currentArchivedConsultationsPage}`)

    }, [archivedConsultationsFilter, currentArchivedConsultationsPage])

    const setArchivedConsultationsPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setArchivedConsultationsPageSizeAC(pageSize))
    }

    const onPageChangedCallBack = (
        currentPage: number
    ) => {
        dispatch(setCurrentPageForArchivedConsultationsAC(currentPage))
    }

    const onFilterChangeCallBack = (
        filter: BookedConsultationsFilterType
    ) => {
        dispatch(setArchivedConsultationsFilterAC(filter))
    }

    const deleteArchivedConsultationCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedConsultation(clientId))
    }

    const reactivateConsultationCallBack = (
        id: string
    ) => {
        dispatch(reactivateConsultation(id))
    }

    const archivedConsultationsArray = archivedConsultations
        .map(consultation => {
            return (
                <ArchivedConsultation
                    key={consultation._id}
                    consultation={consultation}
                    deleteArchivedConsultation={deleteArchivedConsultationCallBack}
                    reactivateConsultation={reactivateConsultationCallBack}
                />
            )
        })

    return (
        <>
            <div className="admin__cards-header">
                { totalArchivedConsultationsCount && totalArchivedConsultationsCount > archivedConsultationsPageSize &&
                    <>
                        <BookedConsultationsSearchForm
                            filter={archivedConsultationsFilter}
                            onFilterChanged={onFilterChangeCallBack}
                        />
                        <Paginator
                            totalCount={totalArchivedConsultationsCount}
                            pageSize={archivedConsultationsPageSize}
                            currentPage={currentArchivedConsultationsPage}
                            onPageChanged={onPageChangedCallBack}
                            setPageLimit={setArchivedConsultationsPageSizeCallBack}
                        />
                    </>
                }
            </div>
            { bookedConsultationsIsFetching
                ? <Preloader />
                : totalArchivedConsultationsCount && totalArchivedConsultationsCount > 0
                    ? (
                        <ul className="admin__cards-list list">
                            { archivedConsultationsArray }
                        </ul>
                    ) : <NothingToShow/>
            }
        </>
    )
}