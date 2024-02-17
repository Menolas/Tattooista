import * as React from "react"
import { MainOffer } from "../../components/MainPage/MainOffer"
import { PortfolioSlider } from "../../components/MainPage/PortfolioSlider"
import { About } from "../../components/MainPage/About"
import { Services } from "../../components/MainPage/Services"
import { FaqItems } from "../../components/MainPage/FaqItems"
import { Booking } from "../../components/MainPage/Booking"
import {
    BookConsultationFormValues,
    FaqType,
    PageType,
    ServiceType,
    TattooStyleType
} from "../../types/Types"
import {SuccessPopUp} from "../../components/common/SuccessPopUp"
import {useEffect} from "react";
import {setIsSuccessAC} from "../../redux/Clients/clients-reducer"
import {useDispatch} from "react-redux"
import {ApiErrorMessage} from "../../components/common/ApiErrorMessage"
import {Preloader} from "../../components/common/Preloader"

type PropsType = {
  fakeApi: boolean
  isAuth: string
  galleryPageSize: number
  tattooStyles: Array<TattooStyleType>
  services: Array<ServiceType>
  faq: Array<FaqType>
  pageAbout: PageType
  isGeneralFetching: boolean
  isSuccess: boolean
  isSuccessBooking: boolean
  bookingConsultationApiError: string
  updateFaqItemApiError: string
  updateServiceApiError: string
  updatePageApiError: string
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
  setIsSuccess: (bol: boolean) => void
  setIsSuccessBooking: (bol: boolean) => void
  setBookingConsultationApiError: (error: string) => void
  setUpdateFaqItemApiError: (error: string) => void
  setUpdateServiceApiError: (error: string) => void
  setUpdatePageApiError: (error: string) => void
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
  isSuccess,
  isSuccessBooking,
  bookingConsultationApiError,
  updateFaqItemApiError,
  updateServiceApiError,
  updatePageApiError,
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
  setIsSuccess,
  setIsSuccessBooking,
  setBookingConsultationApiError,
  setUpdateFaqItemApiError,
  setUpdateServiceApiError,
  setUpdatePageApiError
}) => {

  const successBookingPopUpContent = "You've booked a consultation! We will contact you soon))"
  const successPopUpContent = "You successfully added a new item"


  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
        setTimeout( () => {
            dispatch(setIsSuccessAC(false))
        }, 1500)
    }
  }, [isSuccess])

  useEffect(() => {
        if (isSuccessBooking) {
            setTimeout( () => {
                setIsSuccessBooking(false)
            }, 1500)
        }
  }, [isSuccessBooking])

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
              { (isAuth || pageAbout.isActive) &&
                  <About
                      fakeApi={fakeApi}
                      isAuth={isAuth}
                      pageAbout={pageAbout}
                      editAboutPage={editAboutPage}
                      changeAboutPageVisibility={changeAboutPageVisibility}
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
              <Booking consentId="consent" bookConsultation={bookConsultation} />
          </>
      }
      { isSuccessBooking &&
        <SuccessPopUp closeModal={setIsSuccess} content={successBookingPopUpContent}/>
      }
      { isSuccess &&
        <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent} />
      }
      { bookingConsultationApiError && bookingConsultationApiError !== '' &&
        <ApiErrorMessage
            error={bookingConsultationApiError}
            closeModal={setBookingConsultationApiError}
        />
      }
      { updateFaqItemApiError && updateFaqItemApiError !== '' &&
        <ApiErrorMessage
            error={updateFaqItemApiError}
            closeModal={setUpdateFaqItemApiError}
        />
      }
      {
        updateServiceApiError && updateServiceApiError !== '' &&
            <ApiErrorMessage
                error={updateServiceApiError}
                closeModal={setUpdateServiceApiError}
            />
      }
      {
          updatePageApiError && updatePageApiError !== '' &&
        <ApiErrorMessage
            error={updatePageApiError}
            closeModal={setUpdatePageApiError}
        />
      }
    </>
  )
})
