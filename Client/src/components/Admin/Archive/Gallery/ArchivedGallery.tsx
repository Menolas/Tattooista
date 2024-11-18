import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getIsFetchingSelector,
    getArchivedGalleryPageSizeSelector,
    getArchivedGallerySelector,
    getCurrentArchivedGalleryPageSelector,
    getIsDeletingInProcessSelector,
    getTotalArchivedGalleryItemsCountSelector,
    getArchivedGalleryAccessErrorSelector,
} from "../../../../redux/ArchivedGallery/archived-gallery-selectors";
import {getStylesSelector,} from "../../../../redux/Styles/styles-selectors";
import {Paginator} from "../../../common/Paginator";
import {
    deleteArchivedGalleryItem,
    getArchivedGallery,
    reactivateArchivedGalleryItem,
    setPageSizeAC,
    setCurrentPageAC,
} from "../../../../redux/ArchivedGallery/archived-gallery-reducer";
import {getStyles,} from "../../../../redux/Styles/styles-reducer";
import { API_URL } from "../../../../http";
import {ReactComponent as TrashIcon} from "../../../../assets/svg/trash.svg";
import {ReactComponent as ArrowRotateLeftIcon} from "../../../../assets/svg/arrow-rotate-left.svg";
import {NothingToShow} from "../../../common/NothingToShow";
import {Tooltip} from "react-tooltip";
import {Confirmation} from "../../../common/Confirmation";
import {getTokenSelector} from "../../../../redux/Auth/auth-selectors";
import {Preloader} from "../../../common/Preloader";
import {ImageFullView} from "../../../common/ImageFullView";
import {getApiErrorSelector} from "../../../../redux/General/general-selectors";
import {ApiErrorMessageModal} from "../../../common/ApiErrorMessageModal";
import {setApiErrorAC} from "../../../../redux/General/general-reducer";
import {useNavigate} from "react-router-dom";
import {AppDispatch} from "../../../../redux/redux-store";

export const ArchivedGallery: React.FC = React.memo(() => {
    const isFetching = useSelector(getIsFetchingSelector);
    const totalCount = useSelector(getTotalArchivedGalleryItemsCountSelector);
    const pageSize = useSelector(getArchivedGalleryPageSizeSelector);
    const currentPage = useSelector(getCurrentArchivedGalleryPageSelector);
    const archivedGallery = useSelector(getArchivedGallerySelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const styles = useSelector(getStylesSelector);
    const token = useSelector(getTokenSelector);
    const apiError = useSelector(getApiErrorSelector);
    const accessError = useSelector(getArchivedGalleryAccessErrorSelector);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessError) {
            navigate("/noAccess");
        }
    }, [accessError]);

    useEffect(() => {
        if (!accessError) {
            if (styles.length === 0) dispatch(getStyles(token));

            dispatch(getArchivedGallery(token, currentPage, pageSize));
        }

    }, [accessError, currentPage, pageSize, dispatch, token, styles.length]);

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: (itemId: string) => void,
        context: string
    }>({needConfirmation: false, context: ''});
    const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    };

    const onPageChangedCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    };

    const setPageSizeACCallBack = (archivedGalleryPageSize: number) => {
        dispatch(setPageSizeAC(archivedGalleryPageSize));
    };

    const deleteArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(deleteArchivedGalleryItem(token, itemId, archivedGallery, currentPage, pageSize));
    };

    const reactivateArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(reactivateArchivedGalleryItem(token, itemId, archivedGallery, currentPage, pageSize));
    };

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    }

    const galleryItems = archivedGallery.map((item, index) => {
        return (
            <li
                key={item._id}
                className="gallery__item"
            >
                <div
                    onClick={() => {
                        setCarouselData({isOpen: true, activeIndex: index});
                    }}
                    className={"gallery__img-wrap"}
                    style={{ backgroundImage: `url(${API_URL}/archivedGallery/${item.fileName})` }}
                >
                    {''}
                </div>
                <div className={"gallery__item-actions"}>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Restore archived gallery item"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === item._id)}
                        onClick={() => {
                            setConfirmationData({
                                needConfirmation: true,
                                itemId: item._id,
                                context: 'Are you sure? You about to restore this gallery image.',
                                cb: reactivateArchivedGalleryItemCallBack });
                        }}
                    >
                        <ArrowRotateLeftIcon/>
                    </button>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete archived gallery item"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === item._id)}
                        onClick={() => {setConfirmationData({
                            needConfirmation: true,
                            itemId: item._id,
                            context: 'Are you sure? You about to delete this gallery image from archive FOREVER...',
                            cb: deleteArchivedGalleryItemCallBack
                            });
                        }}
                    >
                        <TrashIcon/>
                    </button>
                </div>
            </li>
        )
    });

    return (
        <>
            <div className="admin__cards-header">
                <Paginator
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChanged={onPageChangedCallBack}
                    setPageLimit={setPageSizeACCallBack}
                />
            </div>
            { isFetching
                ? <Preloader />
                : archivedGallery.length > 0
                    ? (
                        <ul className="gallery__list gallery__list--archive list">
                            { galleryItems }
                        </ul>
                      )
                    : <NothingToShow/>
            }
            {  carouselData.isOpen &&
                <ImageFullView
                    isOpen={carouselData.isOpen}
                    gallery={archivedGallery}
                    activeIndex={carouselData.activeIndex}
                    closeImg={()=>{setCarouselData({isOpen: false});}}
                    imgUrl={`${API_URL}/archivedGallery/`}
                />
            }
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => {
                    if (confirmationData.cb && confirmationData.itemId) {
                        confirmationData.cb(confirmationData.itemId);
                    } else {
                        console.error("Item ID is undefined or callback function is not provided.");
                    }
                }}
                cancel={closeModal}
            />
            {
                apiError &&
                <ApiErrorMessageModal
                    isOpen={!!apiError}
                    error={apiError}
                    closeModal={setApiErrorCallBack}
                />
            }
            <Tooltip id="my-tooltip" />
        </>
    );
});

ArchivedGallery.displayName = 'ArchivedGallery';
