import * as React from "react";
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
import {Advertisement} from "../../components/Advertisement";
import {AppDispatch} from "../../redux/redux-store";

export const MainPage: React.FC = () => {

  const styles = useSelector(getStylesSelector);
  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const token = useSelector(getTokenSelector);
  const isFetching = useSelector(getIsFetchingSelector);
  const activeStyle = useSelector(getActiveStyleSelector);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
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
          dispatch(setSuccessModalAC(false, ''));
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
      <MainOffer />
        <div className={'container'}>
          <Advertisement/>
        </div>
        {
            isFetching
                ? <Preloader />
                : (
                    <PortfolioSlider
                        activeStyle={activeStyle}
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
