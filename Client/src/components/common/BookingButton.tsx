import {BookConsultationFormValues} from "../../types/Types";
import {useState} from "react";
import {ModalPopUp} from "./ModalPopUp";
import {BookingForm} from "../Forms/BookingFormFormik";
import * as React from "react";

type PropsType = {
    bookConsultation: (values: BookConsultationFormValues) => void
}

export const BookingButton: React.FC<PropsType> = ({bookConsultation}) => {

    const [bookingModal, setBookingModal] = useState(false)

    const modalTitle = ''

    const showBookConsultationModal = () => {
        setBookingModal(true)
    }

    const closeBookingModal = () => {
        setBookingModal(false)
    }

    return (
        <>
            <button
                className = "btn btn--bg btn--transparent booking-btn"
                onClick = { () => {
                    console.log("bookinghit!!!!!!!!!!!!!!")
                    showBookConsultationModal()
                } }>
                Book a consultation
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
        </>
    )
}
