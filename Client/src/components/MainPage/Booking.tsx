import * as React from 'react'
import { useState } from 'react'
import {BookingForm} from '../Forms/BookingFormFormik'
import {AddCustomerFormValues} from '../../types/Types'
import {SuccessModal} from '../SuccessModal'
import {ModalPopUp} from '../common/ModalPopUp'

type PropsType = {
  addCustomer: (values: AddCustomerFormValues) => void
}

export const Booking: React.FC<PropsType> = React.memo(({addCustomer}) => {

  const [isSuccess, setSuccess] = useState(false)
  const showSuccessModal = () => {
      setSuccess(true)
  }

  const closeSuccessModal = () => {
      setSuccess(false)
  }

  const modalTitle = ''

  return (
    <section className = "page-block booking" id="bookingSection">
      <h2 className = "page-block__title">Apply for booking</h2>
      <div className = "booking__content">
        <div className = "booking__form-page-wrap">
          <BookingForm
              consentId="consent"
              addCustomer={addCustomer}
              showSuccessModal={showSuccessModal}
          />
        </div>
        <div className = "booking__img-wrap">{''}</div>
      </div>
      {
          isSuccess &&
          <ModalPopUp
              modalTitle={modalTitle}
              closeModal={closeSuccessModal}
          >
            <SuccessModal />
          </ModalPopUp>
      }
    </section>
  )
})
