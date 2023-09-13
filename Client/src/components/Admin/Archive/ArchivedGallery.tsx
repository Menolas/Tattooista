import * as React from 'react'
import { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux";
import {
    getArchivedGalleryPageSizeSelector,
    getArchivedGallerySelector,
    getCurrentArchivedGalleryPageSelector, getIsGalleryItemDeletingInProcessSelector,
    getTotalArchivedGalleryItemsCountSelector
} from "../../../redux/Portfolio/portfolio-selectors";
import {Paginator} from "../../common/Paginator";
import {
    deleteArchivedGalleryItem,
    getArchivedGallery, reactivateArchivedGalleryItem,
    setArchivedGalleryPageSizeAC,
    setCurrentArchivedGalleryPageAC
} from "../../../redux/Portfolio/portfolio-reducer";
import {SERVER_URL} from "../../../utils/constants";
// @ts-ignore
import Sprite from '../../../assets/svg/sprite.svg'
import {NothingToShow} from "../../common/NothingToShow";

export const ArchivedGallery = () => {

    const totalCount = useSelector(getTotalArchivedGalleryItemsCountSelector)
    const pageSize = useSelector(getArchivedGalleryPageSizeSelector)
    const currentPage = useSelector(getCurrentArchivedGalleryPageSelector)
    const archivedGallery = useSelector(getArchivedGallerySelector)
    const isDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getArchivedGallery(currentPage, pageSize))
    }, [currentPage, pageSize])

    const onPageChangedCallBack = (page: number) => {
        dispatch(setCurrentArchivedGalleryPageAC(page))
    }

    const setArchivedGalleryPageSizeACCallBack = (archivedGalleryPageSize: number) => {
        dispatch(setArchivedGalleryPageSizeAC(archivedGalleryPageSize))
    }

    const deleteArchivedGalleryItemCallBack = (itemId: string) => {
        dispatch(deleteArchivedGalleryItem(itemId))
    }

    const reactivateArchivedGalleryItemCallBack = (id: string) => {
        dispatch(reactivateArchivedGalleryItem(id))
    }

    const galleryItems = archivedGallery.map(item => {
        return (
            <li
                key={item._id}
                className="gallery__item"
            >
                <div
                    className={"gallery__img-wrap"}
                    //onClick={() => { showBigImg(item.fileName) }}
                    style={{ backgroundImage: `url(${SERVER_URL}archivedGallery/${item.fileName})` }}
                >
                    {''}
                </div>
                <div className={"gallery__item-actions"}>
                    <button
                        className={"btn btn--icon"}
                        disabled={isDeletingInProcess?.some(id => id === item._id)}
                        onClick={() => {reactivateArchivedGalleryItemCallBack(item._id)}}
                    >
                        <svg><use href={`${Sprite}#smile`}/></svg>
                    </button>
                    <button
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
        </div>
    )
}