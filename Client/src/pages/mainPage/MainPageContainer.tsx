import * as React from "react";
import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainPage } from "./MainPage";
import {BookConsultationFormValues, FaqType, ServiceType, TattooStyleType} from "../../types/Types";
import {
  getBookingConsultationApiErrorSelector,
  getFaqItemsSelector,
  getIsGeneralFetchingSelector,
  getSuccessModalSelector,
  getPageAboutSelector, getServiceSelector,
  getServicesSelector,
  getUpdateFaqItemApiErrorSelector,
  getUpdatePageApiErrorSelector,
  getUpdateServiceApiErrorSelector
} from "../../redux/General/general-selectors";
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
  setSuccessModalAC,
  setBookingConsultationApiErrorAC,
  setUpdateFaqItemApiErrorAC,
  setUpdateServiceApiErrorAC,
  setUpdatePageApiErrorAC,
  setServiceAC,
} from "../../redux/General/general-reducer";
import { getTattooStyles, setActiveStyleAC } from "../../redux/Portfolio/portfolio-reducer";
import {
  getFakeApiSelector,
  getGalleryPageSize,
  getTattooStylesSelector
} from "../../redux/Portfolio/portfolio-selectors";
import {getAuthSelector} from "../../redux/Auth/auth-selectors";

export const MainPageContainer: React.FC = () =>  {

  const isAuth = useSelector(getAuthSelector);
  const galleryPageSize = useSelector(getGalleryPageSize);
  const tattooStyles = useSelector(getTattooStylesSelector);
  const services = useSelector(getServicesSelector);
  const service = useSelector(getServiceSelector);
  const faq = useSelector(getFaqItemsSelector);
  const pageAbout = useSelector(getPageAboutSelector);
  const isGeneralFetching = useSelector(getIsGeneralFetchingSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const bookingConsultationApiError = useSelector(getBookingConsultationApiErrorSelector);
  const updateFaqItemApiError = useSelector(getUpdateFaqItemApiErrorSelector);
  const updateServiceApiError = useSelector(getUpdateServiceApiErrorSelector);
  const updatePageApiError = useSelector(getUpdatePageApiErrorSelector);
  const fakeApi = useSelector(getFakeApiSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTattooStyles());
    dispatch(getServices());
    dispatch(getFaqItems());
    dispatch(getAboutPage());
  }, []);

  const setActiveStyleCallBack = (style: TattooStyleType) => {
    dispatch(setActiveStyleAC(style));
  }

  const editAboutPageCallBack = (values: FormData) => {
    dispatch(editAboutPage(values));
  }

  const changeAboutPageVisibilityCallBack = (isActive: boolean) => {
    dispatch(changeAboutPageVisibility(isActive));
  }

  const editServiceCallBack = (id: string, values: FormData) => {
    dispatch(editService(id, values));
  }

  const addServiceCallBack = (values: FormData) => {
    dispatch(addService(values));
  }

  const deleteServiceCallBack = (id: string) => {
    dispatch(deleteService(id));
  }

  const setServiceCallBack = (service: ServiceType) => {
    dispatch(setServiceAC(service));
  }

  const addFaqItemCallBack = (values: FaqType) => {
    dispatch(addFaqItem(values));
  }

  const updateFaqItemCallBack = (id: string, values: any) => {
    dispatch(updateFaqItem(id, values));
  }

  const deleteFaqItemCallBack = (id: string) => {
    dispatch(deleteFaqItem(id));
  }

  const bookConsultationCallBack = (values: BookConsultationFormValues) => {
    dispatch(bookConsultation(values));
  }

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  const setBookingConsultationApiErrorCallBack = (error: string) => {
    dispatch(setBookingConsultationApiErrorAC(error));
  }

  const setUpdateFaqItemApiErrorCallBack = (error: string) => {
    dispatch(setUpdateFaqItemApiErrorAC(error));
  }

  const setUpdateServiceApiErrorCallBack = (error: string) => {
    dispatch(setUpdateServiceApiErrorAC(error));
  }

  const setUpdatePageApiErrorCallBack = (error: string) => {
    dispatch(setUpdatePageApiErrorAC(error));
  }

  return (
         <MainPage
          fakeApi={fakeApi}
          isAuth={isAuth}
          galleryPageSize={galleryPageSize}
          tattooStyles={tattooStyles}
          services={services}
          service={service}
          faq={faq}
          pageAbout={pageAbout}
          isGeneralFetching={isGeneralFetching}
          successModal={successModal}
          updateFaqItemApiError={updateFaqItemApiError}
          updateServiceApiError={updateServiceApiError}
          updatePageApiError={updatePageApiError}
          setActiveStyle={setActiveStyleCallBack}
          editAboutPage={editAboutPageCallBack}
          changeAboutPageVisibility={changeAboutPageVisibilityCallBack}
          editService={editServiceCallBack}
          addService={addServiceCallBack}
          deleteService={deleteServiceCallBack}
          setService={setServiceCallBack}
          addFaqItem={addFaqItemCallBack}
          updateFaqItem={updateFaqItemCallBack}
          deleteFaqItem={deleteFaqItemCallBack}
          bookConsultation={bookConsultationCallBack}
          setSuccessModal={setSuccessModalCallBack}
          bookingConsultationApiError={bookingConsultationApiError}
          setBookingConsultationApiError={setBookingConsultationApiErrorCallBack}
          setUpdateFaqItemApiError={setUpdateFaqItemApiErrorCallBack}
          setUpdateServiceApiError={setUpdateServiceApiErrorCallBack}
          setUpdatePageApiError={setUpdatePageApiErrorCallBack}
      />
  )
}
