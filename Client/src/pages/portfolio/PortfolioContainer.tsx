import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { BookConsultationFormValues, TattooStyleType} from '../../types/Types'
import {
  getIsFetching,
  getTattooStylesSelector,
  getGallery,
  getTotalGalleryItemsCount,
  getGalleryPageSize,
  getCurrentGalleryPage,
  getIsGalleryItemDeletingInProcessSelector,
  getActiveStyleSelector, getUpdateTattooStyleApiErrorSelector, getUpdateGalleryApiErrorSelector
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
  archiveGalleryItem,
  getTattooStyles,
  setUpdateTattooStyleApiErrorAC, setUpdateGalleryApiErrorAC, updateGalleryItem
} from '../../redux/Portfolio/portfolio-reducer'
import { Portfolio } from './Portfolio'
import {getAuthSelector} from '../../redux/Auth/auth-selectors'
import {getIsSuccessSelector} from '../../redux/bookedConsultations/bookedConsultations-selectors'
import {
  bookConsultation,
  setBookingConsultationApiErrorAC,
  setIsSuccessAC
} from "../../redux/General/general-reducer";
import {
  getBookingConsultationApiErrorSelector
} from "../../redux/General/general-selectors";

export const PortfolioContainer: React.FC = () =>  {
  const isAuth = useSelector(getAuthSelector)
  const isFetching = useSelector(getIsFetching)
  const totalCount = useSelector(getTotalGalleryItemsCount)
  const pageSize = useSelector(getGalleryPageSize)
  let currentPage = useSelector(getCurrentGalleryPage)
  const isDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector)
  const tattooStyles = useSelector(getTattooStylesSelector)
  const activeStyle = useSelector(getActiveStyleSelector)
  const gallery = useSelector(getGallery)
  const isSuccess = useSelector(getIsSuccessSelector)
  const bookingConsultationApiError = useSelector(getBookingConsultationApiErrorSelector)
  const updateTattooStyleApiError = useSelector(getUpdateTattooStyleApiErrorSelector)
  const updateGalleryApiError = useSelector(getUpdateGalleryApiErrorSelector)

  const dispatch = useDispatch()
  //const navigate = useNavigate()

  useEffect( () => {
    if (currentPage === 0) {
      currentPage = 1
    }
    dispatch(getTattooStyles())
    dispatch(getActualPortfolio(activeStyle, currentPage, pageSize))
  }, [activeStyle, currentPage, pageSize])

  // useEffect(() => {
  //   navigate(`?&style=${activeStyle.value}&page=${currentPage}&limit=${pageSize}`)
  // }, [activeStyle, currentPage, pageSize])

  const setCurrentPageCallBack = (page: number) => {
    dispatch(setCurrentGalleryPageAC(page))
  }

  const setGalleryPageSizeCallBack = (pageSize: number) => {
    dispatch(setGalleryPageSizeAC(pageSize))
  }

  const bookConsultationCallBack = (values: BookConsultationFormValues) => {
    dispatch(bookConsultation(values))
  }

  const adminUpdateGalleryCallBack = (style: string, values: any) => {
    dispatch(adminUpdateGallery(style, values))
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

  const setBookingConsultationApiErrorCallBack = (error: string) => {
    dispatch(setBookingConsultationApiErrorAC(error))
  }

  const setUpdateTattooStyleApiErrorCallBack = (error: string) => {
    dispatch(setUpdateTattooStyleApiErrorAC(error))
  }

  const setUpdateGalleryApiErrorCallBack = (error: string) => {
    dispatch(setUpdateGalleryApiErrorAC(error))
  }

  const updateGalleryItemCallBack = (id: string, values: object, activeStyle: string) => {
    dispatch(updateGalleryItem(id, values, activeStyle))
  }

  return (
    <Portfolio
      isAuth={isAuth}
      isFetching={isFetching}
      totalCount={totalCount}
      pageSize={pageSize}
      currentPage={currentPage}
      isDeletingInProcess={isDeletingInProcess}
      tattooStyles={tattooStyles}
      activeStyle={activeStyle}
      gallery={gallery}
      isSuccess={isSuccess}
      bookingConsultationApiError={bookingConsultationApiError}
      updateTattooStyleApiError={updateTattooStyleApiError}
      updateGalleryApiError={updateGalleryApiError}
      setPageSize={setGalleryPageSizeCallBack}
      bookConsultation={bookConsultationCallBack}
      updateGallery={adminUpdateGalleryCallBack}
      deleteGalleryItem={deleteGalleryItemCallBack}
      setCurrentPage={setCurrentPageCallBack}
      resetActiveStyle={resetActiveStyleCallBack}
      addTattooStyle={addTattooStyleCallBack}
      editTattooStyle={editTattooStyleCallBack}
      deleteTattooStyle={deleteTattooStyleCallBack}
      archiveGalleryItem={archiveGalleryItemCallBack}
      setIsSuccess={setIsSuccessCallBack}
      setBookingConsultationApiError={setBookingConsultationApiErrorCallBack}
      setUpdateTattooStyleApiError={setUpdateTattooStyleApiErrorCallBack}
      setUpdateGalleryApiError={setUpdateGalleryApiErrorCallBack}
      updateGalleryItem={updateGalleryItemCallBack}
    />
  )
}
