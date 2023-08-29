import * as React from 'react'
import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MainPage } from './MainPage'
import {AddCustomerFormValues, FaqType, TattooStyleType} from '../../types/Types'
import { addCustomer } from '../../redux/Customers/customers-reducer'
import { getFaqItemsSelector, getPagesSelector, getServicesSelector } from '../../redux/MainPage/mainPage-selectors'
import {
  getFaqItems,
  getPages,
  getServices,
  editAboutPage,
  changePageVisibility,
  editService,
  addService, deleteService, updateFaqItem, addFaqItem, deleteFaqItem
} from '../../redux/MainPage/mainPage-reducer'
import { getTattooStyles, setActiveStyleAC } from '../../redux/Portfolio/portfolio-reducer'
import {getGalleryPageSize, getTattooStylesSelector} from '../../redux/Portfolio/portfolio-selectors'
import {getAuthSelector} from "../../redux/Auth/auth-selectors";

export const MainPageContainer: React.FC = () =>  {
  const isAuth = useSelector(getAuthSelector)
  const galleryPageSize = useSelector(getGalleryPageSize)
  const tattooStyles = useSelector(getTattooStylesSelector)
  const services = useSelector(getServicesSelector)
  const faq = useSelector(getFaqItemsSelector)
  const pages = useSelector(getPagesSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTattooStyles())
    dispatch(getServices())
    dispatch(getFaqItems())
    dispatch(getPages())
  }, [])

  const addCustomerCallBack = (values: AddCustomerFormValues) => {
    dispatch(addCustomer(values))
  }

  const setActiveStyleCallBack = (style: TattooStyleType) => {
    dispatch(setActiveStyleAC(style))
  }

  const editAboutPageCallBack = (id: string, values: FormData) => {
    dispatch(editAboutPage(id, values))
  }

  const changePageVisibilityCallBack = (pageId: string, isActive: boolean) => {
    dispatch(changePageVisibility(pageId, isActive))
  }

  const editServiceCallBack = (id: string, values: FormData) => {
    dispatch(editService(id, values))
  }

  const addServiceCallBack = (values: FormData) => {
    dispatch(addService(values))
  }

  const deleteServiceCallBack = (id: string) => {
    dispatch(deleteService(id))
  }

  const addFaqItemCallBack = (values: FaqType) => {
    dispatch(addFaqItem(values))
  }

  const updateFaqItemCallBack = (id: string, values: any) => {
    dispatch(updateFaqItem(id, values))
  }

  const deleteFaqItemCallBack = (id: string) => {
    dispatch(deleteFaqItem(id))
  }

  return (
    <MainPage
      isAuth={isAuth}
      galleryPageSize={galleryPageSize}
      tattooStyles={tattooStyles}
      services={services}
      faq={faq}
      pages={pages}
      addCustomer={addCustomerCallBack}
      setActiveStyle={setActiveStyleCallBack}
      editAboutPage={editAboutPageCallBack}
      changePageVisibility={changePageVisibilityCallBack}
      editService={editServiceCallBack}
      addService={addServiceCallBack}
      deleteService={deleteServiceCallBack}
      addFaqItem={addFaqItemCallBack}
      updateFaqItem={updateFaqItemCallBack}
      deleteFaqItem={deleteFaqItemCallBack}
    />
  )
}
