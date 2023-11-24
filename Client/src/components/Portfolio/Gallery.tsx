import * as React from 'react'
import {useEffect, useState} from 'react'
import { Preloader } from '../common/Preloader'
import {GalleryItemType, TattooStyleType} from '../../types/Types'
import { ModalPopUp } from '../common/ModalPopUp'
import { AdminGalleryUploadFormFormik } from '../Forms/AdminGalleryUploadFormFormik'
import {SERVER_URL} from '../../utils/constants'
import { Tooltip } from 'react-tooltip'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import {Paginator} from '../common/Paginator'
import {SuccessPopUp} from "../common/SuccessPopUp";
import {setIsSuccessAC} from "../../redux/Portfolio/portfolio-reducer";
import {useDispatch} from "react-redux";
import {UpdateGalleryItemForm} from "../Forms/UpdateGalleryItemForm";

type PropsType = {
  isSuccess: boolean
  isAuth: boolean
  isFetching: boolean
  totalCount: number
  pageSize: number
  currentPage: number
  activeStyle: TattooStyleType
  gallery: Array<GalleryItemType>
  isDeletingInProcess: Array<string>
  tattooStyles: Array<TattooStyleType>
  updateGallery: (style: string, values: any) => void
  deleteGalleryItem: (itemId: string) => void
  setCurrentPage: (page: number) => void
  setPageSize: (limit: number) => void
  archiveGalleryItem: (id: string) => void
  setIsSuccess: (bol: boolean) => void
  updateGalleryItem: (id: string, values: object) => void
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
  isDeletingInProcess,
  tattooStyles,
  setCurrentPage,
  setPageSize,
  updateGallery,
  deleteGalleryItem,
  archiveGalleryItem,
  setIsSuccess,
  updateGalleryItem
}) => {
  //debugger

  let [bigImg, setBigImg] = useState('')
  const [ editGalleryMode, setEditGalleryMode] = useState(false)
  const [ editGalleryItem, setEditGalleryItem ] = useState(null)
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

  const closeGalleryItemEditModal = () => {
    setEditGalleryItem(null)
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout( () => {
        dispatch(setIsSuccessAC(false))
      }, 2000)
    }
  }, [isSuccess])

  const modalTitle = `Update you gallery for ${activeStyle.value}`

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
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Edit gallery item"
                  className={"btn btn--icon"}
                  onClick={() => {setEditGalleryItem(item)}}
              >
                  <svg><use href={`${Sprite}#edit`}/></svg>
              </button>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Move gallery item to archive"
                  className={"btn btn--icon"}
                  disabled={isDeletingInProcess?.some(id => id === item._id)}
                  onClick={() => {archiveGalleryItem(item._id)}}
              >
                  <svg><use href={`${Sprite}#archive`}/></svg>
              </button>
              <button
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Delete gallery item"
                  className={"btn btn--icon"}
                  disabled={isDeletingInProcess?.some(id => id === item._id)}
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
                    modalTitle={modalTitle}
                >
                    <AdminGalleryUploadFormFormik
                        activeStyle={activeStyle._id}
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
          editGalleryItem &&
          <ModalPopUp
              closeModal={closeGalleryItemEditModal}
              modalTitle={'Update tattoo styles for this image'}
          >
            <UpdateGalleryItemForm
                folder={'gallery'}
                galleryItem={editGalleryItem}
                styles={tattooStyles}
                updateGalleryItem={updateGalleryItem}
                closeModal={closeGalleryItemEditModal}
            />
          </ModalPopUp>
      }

      {
          isSuccess &&
          <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent}/>
      }
      <Tooltip id="my-tooltip" />
    </>
  )
})
