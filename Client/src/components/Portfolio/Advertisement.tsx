import * as React from "react"
import {useEffect, useState} from "react"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import { NavLink } from "react-router-dom"
import { ModalPopUp } from "../common/ModalPopUp"
import { BookingForm } from "../Forms/BookingFormFormik"
import {BookConsultationFormValues} from "../../types/Types"
import {SuccessPopUp} from "../common/SuccessPopUp"
import {useDispatch, useSelector} from "react-redux"
import {getIsSuccessBookingSelector} from "../../redux/General/general-selectors"
import {setIsSuccessBookingAC} from "../../redux/General/general-reducer"

type PropsType = {
  bookConsultation: (values: BookConsultationFormValues) => void
}

export const Advertisement: React.FC<PropsType> = React.memo(({
  bookConsultation
}) => {

  const isSuccessBooking = useSelector(getIsSuccessBookingSelector)

  let [bookingModal, setBookingModal] = useState(false)
  const successPopUpContent = "You've booked a consultation! We will contact you soon))"

  const dispatch = useDispatch()

  const setIsSuccessBookingCallBack = (bol: boolean) => {
    dispatch(setIsSuccessBookingAC(bol))
  }

  useEffect(() => {
    if (isSuccessBooking) {
      setTimeout( () => {
        dispatch(setIsSuccessBookingAC(false))
      }, 1500)
    }
  }, [isSuccessBooking])

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
                <svg><use href={`${Sprite}#instagram`}/></svg>
              </NavLink>
            </li>
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#facebook`}/></svg>
              </NavLink>
            </li>
            <li className="social-share__item">
              <NavLink to="#" className="social-share__link">
                <svg><use href={`${Sprite}#phone`}/></svg>
              </NavLink>
            </li>
          </ul>
        </div>
        { bookingModal &&
          <ModalPopUp
            modalTitle={"Book your consultation"}
            closeModal={closeBookingModal}
          >
            <BookingForm
              consentId="consent"
              bookConsultation={bookConsultation}
              closeBookingModal={closeBookingModal}
            />
          </ModalPopUp>
        }
      { isSuccessBooking &&
          <SuccessPopUp closeModal={setIsSuccessBookingCallBack} content={successPopUpContent} />
      }
    </section>
  )
})
