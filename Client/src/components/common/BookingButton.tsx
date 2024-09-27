import {useCallback, useEffect, useState} from "react";
import {ModalPopUp} from "./ModalPopUp";
import {BookingForm} from "../Forms/BookingForm";
import * as React from "react";
import {
    setApiErrorAC,
    setSuccessModalAC
} from "../../redux/General/general-reducer";
import {useDispatch, useSelector} from "react-redux";
import {getApiErrorSelector, getSuccessModalSelector} from "../../redux/General/general-selectors";
import {SuccessPopUp} from "./SuccessPopUp";

type PropsType = {
    consentId: string;
};

export const BookingButton: React.FC<PropsType> = React.memo(({
    consentId = 'consent',
}) => {

    const apiError = useSelector(getApiErrorSelector);
    const successModal = useSelector(getSuccessModalSelector);
    const dispatch = useDispatch();

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

    const [bookingModal, setBookingModal] = useState(false);

    const modalTitle = 'FILL THE FORM AND WE WILL CONTACT YOU SOON';

    const showBookConsultationModal = () => {
        console.log("showBookConsultationModal called");
        setBookingModal(true);
        console.log("bookingModal state after setBookingModal(true):", bookingModal);
    };

    const closeBookingModal = useCallback(() => {
        console.log("closeBookingModal called");
        setBookingModal(false);
        dispatch(setApiErrorAC(null));
    }, [dispatch]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                dispatch(setSuccessModalAC(false, ''));
            }, 3000);
        }
    }, [successModal, dispatch]);

    // useEffect(() => {
    //     if (bookingModal && apiError === null) {
    //         closeBookingModal();
    //     }
    // }, [apiError, bookingModal, closeBookingModal]);

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
                        apiError={apiError}
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
