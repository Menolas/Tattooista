import {BookConsultationFormValues} from "../../types/Types";
import {useEffect, useState} from "react";
import {ModalPopUp} from "./ModalPopUp";
import {BookingForm} from "../Forms/BookingForm";
import * as React from "react";
import {
    setApiErrorAC,
    setSuccessModalAC
} from "../../redux/General/general-reducer";
import {addBooking} from "../../redux/Bookings/bookings-reducer";
import {useDispatch, useSelector} from "react-redux";
import {getApiErrorSelector, getSuccessModalSelector} from "../../redux/General/general-selectors";
import {SuccessPopUp} from "./SuccessPopUp";
import {ApiErrorMessage} from "./ApiErrorMessage";

type PropsType = {
    consentId: string;
};

export const BookingButton: React.FC<PropsType> = ({
    consentId = 'consent',
}) => {

    const apiError = useSelector(getApiErrorSelector);
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
        const total = null;
        dispatch(addBooking(values, total));
    }

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(''));
    }

    const [bookingModal, setBookingModal] = useState(false)

    const modalTitle = ''

    const showBookConsultationModal = () => {
        setBookingModal(true);
    }

    const closeBookingModal = () => {
        setBookingModal(false);
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
                        apiError={apiError}
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
            <ApiErrorMessage
                isOpen={!!apiError}
                error={apiError}
                closeModal={setApiErrorCallBack}
            />
        </div>
    )
}
