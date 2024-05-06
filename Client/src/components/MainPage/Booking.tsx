import * as React from "react";
import {BookingForm} from "../Forms/BookingForm";
import {BookConsultationFormValues} from "../../types/Types";
import {addBooking} from "../../redux/Bookings/bookings-reducer";

type PropsType = {
  apiError: string;
  consentId: string;
  addBooking: (values: BookConsultationFormValues) => void;
}

export const Booking: React.FC<PropsType> = React.memo(({
    apiError,
    consentId,
    addBooking,
}) => {

  return (
    <section className = "page-block booking container" id="bookingSection">
      <h2 className = "page-block__title">Apply for booking</h2>
      <div className = "booking__content">
        <div className = "booking__form-page-wrap">
          <BookingForm
              apiError={apiError}
              consentId={consentId}
              bookConsultation={addBooking}
          />
        </div>
        <div className = "booking__img-wrap">{''}</div>
      </div>
    </section>
  )
});
