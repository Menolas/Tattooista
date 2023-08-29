import * as React from 'react'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {AddCustomerFormValues, TattooStyleType} from '../../types/Types'
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
import {addCustomer} from '../../redux/Customers/customers-reducer'
import { Portfolio } from './Portfolio'
import {getAuthSelector} from "../../redux/Auth/auth-selectors";

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

  const setPageLimitCallBack = (galleryPageSize: number) => {
    dispatch(setGalleryPageSizeAC(galleryPageSize))
  }

  const addCustomerCallBack = (values: AddCustomerFormValues) => {
    dispatch(addCustomer(values))
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
      setPageLimit={setPageLimitCallBack}
      addCustomer={addCustomerCallBack}
      updateGallery={adminUpdateGalleryCallBack}
      deleteGalleryItem={deleteGalleryItemCallBack}
      setCurrentGalleryPage={setCurrentGalleryPageCallBack}
      resetActiveStyle={resetActiveStyleCallBack}
      addTattooStyle={addTattooStyleCallBack}
      editTattooStyle={editTattooStyleCallBack}
      deleteTattooStyle={deleteTattooStyleCallBack}
      archiveGalleryItem={archiveGalleryItemCallBack}
    />
  )
}
