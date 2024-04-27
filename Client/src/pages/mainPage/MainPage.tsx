import * as React from "react";
import { MainOffer } from "../../components/MainPage/MainOffer";
import { PortfolioSlider } from "../../components/MainPage/PortfolioSlider";
import { About } from "../../components/MainPage/About";
import { Services } from "../../components/MainPage/Services";
import { FaqItems } from "../../components/MainPage/FaqItems";
import { Booking } from "../../components/MainPage/Booking";
import {
    BookConsultationFormValues,
    FaqType,
    PageType,
    ServiceType,
    TattooStyleType
} from "../../types/Types";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useEffect} from "react";
import {ApiErrorMessage} from "../../components/common/ApiErrorMessage";
import {Preloader} from "../../components/common/Preloader";
import {
  addFaqItem,
  addService, bookConsultation,
  changeAboutPageVisibility, deleteFaqItem, deleteService,
  editAboutPage, editService,
  getAboutPage,
  getFaqItems,
  getServices, setApiErrorAC, setSuccessModalAC,
  SuccessModalType, updateFaqItem
} from "../../redux/General/general-reducer";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector, getTokenSelector} from "../../redux/Auth/auth-selectors";
import {
  getFakeApiSelector,
  getGalleryPageSize,
  getTattooStylesSelector
} from "../../redux/Portfolio/portfolio-selectors";
import {
  getApiErrorSelector,
  getFaqItemsSelector,
  getIsGeneralFetchingSelector,
  getPageAboutSelector,
  getServicesSelector, getSuccessModalSelector
} from "../../redux/General/general-selectors";
import {getTattooStyles, setActiveStyleAC} from "../../redux/Portfolio/portfolio-reducer";

export const MainPage: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const galleryPageSize = useSelector(getGalleryPageSize);
  const tattooStyles = useSelector(getTattooStylesSelector);
  const services = useSelector(getServicesSelector);
  const faq = useSelector(getFaqItemsSelector);
  const pageAbout = useSelector(getPageAboutSelector);
  const isGeneralFetching = useSelector(getIsGeneralFetchingSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const fakeApi = useSelector(getFakeApiSelector);
  const token = useSelector(getTokenSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the URL contains a hash
    if (window.location.hash) {
      // Get the target element using the hash
      const targetElement = document.querySelector(window.location.hash);
      // Scroll to the target element
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    dispatch(getTattooStyles(token));
    dispatch(getServices());
    dispatch(getFaqItems());
    dispatch(getAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (successModal.isSuccess) {
        setTimeout( () => {
          dispatch(setSuccessModalAC(false, ''));;
        }, 3000);
    }
  }, [successModal]);

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

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(''));
  }

  return (
    <>
      { isGeneralFetching
          ? <Preloader />
          : <>
              <MainOffer bookConsultation={bookConsultationCallBack} />
              <PortfolioSlider
                  fakeApi={fakeApi}
                  galleryPageSize={galleryPageSize}
                  setActiveStyle={setActiveStyleCallBack}
                  tattooStyles={tattooStyles}
              />
              { (isAuth || pageAbout?.isActive) &&
                  <About
                      fakeApi={fakeApi}
                      isAuth={isAuth}
                      pageAbout={pageAbout}
                      editAboutPage={editAboutPageCallBack}
                      changeAboutPageVisibility={changeAboutPageVisibilityCallBack}
                      bookConsultation={bookConsultationCallBack}
                  />
              }

              <Services
                  fakeApi={fakeApi}
                  isAuth={isAuth}
                  services={services}
                  editService={editServiceCallBack}
                  addService={addServiceCallBack}
                  deleteService={deleteServiceCallBack}
              />
              <FaqItems
                  isAuth={isAuth}
                  faq={faq}
                  updateFaqItem={updateFaqItemCallBack}
                  addFaqItem={addFaqItemCallBack}
                  deleteFaqItem={deleteFaqItemCallBack}
              />
              <Booking consentId="consent3" bookConsultation={bookConsultationCallBack} />
          </>
      }
      <SuccessPopUp
          isOpen={successModal.isSuccess}
          closeModal={setSuccessModalCallBack}
          content={successModal.successText}
      />
      <ApiErrorMessage
          isOpen={!!apiError}
          error={apiError}
          closeModal={setApiErrorCallBack}
      />
    </>
  )
};
