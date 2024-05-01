import { generalSourcesApi } from "./generalSourcesApi";
import { BookConsultationFormValues,} from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";

const SET_IS_FETCHING = 'SET_IS_GENERAL_FETCHING';
const SET_API_ERROR = 'SET_API_ERROR';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const BOOKING_SUCCESS = "Congratulation! You've just submitted your booking request.";

let initialState = {
  isFetching: false as boolean,
  apiError: '' as string,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  }
}

export type SuccessModalType = typeof initialState.successModal

export type InitialStateType = typeof initialState

export const generalReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
  //debugger

  switch (action.type) {

    case SET_IS_FETCHING:
      return {
        ...state,
        isFetching: action.bol
      }

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
      }

    case SET_API_ERROR:
      return {
        ...state,
        apiError: action.error
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetIsFetchingAT | SetApiErrorAT | SetSuccessModalAT;

// action creators

export type SetSuccessModalAT = {
  type: typeof SET_SUCCESS_MODAL
  isSuccess: boolean
  text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
  type: SET_SUCCESS_MODAL, isSuccess, text
});

export type SetApiErrorAT = {
  type: typeof  SET_API_ERROR
  error: string
};

export const setApiErrorAC = (error: string): SetApiErrorAT  => ({
  type: SET_API_ERROR, error
});

type SetIsFetchingAT = {
  type: typeof SET_IS_FETCHING
  bol: boolean
};

export const setIsFetchingAC = (bol: boolean): SetIsFetchingAT => ({
  type: SET_IS_FETCHING, bol
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const bookConsultation = (
    values: BookConsultationFormValues
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.bookConsultation(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(''));
      dispatch(setSuccessModalAC(true, BOOKING_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
  }
}
