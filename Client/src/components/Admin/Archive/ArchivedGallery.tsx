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
    setCurrentArchivedGalleryPageAC, updateGalleryItem
} from "../../../redux/Portfolio/portfolio-reducer";
import {SERVER_URL} from "../../../utils/constants";
// @ts-ignore
import Sprite from '../../../assets/svg/sprite.svg'
import {NothingToShow} from "../../common/NothingToShow";
import {ModalPopUp} from "../../common/ModalPopUp";
import {UpdateGalleryItemForm} from "../../Forms/UpdateGalleryItemForm";

export const ArchivedGallery = () => {

    const totalCount = useSelector(getTotalArchivedGalleryItemsCountSelector)
    const pageSize = useSelector(getArchivedGalleryPageSizeSelector)
    const currentPage = useSelector(getCurrentArchivedGalleryPageSelector)
    const archivedGallery = useSelector(getArchivedGallerySelector)
    const isDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector)
    const tattooStyles = useSelector(getTattooStylesSelector)
    const activeStyle = useSelector(getActiveStyleSelector)

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

    const updateGalleryItemCallBack = (id: string, values: object, activeStyle: string) => {
        dispatch(updateGalleryItem(id, values, activeStyle))
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
                    className={"gallery__img-wrap"}
                    //onClick={() => { showBigImg(item.fileName) }}
                    style={{ backgroundImage: `url(${SERVER_URL}archivedGallery/${item.fileName})` }}
                >
                    {''}
                </div>
                <div className={"gallery__item-actions"}>
                    <button
                        className={"btn btn--icon"}
                        onClick={() => {setEditGalleryItem(item)}}
                    >
                        <svg><use href={`${Sprite}#edit`}/></svg>
                    </button>
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
            {
                editGalleryItem &&
                <ModalPopUp
                    closeModal={closeGalleryItemEditModal}
                    modalTitle={'Update tattoo styles for this image'}
                >
                    <UpdateGalleryItemForm
                        folder={'archivedGallery'}
                        activeStyle={activeStyle._id}
                        galleryItem={editGalleryItem}
                        styles={tattooStyles}
                        updateGalleryItem={updateGalleryItemCallBack}
                        closeModal={closeGalleryItemEditModal}
                    />
                </ModalPopUp>
            }
        </div>
    )
}
