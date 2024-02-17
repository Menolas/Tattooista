import * as React from "react"
import {useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { MainPage } from "./MainPage"
import { BookConsultationFormValues, FaqType, TattooStyleType} from "../../types/Types"
import {
  getBookingConsultationApiErrorSelector,
  getFaqItemsSelector,
  getIsGeneralFetchingSelector,
  getIsSuccessBookingSelector,
  getPageAboutSelector,
  getServicesSelector,
  getUpdateFaqItemApiErrorSelector,
  getUpdatePageApiErrorSelector,
  getUpdateServiceApiErrorSelector
} from '../../redux/General/general-selectors'
import {
  getFaqItems,
  getAboutPage,
  getServices,
  editAboutPage,
  changeAboutPageVisibility,
  editService,
  addService,
  deleteService,
  updateFaqItem,
  addFaqItem,
  deleteFaqItem,
  bookConsultation,
  setIsSuccessAC,
  setIsSuccessBookingAC,
  setBookingConsultationApiErrorAC,
  setUpdateFaqItemApiErrorAC,
  setUpdateServiceApiErrorAC,
  setUpdatePageApiErrorAC
} from "../../redux/General/general-reducer"
import { getTattooStyles, setActiveStyleAC } from "../../redux/Portfolio/portfolio-reducer"
import {
  getFakeApiSelector,
  getGalleryPageSize,
  getTattooStylesSelector
} from "../../redux/Portfolio/portfolio-selectors"
import {getAuthSelector, getRolesSelector} from "../../redux/Auth/auth-selectors"
import {getIsSuccessSelector} from "../../redux/General/general-selectors"

export const MainPageContainer: React.FC = () =>  {

  const roles = useSelector(getRolesSelector)
  const isAuth = useSelector(getAuthSelector)
  const galleryPageSize = useSelector(getGalleryPageSize)
  const tattooStyles = useSelector(getTattooStylesSelector)
  const services = useSelector(getServicesSelector)
  const faq = useSelector(getFaqItemsSelector)
  const pageAbout = useSelector(getPageAboutSelector)
  const isGeneralFetching = useSelector(getIsGeneralFetchingSelector)
  const isSuccess = useSelector(getIsSuccessSelector)
  const isSuccessBooking = useSelector(getIsSuccessBookingSelector)
  const bookingConsultationApiError = useSelector(getBookingConsultationApiErrorSelector)
  const updateFaqItemApiError = useSelector(getUpdateFaqItemApiErrorSelector)
  const updateServiceApiError = useSelector(getUpdateServiceApiErrorSelector)
  const updatePageApiError = useSelector(getUpdatePageApiErrorSelector)
  const fakeApi = useSelector(getFakeApiSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTattooStyles())
    dispatch(getServices())
    dispatch(getFaqItems())
    dispatch(getAboutPage())
  }, [])

  const setActiveStyleCallBack = (style: TattooStyleType) => {
    dispatch(setActiveStyleAC(style))
  }

  const editAboutPageCallBack = (values: FormData) => {
    dispatch(editAboutPage(values))
  }

  const changeAboutPageVisibilityCallBack = (isActive: boolean) => {
    dispatch(changeAboutPageVisibility(isActive))
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

  const setUpdateServiceApiErrorCallBack = (error: string) => {
    dispatch(setUpdateServiceApiErrorAC(error))
  }

  const setUpdatePageApiErrorCallBack = (error: string) => {
    dispatch(setUpdatePageApiErrorAC(error))
  }

  return (
         <MainPage
          fakeApi={fakeApi}
          isAuth={isAuth}
          galleryPageSize={galleryPageSize}
          tattooStyles={tattooStyles}
          services={services}
          faq={faq}
          pageAbout={pageAbout}
          isGeneralFetching={isGeneralFetching}
          isSuccess={isSuccess}
          isSuccessBooking={isSuccessBooking}
          updateFaqItemApiError={updateFaqItemApiError}
          updateServiceApiError={updateServiceApiError}
          updatePageApiError={updatePageApiError}
          setActiveStyle={setActiveStyleCallBack}
          editAboutPage={editAboutPageCallBack}
          changeAboutPageVisibility={changeAboutPageVisibilityCallBack}
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
          setUpdateServiceApiError={setUpdateServiceApiErrorCallBack}
          setUpdatePageApiError={setUpdatePageApiErrorCallBack}
      />
  )
}
