import {BookConsultationFormValues} from "../../types/Types";
import {useEffect, useState} from "react";
import {ModalPopUp} from "./ModalPopUp";
import {BookingForm} from "../Forms/BookingFormFormik";
import * as React from "react";
import {
    bookConsultation,
    setBookingConsultationApiErrorAC,
    setSuccessModalAC
} from "../../redux/General/general-reducer";
import {useDispatch, useSelector} from "react-redux";
import {getBookingConsultationApiErrorSelector, getSuccessModalSelector} from "../../redux/General/general-selectors";
import {SuccessPopUp} from "./SuccessPopUp";
import {ApiErrorMessage} from "./ApiErrorMessage";

type PropsType = {
    consentId: string
};

export const BookingButton: React.FC<PropsType> = ({
    consentId = 'consent',
}) => {

    const bookingConsultationApiError = useSelector(getBookingConsultationApiErrorSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                dispatch(setSuccessModalAC(false, ''));
            }, 3000);
        }
    }, [successModal]);

    const setSuccessModalCallBack = () => {
        dispatch(setSuccessModalAC(false, ''));
    }

    const bookConsultationCallBack = (values: BookConsultationFormValues) => {
        dispatch(bookConsultation(values));
    }

    const setBookingConsultationApiErrorCallBack = (error: string) => {
        dispatch(setBookingConsultationApiErrorAC(error));
    }

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
                        bookConsultation={bookConsultationCallBack}
                        closeBookingModal={closeBookingModal}
                    />
                }
            </ModalPopUp>
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />
            { bookingConsultationApiError && bookingConsultationApiError !== '' &&
                <ApiErrorMessage
                    error={bookingConsultationApiError}
                    closeModal={setBookingConsultationApiErrorCallBack}
                />
            }
        </div>
    )
}
