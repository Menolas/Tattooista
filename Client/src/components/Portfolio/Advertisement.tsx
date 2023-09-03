import * as React from 'react'
import { useState } from 'react'
// @ts-ignore
import Sprite from '../../assets/svg/sprite.svg'
import { NavLink } from "react-router-dom"
import { ModalPopUp } from '../common/ModalPopUp'
import { BookingForm } from '../Forms/BookingFormFormik'
import {BookConsultationFormValues} from '../../types/Types'
import {SuccessPopUp} from "../common/SuccessPopUp";

type PropsType = {
  isSuccess: boolean
  bookConsultation: (values: BookConsultationFormValues) => void
  setIsSuccess: (bol: boolean) => void
}

export const Advertisement: React.FC<PropsType> = React.memo(({
  isSuccess,
  setIsSuccess,
  bookConsultation
}) => {

  let [bookingModal, setBookingModal] = useState(false)
  const successPopUpContent = "You've booked a consultation! We will contact you soon))"

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
              bookConsultation={bookConsultation}
              closeBookingModal={closeBookingModal}
            />
          </ModalPopUp>
        }
      { isSuccess &&
          <SuccessPopUp closeModal={setIsSuccess} content={successPopUpContent} />
      }
    </section>
  )
})
