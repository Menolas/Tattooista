import * as React from "react";
import { MainOffer } from "../../components/MainPage/MainOffer";
import { PortfolioSlider } from "../../components/MainPage/PortfolioSlider";
import { Booking } from "../../components/MainPage/Booking";
import {
    BookConsultationFormValues,
    StyleType
} from "../../types/Types";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useEffect} from "react";
import {
  setSuccessModalAC,
} from "../../redux/General/general-reducer";
import {addBooking} from "../../redux/Bookings/bookings-reducer";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getTokenSelector
} from "../../redux/Auth/auth-selectors";
import {
  getPageSizeSelector,
} from "../../redux/Gallery/gallery-selectors";
import {
    getStylesSelector,
    getFakeApiSelector,
    getIsFetchingSelector,
} from "../../redux/Styles/styles-selectors";
import {
  getApiErrorSelector,
  getSuccessModalSelector
} from "../../redux/General/general-selectors";
import {
    getStyles,
    setActiveStyleAC
} from "../../redux/Styles/styles-reducer";
import {AboutContainer} from "../../components/MainPage/about/AboutContainer";
import {ServicesContainer} from "../../components/MainPage/services/SevicesContainer";
import {FaqContainer} from "../../components/MainPage/faq/FaqContainer";
import {Preloader} from "../../components/common/Preloader";

export const MainPage: React.FC = () => {

  const pageSize = useSelector(getPageSizeSelector);
  const styles = useSelector(getStylesSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const fakeApi = useSelector(getFakeApiSelector);
  const token = useSelector(getTokenSelector);
  const isFetching = useSelector(getIsFetchingSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the URL contains a hash
    if (window.location.hash) {
      // Get the target element using the hash
      const targetElement = document.querySelector(window.location.hash);
      // Scroll to the target element
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    dispatch(getStyles(token));
  }, [dispatch]);

  useEffect(() => {
    if (successModal.isSuccess) {
        setTimeout( () => {
          dispatch(setSuccessModalAC(false, ''));;
        }, 3000);
    }
  }, [successModal]);

  const setActiveStyleCallBack = (style: StyleType) => {
    dispatch(setActiveStyleAC(style));
  }

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  return (
    <>
      <MainOffer />
        {
            isFetching
                ? <Preloader />
                : (
                    <PortfolioSlider
                        fakeApi={fakeApi}
                        pageSize={pageSize}
                        setActiveStyle={setActiveStyleCallBack}
                        styles={styles}
                    />
                )
        }
      <AboutContainer />
      <ServicesContainer />
      <FaqContainer />
      <Booking
          apiError={apiError}
          consentId="consent3"
      />
      <SuccessPopUp
          isOpen={successModal.isSuccess}
          closeModal={setSuccessModalCallBack}
          content={successModal.successText}
      />
    </>
  )
};
