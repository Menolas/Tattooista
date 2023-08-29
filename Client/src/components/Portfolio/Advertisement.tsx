import * as React from 'react'
import { useState } from 'react'
import Sprite from '../../assets/svg/sprite.svg'
import { NavLink } from "react-router-dom"
import { ModalPopUp } from '../common/ModalPopUp'
import { BookingForm } from '../Forms/BookingFormFormik'
import { AddCustomerFormValues } from '../../types/Types'
import {SuccessModal} from "../SuccessModal";

type PropsType = {
  addCustomer: (values: AddCustomerFormValues) => void
}

export const Advertisement: React.FC<PropsType> = React.memo(({addCustomer}) => {

  let [bookingModal, setBookingModal] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const showSuccessModal = () => {
    setSuccess(true)
  }

  const closeSuccessModal = () => {
    setSuccess(false)
  }

  const modalTitle = ''

  const showBookConsultationModal = () => {
    setBookingModal(true);
  }

  const closeBookingModal = () => {
    setBookingModal(false)
  }

  return (
    <section className="advertisement">
        <button
          className="btn btn--bg advertisement__btn"
          onClick={ showBookConsultationModal }>
          BOOK A CONSULTATION
        </button>
        <div className="social-share">
          <span>Share this page</span>
          <ul className="social-share__list list">
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#instagram`}></use></svg>
              </NavLink>
            </li>
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#facebook`}></use></svg>
              </NavLink>
            </li>
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#phone`}></use></svg>
              </NavLink>
            </li>
          </ul>
        </div>
        { bookingModal &&
          <ModalPopUp
            closeModal={closeBookingModal}
          >
            <BookingForm
              consentId="consent"
              addCustomer={addCustomer}
              closeBookingModal={closeBookingModal}
              showSuccessModal={showSuccessModal}
            />
          </ModalPopUp>
        }
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
