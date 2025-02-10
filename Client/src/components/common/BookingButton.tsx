import {useCallback, useEffect, useState} from "react";
import {ModalPopUp} from "../PopUps/ModalPopUp";
import {BookingForm} from "../Forms/BookingForm";
import * as React from "react";
import {
    setApiErrorAC,
    setSuccessModalAC
} from "../../redux/General/general-reducer";
import {useDispatch, useSelector} from "react-redux";
import {getSuccessModalSelector} from "../../redux/General/general-selectors";
import {SuccessPopUp} from "../PopUps/SuccessPopUp";
import {AppDispatch} from "../../redux/redux-store";
import {setBookingApiErrorAC} from "../../redux/Bookings/bookings-reducer";
import {getBookingApiErrorSelector} from "../../redux/Bookings/bookings-selectors";

type PropsType = {
    consentId: string;
};

export const BookingButton: React.FC<PropsType> = React.memo(({
    consentId = 'consent',
}) => {
    const successModal = useSelector(getSuccessModalSelector);
    const dispatch = useDispatch<AppDispatch>();
    const bookingApiError = useSelector(getBookingApiErrorSelector);

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

    const [bookingModal, setBookingModal] = useState(false);

    const modalTitle = 'FILL THE FORM AND WE WILL CONTACT YOU SOON';

    const showBookConsultationModal = () => {
        setBookingModal(true);
    };

    const closeBookingModal = useCallback(() => {
        setBookingModal(false);
        dispatch(setBookingApiErrorAC(null));
    }, [dispatch]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                dispatch(setSuccessModalAC(false, ''));
            }, 3000);
        }
    }, [successModal, dispatch]);

    useEffect(() => {
        if (bookingModal && bookingApiError === null) {
            closeBookingModal();
        }
    }, [bookingApiError]);

    return (
        <div className={'bookingBtnBlock'}>
            <button
                className = "btn btn--bg btn--transparent booking-btn"
                onClick = { () => {
                    showBookConsultationModal();
                }}>
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
                        closeBookingModal={closeBookingModal}
                    />
                }
            </ModalPopUp>
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />
        </div>
    );
});

BookingButton.displayName = 'BookingButton';
