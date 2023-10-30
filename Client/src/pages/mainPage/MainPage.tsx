import * as React from 'react'
import { MainOffer } from '../../components/MainPage/MainOffer'
import { PortfolioSlider } from '../../components/MainPage/PortfolioSlider'
import { About } from '../../components/MainPage/About'
import { Services } from '../../components/MainPage/Services'
import { FaqItems } from '../../components/MainPage/FaqItems'
import { Booking } from '../../components/MainPage/Booking'
import {
    BookConsultationFormValues,
    FaqType,
    PageType,
    ServiceType,
    TattooStyleType
} from "../../types/Types";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useEffect} from "react";
import {setIsSuccessAC} from "../../redux/Clients/clients-reducer";
import {useDispatch} from "react-redux";
import {setIsSuccessBookingAC} from "../../redux/General/general-reducer";
import {ModalPopUp} from "../../components/common/ModalPopUp";
import {BookingApiError} from "../../components/common/BookindApiError";

type PropsType = {
  isAuth: boolean
  galleryPageSize: number
  tattooStyles: Array<TattooStyleType>
  services: Array<ServiceType>
  faq: Array<FaqType>
  pages: Array<PageType>
  isSuccess: boolean
  isSuccessBooking: boolean
  bookingConsultationApiError: string
  updateFaqItemApiError: string
  setActiveStyle: (style: TattooStyleType) => void
  editAboutPage: (id: string, values: FormData) => void
  changePageVisibility: (pageId: string, isActive: boolean) => void
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
}

export const MainPage: React.FC<PropsType> = React.memo(({
  isAuth,
  galleryPageSize,
  tattooStyles,
  services,
  faq,
  pages,
  isSuccess,
  isSuccessBooking,
  bookingConsultationApiError,
  updateFaqItemApiError,
  setActiveStyle,
  editAboutPage,
  changePageVisibility,
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
  setUpdateFaqItemApiError
}) => {
  const pageAbout = pages?.find(page => page.name === 'about')
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

  useEffect(() => {
    if (bookingConsultationApiError) {
        setTimeout( () => {
            setBookingConsultationApiError('')
        }, 1500)
    }
  }, [bookingConsultationApiError])

  useEffect(() => {
    if (updateFaqItemApiError) {
      setTimeout( () => {
          setUpdateFaqItemApiError('')
      }, 1500)
    }
  }, [updateFaqItemApiError])


  return (
    <>
      <MainOffer bookConsultation={bookConsultation} />
      <PortfolioSlider
          galleryPageSize={galleryPageSize}
          setActiveStyle={setActiveStyle}
          tattooStyles={tattooStyles}
      />
      <About
          isAuth={isAuth}
          pageAbout={pageAbout}
          editAboutPage={editAboutPage}
          changePageVisibility={changePageVisibility}
      />
      <Services
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
      { isSuccessBooking &&
        <SuccessPopUp closeModal={setIsSuccess} content={successBookingPopUpContent}/>
      }
      { isSuccess &&
        <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent} />
      }
      { bookingConsultationApiError && bookingConsultationApiError !== '' &&
        <BookingApiError error={bookingConsultationApiError}/>
      }
      { updateFaqItemApiError && updateFaqItemApiError !== '' &&
        <BookingApiError error={updateFaqItemApiError}/>
      }
    </>
  )
})
