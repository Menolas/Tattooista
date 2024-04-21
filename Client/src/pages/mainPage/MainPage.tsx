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
import {SuccessModalType} from "../../redux/General/general-reducer";

type PropsType = {
  fakeApi: boolean
  isAuth: string
  galleryPageSize: number
  tattooStyles: Array<TattooStyleType>
  services: Array<ServiceType>
  faq: Array<FaqType>
  pageAbout: PageType
  isGeneralFetching: boolean
  successModal: SuccessModalType
  apiError: string
  setActiveStyle: (style: TattooStyleType) => void
  editAboutPage: (values: FormData) => void
  changeAboutPageVisibility: (isActive: boolean) => void
  editService: (id: string, values: FormData) => void
  addService: (values: FormData) => void
  deleteService: (id: string) => void
  updateFaqItem: (id: string, values: any) => void
  addFaqItem: (values: FaqType) => void
  deleteFaqItem: (id: string) => void
  bookConsultation: (values: BookConsultationFormValues) => void
  setSuccessModal: () => void
  setApiError: () => void
}

export const MainPage: React.FC<PropsType> = React.memo(({
  fakeApi,
  isAuth,
  galleryPageSize,
  tattooStyles,
  services,
  faq,
  pageAbout,
  isGeneralFetching,
  successModal,
  apiError,
  setActiveStyle,
  editAboutPage,
  changeAboutPageVisibility,
  editService,
  addService,
  deleteService,
  updateFaqItem,
  addFaqItem,
  deleteFaqItem,
  bookConsultation,
  setSuccessModal,
  setApiError,
}) => {

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
  }, [])

  useEffect(() => {
    if (successModal.isSuccess) {
        setTimeout( () => {
          setSuccessModal();
        }, 3000);
    }
  }, [setSuccessModal, successModal]);

  return (
    <>
      { isGeneralFetching
          ? <Preloader />
          : <>
              <MainOffer bookConsultation={bookConsultation} />
              <PortfolioSlider
                  fakeApi={fakeApi}
                  galleryPageSize={galleryPageSize}
                  setActiveStyle={setActiveStyle}
                  tattooStyles={tattooStyles}
              />
              { (isAuth || pageAbout?.isActive) &&
                  <About
                      fakeApi={fakeApi}
                      isAuth={isAuth}
                      pageAbout={pageAbout}
                      editAboutPage={editAboutPage}
                      changeAboutPageVisibility={changeAboutPageVisibility}
                      bookConsultation={bookConsultation}
                  />
              }

              <Services
                  fakeApi={fakeApi}
                  isAuth={isAuth}
                  services={services}
                  editService={editService}
                  addService={addService}
                  deleteService={deleteService}
              />
              <FaqItems
                  isAuth={isAuth}
                  faq={faq}
                  updateFaqItem={updateFaqItem}
                  addFaqItem={addFaqItem}
                  deleteFaqItem={deleteFaqItem}
              />
              <Booking consentId="consent3" bookConsultation={bookConsultation} />
          </>
      }
      <SuccessPopUp
          isOpen={successModal.isSuccess}
          closeModal={setSuccessModal}
          content={successModal.successText}
      />
      <ApiErrorMessage
          isOpen={!!apiError}
          error={apiError}
          closeModal={setApiError}
      />
    </>
  )
})
