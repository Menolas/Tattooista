import * as React from "react";
import {useEffect,} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paginator} from "../../../common/Paginator";
import {NothingToShow} from "../../../common/NothingToShow";
import {Preloader} from "../../../common/Preloader";
import {
    deleteArchivedBooking,
    getArchivedBookings,
    reactivateBooking,
    setFilterAC,
    setPageSizeAC,
    setArchiveBookingsCurrentPageAC, setArchivedBookingApiErrorAC,
} from "../../../../redux/ArchivedBookings/archived-bookings-reducer";
import {
    getFilterSelector,
    getPageSizeSelector,
    getArchivedBookingsSelector,
    getCurrentPageSelector,
    getIsFetchingSelector,
    getTotalCountSelector,
    getIsDeletingInProcessSelector,
    getArchivedBookingApiErrorSelector,
    getArchivedBookingsAccessErrorSelector,
} from "../../../../redux/ArchivedBookings/archived-bookings-selectors";
import {ArchivedBooking} from "./ArchivedBooking";
import {SearchFilterForm} from "../../../Forms/SearchFilterForm";
import {bookingFilterSelectOptions} from "../../../../utils/constants";
import {getTokenSelector} from "../../../../redux/Auth/auth-selectors";
import {SearchFilterType} from "../../../../types/Types";
import {ApiErrorMessageModal} from "../../../common/ApiErrorMessageModal";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../../redux/redux-store";

export const ArchivedBookings: React.FC = React.memo(() => {
    const isFetching = useSelector(getIsFetchingSelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const archivedBookings = useSelector(getArchivedBookingsSelector);
    const totalCount = useSelector(getTotalCountSelector);
    const pageSize = useSelector(getPageSizeSelector);
    const currentPage = useSelector(getCurrentPageSelector);
    const filter = useSelector(getFilterSelector);
    const token = useSelector(getTokenSelector);
    const archivedBookingApiError = useSelector(getArchivedBookingApiErrorSelector);
    const accessError = useSelector(getArchivedBookingsAccessErrorSelector);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getArchivedBookings(token || "", currentPage, pageSize, filter));
    }, [token, currentPage, pageSize, filter, dispatch]);

    // useEffect(() => {
    //     if (accessError) {
    //         navigate("/noAccess");
    //     }
    // }, [accessError]);

    const onPageChangedCallBack = (
        page: number
    ) => {
        dispatch(setArchiveBookingsCurrentPageAC(page));
    }

    const setPageSizeCallBack = (
        pageSize: number
    ) => {
        dispatch(setPageSizeAC(pageSize));
    }

    const onFilterChangeCallBack = (
        filter: SearchFilterType
    ) => {
        dispatch(setFilterAC(filter));
    }

    const removeCallBack = (
        clientId: string
    ) => {
        dispatch(deleteArchivedBooking(
            token || "",
            clientId,
            archivedBookings,
            currentPage,
            pageSize,
            filter,
        ));
    }

    const reactivateCallBack = (
        id: string
    ) => {
        dispatch(reactivateBooking(
            token || "",
            id,
            archivedBookings,
            currentPage,
            pageSize,
            filter,
        ));
    }

    const setApiErrorCallBack = () => {
        dispatch(setArchivedBookingApiErrorAC(null));
    }

    const archivedConsultationsArray = archivedBookings
        .map(data => {
            return (
                <ArchivedBooking
                    key={data._id}
                    data={data}
                    remove={removeCallBack}
                    reactivate={reactivateCallBack}
                    isDeletingInProcess={isDeletingInProcess}
                />
            )
        })

    return (
        <>
            <div className="admin__cards-header">
                <SearchFilterForm
                    options={bookingFilterSelectOptions}
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
            {isFetching
                ? <Preloader/>
                : totalCount && totalCount > 0
                    ? (
                        <ul className="admin__cards-list list">
                            {archivedConsultationsArray}
                        </ul>
                    ) : <NothingToShow/>
            }
            <ApiErrorMessageModal
              isOpen={!!archivedBookingApiError}
              error={archivedBookingApiError}
              closeModal={setApiErrorCallBack}
            />
        </>
    );
});

ArchivedBookings.displayName = 'ArchivedBookings';
