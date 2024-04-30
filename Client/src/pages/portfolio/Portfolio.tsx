import * as React from "react";
import {ApiErrorMessage } from "../../components/common/ApiErrorMessage";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  getApiErrorSelector,
  getSuccessModalSelector,
} from "../../redux/General/general-selectors";
import {setSuccessModalAC, setApiErrorAC} from "../../redux/General/general-reducer";
import {StylesContainer} from "../../components/Portfolio/styles/StylesContainer";
import {GalleryContainer} from "../../components/Portfolio/gallery/GalleryContainer";

export const Portfolio: React.FC = () => {

  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (successModal.isSuccess) {
      setTimeout( () => {
        setSuccessModalCallBack();
      }, 3000);
    }
  }, [successModal]);

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(''));
  }

  return (
    <div>
      <StylesContainer />
      <GalleryContainer />
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
  );
}
