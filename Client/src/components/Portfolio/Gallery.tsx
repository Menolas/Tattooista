import * as React from 'react'
import {useEffect, useState} from 'react'
import { Preloader } from '../common/Preloader'
import {GalleryItemType, TattooStyleType} from '../../types/Types'
import { ModalPopUp } from '../common/ModalPopUp'
import { AdminGalleryUploadFormFormik } from '../Forms/AdminGalleryUploadFormFormik'
import {SERVER_URL} from '../../utils/constants'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import {Paginator} from '../common/Paginator'
import {SuccessPopUp} from "../common/SuccessPopUp";
import {setIsSuccessAC} from "../../redux/Portfolio/portfolio-reducer";
import {useDispatch} from "react-redux";

type PropsType = {
  isSuccess: boolean
  isAuth: boolean
  isFetching: boolean
  totalCount: number
  pageSize: number
  currentPage: number
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  isGalleryItemDeletingInProcess: Array<string>
  updateGallery: (values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentPage: (page: number) => void
  setPageSize: (limit: number) => void
  archiveGalleryItem: (id: string) => void
  setIsSuccess: (bol: boolean) => void
}

export const Gallery: React.FC<PropsType> = React.memo(({
  isSuccess,
  isAuth,
  isFetching,
  activeStyle,
  totalCount,
  pageSize,
  currentPage,
  gallery,
  isGalleryItemDeletingInProcess,
  setCurrentPage,
  setPageSize,
  updateGallery,
  deleteGalleryItem,
  archiveGalleryItem,
  setIsSuccess
}) => {
  //debugger

  let [bigImg, setBigImg] = useState('')
  const [ editGalleryMode, setEditGalleryMode] = useState(false)
  const successPopUpContent = `You successfully added images to ${activeStyle.value} style gallery`

  const dispatch = useDispatch()

  const showBigImg = (fileName) => {
    if (!bigImg) {
      setBigImg(fileName)
    }
  }

  const closeBigImg = () => {
    setBigImg('')
  }

  const openEditGalleryForm = () => {
    setEditGalleryMode(true)
  }

  const closeEditGalleryForm = () => {
    setEditGalleryMode(false)
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout( () => {
        dispatch(setIsSuccessAC(false))
      }, 2000)
    }
  }, [isSuccess])

  const GalleryItemsArray = gallery?.map(item => {
    return (
        <li
            key={item._id}
            className="gallery__item"
        >
          <div
            className={"gallery__img-wrap"}
            onClick={() => { showBigImg(item.fileName) }}
            style={{ backgroundImage: `url(${SERVER_URL}gallery/${item.fileName})` }}
          >
            {''}
          </div>
          {isAuth &&
            <div className={"gallery__item-actions"}>
              <button
                  className={"btn btn--icon"}
                //onClick={() => {deleteGalleryItem(item.fileName)}}
              >
                  <svg><use href={`${Sprite}#edit`}/></svg>
              </button>
              <button
                  className={"btn btn--icon"}
                  onClick={() => {archiveGalleryItem(item._id)}}
              >
                  <svg><use href={`${Sprite}#archive`}/></svg>
              </button>
              <button
                  className={"btn btn--icon"}
                  onClick={() => {deleteGalleryItem(item._id)}}
              >
                  <svg><use href={`${Sprite}#trash`}/></svg>
              </button>
            </div>
          }
        </li>
    )
  })

  return (
    <>
      { isFetching ? <Preloader/> :  (
        <section className="gallery page-block">
          <div className={"gallery__header"}>
            <Paginator
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChanged={setCurrentPage}
              setPageLimit={setPageSize}
            />
            { isAuth &&
                <button
                    className={"btn btn--light-bg btn--sm"}
                    onClick={openEditGalleryForm}
                >
                    Add Tattoos
                </button>
            }
            { editGalleryMode &&
                <ModalPopUp
                    closeModal={closeEditGalleryForm}
                >
                    <AdminGalleryUploadFormFormik
                        activeStyle={activeStyle.value}
                        updateGallery={updateGallery}
                        closeModal={closeEditGalleryForm}
                    />
                </ModalPopUp>
            }
          </div>
          <ul className="gallery__list list">
            { GalleryItemsArray }
          </ul>
          {
            bigImg &&
            <div className="gallery__large-wrap modal-wrap">
              <div className="gallery__large">
                  <button
                      className="close-btn gallery__item-close-btn"
                      onClick={() => { closeBigImg() }}>
                    {''}
                  </button>
                  <img src={`${SERVER_URL}gallery/${bigImg}`} alt={activeStyle.value} />
              </div>
            </div>
          }
        </section>
      )}
      {
          isSuccess &&
          <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent}/>
      }
    </>
  )
})
