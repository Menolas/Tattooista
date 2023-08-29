import * as React from 'react'
import { MainOffer } from '../../components/MainPage/MainOffer'
import { PortfolioSlider } from '../../components/MainPage/PortfolioSlider'
import { About } from '../../components/MainPage/About'
import { Services } from '../../components/MainPage/Services'
import { FaqItems } from '../../components/MainPage/FaqItems'
import { Booking } from '../../components/MainPage/Booking'
import {AddCustomerFormValues, FaqType, PageType, ServiceType, TattooStyleType} from "../../types/Types";

type PropsType = {
  isAuth: boolean
  galleryPageSize: number
  tattooStyles: Array<TattooStyleType>
  services: Array<ServiceType>
  faq: Array<FaqType>
  pages: Array<PageType>
  addCustomer: (values: AddCustomerFormValues) => void
  setActiveStyle: (style: TattooStyleType) => void
  editAboutPage: (id: string, values: FormData) => void
  changePageVisibility: (pageId: string, isActive: boolean) => void
  editService: (id: string, values: FormData) => void
  addService: (values: FormData) => void
  deleteService: (id: string) => void
  updateFaqItem: (id: string, values: any) => void
  addFaqItem: (values: FaqType) => void
  deleteFaqItem: (id: string) => void
}

export const MainPage: React.FC<PropsType> = React.memo(({
  isAuth,
  galleryPageSize,
  tattooStyles,
  services,
  faq,
  pages,
  addCustomer,
  setActiveStyle,
  editAboutPage,
  changePageVisibility,
  editService,
  addService,
  deleteService,
  updateFaqItem,
  addFaqItem,
  deleteFaqItem
}) => {

  const pageAbout = pages?.find(page => page.name === 'about')

  return (
    <>
      <MainOffer addCustomer={addCustomer} />
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
      <Booking consentId="consent" addCustomer={addCustomer} />
    </>
  )
})
