import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { BookConsultationFormValues, TattooStyleType} from '../../types/Types'
import {
  getIsFetching,
  getTattooStylesSelector,
  getGallery,
  getTotalGalleryItemsCount,
  getGalleryPageSize,
  getCurrentGalleryPage,
  getIsGalleryItemDeletingInProcess,
  getActiveStyleSelector
} from '../../redux/Portfolio/portfolio-selectors'
import {
  getActualPortfolio,
  adminUpdateGallery,
  deleteGalleryItem,
  setGalleryPageSizeAC,
  setCurrentGalleryPageAC,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  archiveGalleryItem
} from '../../redux/Portfolio/portfolio-reducer'
import { Portfolio } from './Portfolio'
import {getAuthSelector} from '../../redux/Auth/auth-selectors'
import {getIsSuccessSelector} from '../../redux/bookedConsultations/bookedConsultations-selectors'
import {bookConsultation, setIsSuccessAC} from "../../redux/General/general-reducer";

export const PortfolioContainer: React.FC = () =>  {
  const isAuth = useSelector(getAuthSelector)
  const isFetching = useSelector(getIsFetching)
  const totalGalleryItemsCount = useSelector(getTotalGalleryItemsCount)
  const galleryPageSize = useSelector(getGalleryPageSize)
  const currentGalleryPage = useSelector(getCurrentGalleryPage)
  const isGalleryItemDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcess)
  const tattooStyles = useSelector(getTattooStylesSelector)
  const activeStyle = useSelector(getActiveStyleSelector)
  const gallery = useSelector(getGallery)
  const isSuccess = useSelector(getIsSuccessSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect( () => {
    dispatch(getActualPortfolio(activeStyle, currentGalleryPage, galleryPageSize)).then(r => {} )
  }, [activeStyle, currentGalleryPage, galleryPageSize])

  useEffect(() => {
    navigate(`?&style=${activeStyle.value}&page=${currentGalleryPage}&limit=${galleryPageSize}`)
  }, [activeStyle, currentGalleryPage, galleryPageSize])

  const setCurrentGalleryPageCallBack = (page) => {
    dispatch(setCurrentGalleryPageAC(page))
  }

  const setGalleryPageSizeCallBack = (galleryPageSize: number) => {
    dispatch(setGalleryPageSizeAC(galleryPageSize))
  }

  const bookConsultationCallBack = (values: BookConsultationFormValues) => {
    dispatch(bookConsultation(values))
  }

  const adminUpdateGalleryCallBack = (values: any) => {
    dispatch(adminUpdateGallery(activeStyle.value, values))
  }

  const deleteGalleryItemCallBack = (itemId: string) => {
    dispatch(deleteGalleryItem(itemId))
  }

  const resetActiveStyleCallBack = (style: TattooStyleType) => {
    dispatch(resetActiveStyle(style))
  }

  const addTattooStyleCallBack = (values: FormData) => {
    dispatch(addTattooStyle(values))
  }

  const editTattooStyleCallBack = (id: string, values: FormData) => {
    dispatch(editTattooStyle(id, values))
  }

  const deleteTattooStyleCallBack = (id: string) => {
    dispatch(deleteTattooStyle(id))
  }

  const archiveGalleryItemCallBack = (id: string) => {
    dispatch(archiveGalleryItem(id))
  }

  const setIsSuccessCallBack = (bol: boolean) => {
    dispatch(setIsSuccessAC(bol))
  }

  return (
    <Portfolio
      isAuth={isAuth}
      isFetching={isFetching}
      totalGalleryItemsCount={totalGalleryItemsCount}
      galleryPageSize={galleryPageSize}
      currentGalleryPage={currentGalleryPage}
      isGalleryItemDeletingInProcess={isGalleryItemDeletingInProcess}
      tattooStyles={tattooStyles}
      activeStyle={activeStyle}
      gallery={gallery}
      isSuccess={isSuccess}
      setGalleryPageSize={setGalleryPageSizeCallBack}
      bookConsultation={bookConsultationCallBack}
      updateGallery={adminUpdateGalleryCallBack}
      deleteGalleryItem={deleteGalleryItemCallBack}
      setCurrentGalleryPage={setCurrentGalleryPageCallBack}
      resetActiveStyle={resetActiveStyleCallBack}
      addTattooStyle={addTattooStyleCallBack}
      editTattooStyle={editTattooStyleCallBack}
      deleteTattooStyle={deleteTattooStyleCallBack}
      archiveGalleryItem={archiveGalleryItemCallBack}
      setIsSuccess={setIsSuccessCallBack}
    />
  )
}
