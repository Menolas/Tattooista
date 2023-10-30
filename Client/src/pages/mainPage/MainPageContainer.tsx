import * as React from 'react'
import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MainPage } from './MainPage'
import { BookConsultationFormValues, FaqType, TattooStyleType} from '../../types/Types'
import {
  getBookingConsultationApiErrorSelector,
  getFaqItemsSelector,
  getIsSuccessBookingSelector,
  getPagesSelector,
  getServicesSelector,
  getUpdateFaqItemApiErrorSelector
} from '../../redux/General/general-selectors'
import {
  getFaqItems,
  getPages,
  getServices,
  editAboutPage,
  changePageVisibility,
  editService,
  addService,
  deleteService,
  updateFaqItem,
  addFaqItem,
  deleteFaqItem,
  bookConsultation,
  setIsSuccessAC,
  setIsSuccessBookingAC, setBookingConsultationApiErrorAC, setUpdateFaqItemApiErrorAC
} from '../../redux/General/general-reducer'
import { getTattooStyles, setActiveStyleAC } from '../../redux/Portfolio/portfolio-reducer'
import {getGalleryPageSize, getTattooStylesSelector} from '../../redux/Portfolio/portfolio-selectors'
import {getAuthSelector} from "../../redux/Auth/auth-selectors";
import {getIsSuccessSelector} from '../../redux/General/general-selectors'

export const MainPageContainer: React.FC = () =>  {
  const isAuth = useSelector(getAuthSelector)
  const galleryPageSize = useSelector(getGalleryPageSize)
  const tattooStyles = useSelector(getTattooStylesSelector)
  const services = useSelector(getServicesSelector)
  const faq = useSelector(getFaqItemsSelector)
  const pages = useSelector(getPagesSelector)
  const isSuccess = useSelector(getIsSuccessSelector)
  const isSuccessBooking = useSelector(getIsSuccessBookingSelector)
  const bookingConsultationApiError = useSelector(getBookingConsultationApiErrorSelector)
  const updateFaqItemApiError = useSelector(getUpdateFaqItemApiErrorSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTattooStyles())
    dispatch(getServices())
    dispatch(getFaqItems())
    dispatch(getPages())
  }, [])

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

  const bookConsultationCallBack = (values: BookConsultationFormValues) => {
    dispatch(bookConsultation(values))
  }

  const setIsSuccessCallBack = (bol: boolean) => {
    dispatch(setIsSuccessAC(bol))
  }

  const setIsSuccessBookingCallBack = (bol: boolean) => {
    dispatch(setIsSuccessBookingAC(bol))
  }

  const setBookingConsultationApiErrorCallBack = (error: string) => {
    dispatch(setBookingConsultationApiErrorAC(error))
  }

  const setUpdateFaqItemApiErrorCallBack = (error: string) => {
    dispatch(setUpdateFaqItemApiErrorAC(error))
  }

  return (
    <MainPage
      isAuth={isAuth}
      galleryPageSize={galleryPageSize}
      tattooStyles={tattooStyles}
      services={services}
      faq={faq}
      pages={pages}
      isSuccess={isSuccess}
      isSuccessBooking={isSuccessBooking}
      updateFaqItemApiError={updateFaqItemApiError}
      setActiveStyle={setActiveStyleCallBack}
      editAboutPage={editAboutPageCallBack}
      changePageVisibility={changePageVisibilityCallBack}
      editService={editServiceCallBack}
      addService={addServiceCallBack}
      deleteService={deleteServiceCallBack}
      addFaqItem={addFaqItemCallBack}
      updateFaqItem={updateFaqItemCallBack}
      deleteFaqItem={deleteFaqItemCallBack}
      bookConsultation={bookConsultationCallBack}
      setIsSuccess={setIsSuccessCallBack}
      setIsSuccessBooking={setIsSuccessBookingCallBack}
      bookingConsultationApiError={bookingConsultationApiError}
      setBookingConsultationApiError={setBookingConsultationApiErrorCallBack}
      setUpdateFaqItemApiError={setUpdateFaqItemApiErrorCallBack}
    />
  )
}
