import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getIsFetchingSelector,
    getArchivedGalleryPageSizeSelector,
    getArchivedGallerySelector,
    getCurrentArchivedGalleryPageSelector,
    getIsDeletingInProcessSelector,
    getTotalArchivedGalleryItemsCountSelector
} from "../../../../redux/ArchivedGallery/archived-gallery-selectors";
import {getActiveStyleSelector, getStylesSelector,} from "../../../../redux/Styles/styles-selectors";
import {Paginator} from "../../../common/Paginator";
import {
    deleteArchivedGalleryItem,
    getArchivedGallery,
    reactivateArchivedGalleryItem,
    setPageSizeAC,
    setCurrentPageAC,
    updateArchivedGalleryItem
} from "../../../../redux/ArchivedGallery/archived-gallery-reducer";
import {getStyles,} from "../../../../redux/Styles/styles-reducer";
import { API_URL } from "../../../../http";
// @ts-ignore
import Sprite from "../../../../assets/svg/sprite.svg"
import {NothingToShow} from "../../../common/NothingToShow"
import {ModalPopUp} from "../../../common/ModalPopUp"
import {UpdateGalleryItemForm} from "../../../Forms/UpdateGalleryItemForm"
import {Tooltip} from "react-tooltip"
import {Confirmation} from "../../../common/Confirmation";
import {getTokenSelector} from "../../../../redux/Auth/auth-selectors";
import {Preloader} from "../../../common/Preloader";
import {ImageFullView} from "../../../common/ImageFullView";

export const ArchivedGallery: React.FC = React.memo(() => {
    const isFetching = useSelector(getIsFetchingSelector);
    const totalCount = useSelector(getTotalArchivedGalleryItemsCountSelector);
    const pageSize = useSelector(getArchivedGalleryPageSizeSelector);
    const currentPage = useSelector(getCurrentArchivedGalleryPageSelector);
    const archivedGallery = useSelector(getArchivedGallerySelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const styles = useSelector(getStylesSelector);
    const token = useSelector(getTokenSelector);
    const activeStyle = useSelector(getActiveStyleSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        if (styles.length === 0) {
            dispatch(getStyles(token));
        }
        dispatch(getArchivedGallery(currentPage, pageSize));
    }, [currentPage, pageSize]);

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: (itemId: string) => void,
        context: string
    }>({needConfirmation: false, context: ''});
    const [carouselData, setCarouselData] = useState<{ isOpen: boolean, activeIndex?: number }>({isOpen: false});

    const closeModal = () => {
        setConfirmationData({needConfirmation: false, context: ''});
    }

    const onPageChangedCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    }

    const setPageSizeACCallBack = (archivedGalleryPageSize: number) => {
        dispatch(setPageSizeAC(archivedGalleryPageSize));
    }

    const deleteArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(deleteArchivedGalleryItem(itemId, archivedGallery, currentPage, pageSize));
    }

    const reactivateArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(reactivateArchivedGalleryItem(itemId, archivedGallery, currentPage, pageSize));
    }

    const updateArchivedGalleryItemCallBack = (id: string, values: object) => {
        dispatch(updateArchivedGalleryItem(id, values));
    }

    const [ editGalleryItem, setEditGalleryItem ] = useState(null);
    const closeGalleryItemEditModal = () => {
        setEditGalleryItem(null);
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
                        data-tooltip-content="Edit archived gallery item"
                        className={"btn btn--icon"}
                        onClick={() => {
                            setEditGalleryItem(item);
                        }}
                    >
                        <svg><use href={`${Sprite}#edit`}/></svg>
                    </button>
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
                        <svg><use href={`${Sprite}#arrow-rotate-left`}/></svg>
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
                        <svg><use href={`${Sprite}#trash`}/></svg>
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
                    //fakeApi={fakeApi}
                    closeImg={()=>{setCarouselData({isOpen: false});}}
                    imgUrl={`${API_URL}/archivedGallery/`}
                />
            }
            <ModalPopUp
                isOpen={editGalleryItem}
                closeModal={closeGalleryItemEditModal}
                modalTitle={'Update tattoo styles for this image'}
            >
                {
                    editGalleryItem &&
                    <UpdateGalleryItemForm
                        folder={'archivedGallery'}
                        galleryItem={editGalleryItem}
                        styles={styles}
                        activeStyleId={activeStyle._id}
                        closeModal={closeGalleryItemEditModal}
                    />
                }
            </ModalPopUp>
            <Confirmation
                isOpen={confirmationData.needConfirmation}
                content={confirmationData.context}
                confirm={() => confirmationData.cb(confirmationData.itemId)}
                cancel={closeModal}
            />
            <Tooltip id="my-tooltip" />
        </>
    )
});
