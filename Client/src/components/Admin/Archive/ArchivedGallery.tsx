import * as React from 'react'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
    getActiveStyleSelector,
    getArchivedGalleryPageSizeSelector,
    getArchivedGallerySelector,
    getCurrentArchivedGalleryPageSelector, getIsGalleryItemDeletingInProcessSelector, getTattooStylesSelector,
    getTotalArchivedGalleryItemsCountSelector
} from "../../../redux/Portfolio/portfolio-selectors";
import {Paginator} from "../../common/Paginator";
import {
    deleteArchivedGalleryItem,
    getArchivedGallery, reactivateArchivedGalleryItem,
    setArchivedGalleryPageSizeAC,
    setCurrentArchivedGalleryPageAC, updateArchivedGalleryItem, updateGalleryItem
} from "../../../redux/Portfolio/portfolio-reducer";
import {SERVER_URL} from "../../../utils/constants";
// @ts-ignore
import Sprite from '../../../assets/svg/sprite.svg'
import {NothingToShow} from "../../common/NothingToShow";
import {ModalPopUp} from "../../common/ModalPopUp";
import {UpdateGalleryItemForm} from "../../Forms/UpdateGalleryItemForm";
import {Tooltip} from "react-tooltip";

export const ArchivedGallery = () => {

    const totalCount = useSelector(getTotalArchivedGalleryItemsCountSelector)
    const pageSize = useSelector(getArchivedGalleryPageSizeSelector)
    const currentPage = useSelector(getCurrentArchivedGalleryPageSelector)
    const archivedGallery = useSelector(getArchivedGallerySelector)
    const isDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector)
    const tattooStyles = useSelector(getTattooStylesSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getArchivedGallery(currentPage, pageSize))
    }, [currentPage, pageSize])

    const [bigImg, setBigImg] = useState('')

    const showBigImg = (fileName) => {
        if (!bigImg) {
            setBigImg(fileName)
        }
    }

    const closeBigImg = () => {
        setBigImg('')
    }

    const onPageChangedCallBack = (page: number) => {
        dispatch(setCurrentArchivedGalleryPageAC(page))
    }

    const setArchivedGalleryPageSizeACCallBack = (archivedGalleryPageSize: number) => {
        dispatch(setArchivedGalleryPageSizeAC(archivedGalleryPageSize))
    }

    const deleteArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(deleteArchivedGalleryItem(itemId, archivedGallery, currentPage, totalCount, pageSize))
    }

    const reactivateArchivedGalleryItemCallBack = (id: string) => {
        dispatch(reactivateArchivedGalleryItem(id))
    }

    const updateArchivedGalleryItemCallBack = (id: string, values: object) => {
        dispatch(updateArchivedGalleryItem(id, values))
    }

    const [ editGalleryItem, setEditGalleryItem ] = useState(null)
    const closeGalleryItemEditModal = () => {
        setEditGalleryItem(null)
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
                    //onClick={() => { showBigImg(item.fileName) }}
                    style={{ backgroundImage: `url(${SERVER_URL}archivedGallery/${item.fileName})` }}
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
                        onClick={() => {reactivateArchivedGalleryItemCallBack(item._id)}}
                    >
                        <svg><use href={`${Sprite}#smile`}/></svg>
                    </button>
                    <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete archived gallery item"
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === item._id)}
                        onClick={() => {deleteArchivedGalleryItemCallBack(item._id)}}
                    >
                        <svg><use href={`${Sprite}#trash`}/></svg>
                    </button>
                </div>
            </li>
        )
    })

    return (
        <div>
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
                ? <ul className="gallery__list list">
                    { galleryItems }
                </ul>
                : <NothingToShow/>
            }
            {
                bigImg &&
                <div className="gallery__large-wrap modal-wrap">
                    <div className="gallery__large">
                        <button
                            className="close-btn gallery__item-close-btn"
                            onClick={() => { closeBigImg() }}>
                            {''}
                        </button>
                        <img src={`${SERVER_URL}archivedGallery/${bigImg}`} alt={''} />
                    </div>
                </div>
            }
            {
                editGalleryItem &&
                <ModalPopUp
                    closeModal={closeGalleryItemEditModal}
                    modalTitle={'Update tattoo styles for this image'}
                >
                    <UpdateGalleryItemForm
                        folder={'archivedGallery'}
                        galleryItem={editGalleryItem}
                        styles={tattooStyles}
                        updateGalleryItem={updateArchivedGalleryItemCallBack}
                        closeModal={closeGalleryItemEditModal}
                    />
                </ModalPopUp>
            }
            <Tooltip id="my-tooltip" />
        </div>
    )
}
