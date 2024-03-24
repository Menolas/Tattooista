import * as React from "react"
import {useEffect, useState} from "react"
// @ts-ignore
import Sprite from "../../assets/svg/sprite.svg"
import { NavLink } from "react-router-dom"
import {BookConsultationFormValues} from "../../types/Types"
import {SuccessPopUp} from "../common/SuccessPopUp"
import {useDispatch, useSelector} from "react-redux"
import {getIsSuccessBookingSelector} from "../../redux/General/general-selectors"
import {setIsSuccessBookingAC} from "../../redux/General/general-reducer"
import {BookingButton} from "../common/BookingButton";

type PropsType = {
  bookConsultation: (values: BookConsultationFormValues) => void
}

export const Advertisement: React.FC<PropsType> = React.memo(({
  bookConsultation
}) => {

  const isSuccessBooking = useSelector(getIsSuccessBookingSelector)

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

  return (
    <section className="advertisement">
      <div className="social-share">
          <h3 className={'page-block__title-secondary'}>Share this page:</h3>
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
          </ul>
      </div>
      <BookingButton bookConsultation={bookConsultation} />
      { isSuccessBooking &&
          <SuccessPopUp closeModal={setIsSuccessBookingCallBack} content={successPopUpContent} />
      }
    </section>
  )
})
