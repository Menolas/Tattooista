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
  const totalCount = useSelector(getTotalGalleryItemsCount)
  const pageSize = useSelector(getGalleryPageSize)
  let currentPage = useSelector(getCurrentGalleryPage)
  const isDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector)
  const tattooStyles = useSelector(getTattooStylesSelector)
  const activeStyle = useSelector(getActiveStyleSelector)
  const gallery = useSelector(getGallery)
  const isSuccess = useSelector(getIsSuccessSelector)

  const dispatch = useDispatch()
  //const navigate = useNavigate()

  useEffect( () => {
    if (currentPage === 0) {
      currentPage = 1
    }
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
      totalCount={totalCount}
      pageSize={pageSize}
      currentPage={currentPage}
      isDeletingInProcess={isDeletingInProcess}
      tattooStyles={tattooStyles}
      activeStyle={activeStyle}
      gallery={gallery}
      isSuccess={isSuccess}
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
    />
  )
}
