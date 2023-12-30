import * as React from "react"
import {BookingForm} from "../Forms/BookingFormFormik"
import {BookConsultationFormValues} from "../../types/Types"

type PropsType = {
  consentId: string
  bookConsultation: (values: BookConsultationFormValues) => void
}

export const Booking: React.FC<PropsType> = React.memo(({consentId, bookConsultation}) => {

  return (
    <section className = "page-block booking" id="bookingSection">
      <h2 className = "page-block__title">Apply for booking</h2>
      <div className = "booking__content">
        <div className = "booking__form-page-wrap">
          <BookingForm
              consentId={consentId}
              bookConsultation={bookConsultation}
          />
        </div>
        <div className = "booking__img-wrap">{''}</div>
      </div>
    </section>
  )
})
