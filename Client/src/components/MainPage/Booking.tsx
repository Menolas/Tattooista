import * as React from "react";
import {BookingForm} from "../Forms/BookingForm";

type PropsType = {
  consentId: string;
}

export const Booking: React.FC<PropsType> = React.memo(({
    consentId,
}) => {

  return (
    <section className = "page-block booking container" id="bookingSection">
      <h2 className = "page-block__title">Apply for booking</h2>
      <div className = "booking__content">
        <div className = "booking__form-page-wrap">
          <BookingForm
              consentId={consentId}
          />
        </div>
        <div className = "booking__img-wrap">{''}</div>
      </div>
    </section>
  );
});

Booking.displayName = 'Booking';
