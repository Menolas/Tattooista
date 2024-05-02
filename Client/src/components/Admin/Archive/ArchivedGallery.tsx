import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getArchivedGalleryPageSizeSelector,
    getArchivedGallerySelector,
    getCurrentArchivedGalleryPageSelector,
    getIsDeletingInProcessSelector,
    getTotalArchivedGalleryItemsCountSelector
} from "../../../redux/ArchivedGallery/archived-gallery-selectors";
import {getStylesSelector,} from "../../../redux/Styles/styles-selectors";
import {Paginator} from "../../common/Paginator";
import {
    deleteArchivedGalleryItem,
    getArchivedGallery,
    reactivateArchivedGalleryItem,
    setArchivedGalleryPageSizeAC,
    setCurrentArchivedGalleryPageAC,
    updateArchivedGalleryItem
} from "../../../redux/ArchivedGallery/archived-gallery-reducer";
import {getStyles,} from "../../../redux/Styles/styles-reducer";
import { API_URL } from "../../../http";
// @ts-ignore
import Sprite from "../../../assets/svg/sprite.svg"
import {NothingToShow} from "../../common/NothingToShow"
import {ModalPopUp} from "../../common/ModalPopUp"
import {UpdateGalleryItemForm} from "../../Forms/UpdateGalleryItemForm"
import {Tooltip} from "react-tooltip"
import {Confirmation} from "../../common/Confirmation";
import {getTokenSelector} from "../../../redux/Auth/auth-selectors";

export const ArchivedGallery = () => {

    const totalCount = useSelector(getTotalArchivedGalleryItemsCountSelector);
    const pageSize = useSelector(getArchivedGalleryPageSizeSelector);
    const currentPage = useSelector(getCurrentArchivedGalleryPageSelector);
    const archivedGallery = useSelector(getArchivedGallerySelector);
    const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
    const styles = useSelector(getStylesSelector);
    const token = useSelector(getTokenSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        if (styles.length === 0) {
            dispatch(getStyles(token));
        }
        dispatch(getArchivedGallery(currentPage, pageSize));
    }, [currentPage, pageSize]);

    const [bigImg, setBigImg] = useState('');
    const [confirmationData, setConfirmationData] = useState<{needConfirmation: boolean, itemId?: string}>({
        needConfirmation: false,
    });
    const [confirmationForRestoreData, setConfirmationForRestoreData] = useState<{needConfirmation: boolean, itemId?: string}>({
        needConfirmation: false,
    });

    const closeConfirmationModalCallBack = () => {
        setConfirmationData({needConfirmation: false});
        setConfirmationForRestoreData({needConfirmation: false});
    }

    const showBigImg = (fileName) => {
        if (!bigImg) {
            setBigImg(fileName);
        }
    }

    const closeBigImg = () => {
        setBigImg('');
    }

    const onPageChangedCallBack = (page: number) => {
        dispatch(setCurrentArchivedGalleryPageAC(page));
    }

    const setArchivedGalleryPageSizeACCallBack = (archivedGalleryPageSize: number) => {
        dispatch(setArchivedGalleryPageSizeAC(archivedGalleryPageSize));
    }

    const deleteArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(deleteArchivedGalleryItem(itemId, archivedGallery, currentPage, totalCount, pageSize));
    }

    const reactivateArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(reactivateArchivedGalleryItem(itemId, archivedGallery, currentPage, totalCount, pageSize));
    }

    const updateArchivedGalleryItemCallBack = (id: string, values: object) => {
        dispatch(updateArchivedGalleryItem(id, values));
    }

    const [ editGalleryItem, setEditGalleryItem ] = useState(null);
    const closeGalleryItemEditModal = () => {
        setEditGalleryItem(null);
    }

    const galleryItems = archivedGallery.map(item => {
        return (
            <li
                key={item._id}
                className="gallery__item"
            >
                <div
                    onClick={() => { showBigImg(item.fileName) }}
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
                        onClick={() => {setEditGalleryItem(item)}}
                    >
                        <svg><use href={`${Sprite}#edit`}/></svg>
                    </button>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Restore archived gallery item"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === item._id)}
                        onClick={() => {setConfirmationForRestoreData({ needConfirmation: true, itemId: item._id })}}
                    >
                        <svg><use href={`${Sprite}#arrow-rotate-left`}/></svg>
                    </button>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete archived gallery item"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === item._id)}
                        onClick={() => {setConfirmationData({ needConfirmation: true, itemId: item._id });}}
                    >
                        <svg><use href={`${Sprite}#trash`}/></svg>
                    </button>
                </div>
            </li>
        )
    })

    return (
        <>
            <div className="admin__cards-header">
                <Paginator
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChanged={onPageChangedCallBack}
                    setPageLimit={setArchivedGalleryPageSizeACCallBack}
                />
            </div>
            { archivedGallery.length > 0
                ? (
                    <ul className="gallery__list gallery__list--archive list">
                        { galleryItems }
                    </ul>
                  )
                : <NothingToShow/>
            }
            {
                bigImg &&
                <div className={"gallery__large-wrap modal-wrap"}>
                    <div className={"gallery__large"}>
                        <button
                            className={"closing-btn gallery__item-close-btn"}
                            onClick={() => { closeBigImg() }}>
                            {''}
                        </button>
                        <img src={`${API_URL}/archivedGallery/${bigImg}`} alt={''} />
                    </div>
                </div>
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
                        edit={updateArchivedGalleryItemCallBack}
                        closeModal={closeGalleryItemEditModal}
                    />
                }
            </ModalPopUp>
            <ModalPopUp
                isOpen={confirmationData.needConfirmation || confirmationForRestoreData.needConfirmation}
                modalTitle={''}
                closeModal={closeConfirmationModalCallBack}
            >
                { confirmationData.needConfirmation &&
                    <Confirmation
                        content={'Are you sure? You about to delete this gallery image from archive FOREVER...'}
                        confirm={() => {deleteArchivedGalleryItemCallBack(confirmationData.itemId)}}
                        cancel={closeConfirmationModalCallBack}
                    />
                }
                { confirmationForRestoreData.needConfirmation &&
                    <Confirmation
                        content={'Are you sure? You about to restore this gallery image.'}
                        confirm={() => {reactivateArchivedGalleryItemCallBack(confirmationForRestoreData.itemId)}}
                        cancel={closeConfirmationModalCallBack}
                    />
                }
            </ModalPopUp>
            <Tooltip id="my-tooltip" />
        </>
    )
}
