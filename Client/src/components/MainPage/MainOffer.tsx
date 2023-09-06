import * as React from 'react'
import { useState } from 'react'
import { ModalPopUp } from '../common/ModalPopUp'
import { BookingForm } from '../Forms/BookingFormFormik'
import {BookConsultationFormValues} from '../../types/Types'

type PropsType = {
  bookConsultation: (values: BookConsultationFormValues) => void
}

export const MainOffer: React.FC<PropsType> = React.memo(({bookConsultation}) => {

  const [bookingModal, setBookingModal] = useState(false)

  const modalTitle = 'FILL THE FORM AND WE WILL CONTACT YOU SOON'

  const showBookConsultationModal = () => {
    setBookingModal(true)
  }

  const closeBookingModal = () => {
    setBookingModal(false)
  }

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
      <button
        className = "btn btn--light-bg main-header__btn"
        onClick = { showBookConsultationModal }>
        BOOK A CONSULTATION
      </button>
      { bookingModal &&
        <ModalPopUp
          modalTitle={modalTitle}
          closeModal={closeBookingModal}
        >
          <BookingForm
            consentId="consent"
            bookConsultation={bookConsultation}
            closeBookingModal={closeBookingModal}
          />
        </ModalPopUp>
      }
    </div>
  )
})
