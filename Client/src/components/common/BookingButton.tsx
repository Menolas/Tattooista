import {BookConsultationFormValues} from "../../types/Types";
import {useState} from "react";
import {ModalPopUp} from "./ModalPopUp";
import {BookingForm} from "../Forms/BookingFormFormik";
import * as React from "react";

type PropsType = {
    consentId: string
    bookConsultation: (values: BookConsultationFormValues) => void
};

export const BookingButton: React.FC<PropsType> = ({
    consentId = 'consent',
    bookConsultation,
}) => {

    const [bookingModal, setBookingModal] = useState(false)

    const modalTitle = ''

    const showBookConsultationModal = () => {
        setBookingModal(true)
    }

    const closeBookingModal = () => {
        setBookingModal(false)
    }

    return (
        <div className={'bookingBtnBlock'}>
            <button
                className = "btn btn--bg btn--transparent booking-btn"
                onClick = { () => {
                    showBookConsultationModal()
                } }>
                Book a consultation
            </button>

            <ModalPopUp
                isOpen={bookingModal}
                modalTitle={modalTitle}
                closeModal={closeBookingModal}
            >
                { bookingModal &&
                    <BookingForm
                        consentId={consentId}
                        bookConsultation={bookConsultation}
                        closeBookingModal={closeBookingModal}
                    />
                }
            </ModalPopUp>
        </div>
    )
}
