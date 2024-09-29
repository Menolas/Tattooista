import * as React from "react";
import { Helmet } from 'react-helmet';
import { MainOffer } from "../../components/MainPage/MainOffer";
import { PortfolioSlider } from "../../components/MainPage/PortfolioSlider";
import { Booking } from "../../components/MainPage/Booking";
import {
    StyleType
} from "../../types/Types";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useCallback, useEffect} from "react";
import {
  setSuccessModalAC,
} from "../../redux/General/general-reducer";
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
    getIsFetchingSelector,
    getActiveStyleSelector,
} from "../../redux/Styles/styles-selectors";
import {
  getApiErrorSelector,
  getSuccessModalSelector
} from "../../redux/General/general-selectors";
import {
    getStyles,
    setActiveStyle,
} from "../../redux/Styles/styles-reducer";
import {AboutContainer} from "../../components/MainPage/about/AboutContainer";
import {ServicesContainer} from "../../components/MainPage/services/SevicesContainer";
import {FaqContainer} from "../../components/MainPage/faq/FaqContainer";
import {Preloader} from "../../components/common/Preloader";
import {WEB_APP_DESCRIPTION, WEB_APP_TITLE} from "../../utils/constants";

export const MainPage: React.FC = () => {

  const baseURL = process.env.REACT_APP_PUBLIC_URL;
  const pageSize = useSelector(getPageSizeSelector);
  const styles = useSelector(getStylesSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const token = useSelector(getTokenSelector);
  const isFetching = useSelector(getIsFetchingSelector);
  const activeStyle = useSelector(getActiveStyleSelector);

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
    dispatch(getStyles(token, true));
  }, [dispatch, token]);

useEffect(() => {
    dispatch(setActiveStyle(styles[0]));
}, [dispatch, styles]);

  useEffect(() => {
    if (successModal.isSuccess) {
        setTimeout( () => {
          dispatch(setSuccessModalAC(false, ''));;
        }, 3000);
    }
  }, [dispatch, successModal]);

  const setActiveStyleCallBack = (style: StyleType) => {
    dispatch(setActiveStyle(style));
  }

  const setSuccessModalCallBack = useCallback(() => {
    dispatch(setSuccessModalAC(false, ''));
  }, [dispatch]);

  return (
    <>
    <Helmet>
        <title>{WEB_APP_TITLE}</title>
        <meta name="description" content={`${WEB_APP_DESCRIPTION}`} />
        <meta property="og:url" content={`${baseURL}/`} />
        <meta property="og:title" content={`${WEB_APP_TITLE}`} />
        <meta property="og:description" content={`${WEB_APP_DESCRIPTION}`} />
        <meta property="og:image" content={`${baseURL}/uploads/facebookFlyer.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${WEB_APP_TITLE}`} />
        <meta name="twitter:description" content={`${WEB_APP_DESCRIPTION}`} />
        <meta name="twitter:image" content={`${baseURL}/uploads/instagramFlyer.png`} />
    </Helmet>
      <MainOffer />
        {
            isFetching
                ? <Preloader />
                : (
                    <PortfolioSlider
                        activeStyle={activeStyle}
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
