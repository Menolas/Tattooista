import * as React from "react"
import {BookConsultationFormValues} from "../../types/Types"
import {BookingButton} from "../common/BookingButton";

type PropsType = {
  bookConsultation: (values: BookConsultationFormValues) => void
}

export const MainOffer: React.FC<PropsType> = React.memo(({bookConsultation}) => {

  return (
    <div className = "main-offer">
      <div className = "main-offer__content-wrap">
        <span className = "main-offer__decorative-text">Tattoo Artist</span>
        <h1 className = "title title--first main-offer__title">
          <span>Hobf</span>
          <span>Adelaine</span>
        </h1>
        <span className = "main-offer__motto">Your philosophy on your skin</span>
      </div>
      <BookingButton bookConsultation={bookConsultation} />
    </div>
  )
})
