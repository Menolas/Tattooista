import * as React from 'react'
import {useState} from 'react'
import { Preloader } from '../common/Preloader'
import {GalleryItemType, TattooStyleType} from '../../types/Types'
import { ModalPopUp } from '../common/ModalPopUp'
import { AdminGalleryUploadFormFormik } from '../Forms/AdminGalleryUploadFormFormik'
import {SERVER_URL} from '../../utils/constants'
import Sprite from '../../assets/svg/sprite.svg'
import {Paginator} from "../common/Paginator";
import {SuccessModal} from "../SuccessModal";

type PropsType = {
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
  setCurrentGalleryPage: (page: number) => void
  setPageLimit: (limit: number) => void
  archiveGalleryItem: (id: string) => void
}

export const Gallery: React.FC<PropsType> = React.memo(({
  isAuth,
  isFetching,
  activeStyle,
  totalCount,
  pageSize,
  currentPage,
  gallery,
  isGalleryItemDeletingInProcess,
  setCurrentGalleryPage,
  setPageLimit,
  updateGallery,
  deleteGalleryItem,
  archiveGalleryItem
}) => {
  //debugger

  let [bigImg, setBigImg] = useState('')
  const [ editGalleryMode, setEditGalleryMode] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const successModalTitle = ''

  const showSuccessModal = () => {
    setSuccess(true)
  }

  const closeSuccessModal = () => {
    setSuccess(false)
  }

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
              onPageChanged={setCurrentGalleryPage}
              setPageLimit={setPageLimit}
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
                        showSuccessModal={showSuccessModal}
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
                  <img src={`${SERVER_URL}gallery/${activeStyle.value}/${bigImg}`} alt={activeStyle.value} />
              </div>
            </div>
          }
          {
              isSuccess &&
              <ModalPopUp
                  modalTitle={successModalTitle}
                  closeModal={closeSuccessModal}
              >
                <SuccessModal />
              </ModalPopUp>
          }
        </section>
      )}
    </>
  )
})
