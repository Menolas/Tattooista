import {faqApi} from "./faqApi";
import {FaqType,} from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { faqItems } from "../../data/FaqData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_FAQ_ITEMS = 'SET_FAQ_ITEMS';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';

const FAQ_ADD_SUCCESS = "You successfully added a new FAQ item";
const FAQ_UPDATE_SUCCESS = "You successfully updated a FAQ item";

let initialState = {
  faq: [] as Array<FaqType>,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
}

export type InitialStateType = typeof initialState;

export const faqReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
  //debugger

  switch (action.type) {
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
            ? [...state.isDeletingInProcess, action.id]
            : state.isDeletingInProcess.filter(id => id !== action.id)
      }

    case SET_FAQ_ITEMS:
      return {
        ...state,
        faq: action.faqItems
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetApiErrorAT | SetFaqItemsAT | SetSuccessModalAT |
    ToggleIsDeletingInProcessAT | SetIsFetchingAT;

// action creators

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
    {
      type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
    });

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching
});

type SetFaqItemsAT = {
  type: typeof SET_FAQ_ITEMS,
  faqItems: Array<FaqType>
};

const setFaqItems = (faqItems: Array<FaqType>): SetFaqItemsAT => ({
    type: SET_FAQ_ITEMS, faqItems
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getFaqItems = (): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await faqApi.getFaqItems();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
    }
  } catch (e) {
    console.log(e);
    dispatch(setFaqItems(faqItems));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const addFaqItem = (values: FaqType): ThunkType => async (dispatch) => {
  try {
    let response = await faqApi.addFaqItem(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(null));
      dispatch(setFaqItems(response.faqItems));
      dispatch(setSuccessModalAC(true, FAQ_ADD_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const updateFaqItem = (id: string, values: any): ThunkType => async (dispatch) => {
  try {
    let response = await faqApi.updateFaqItem(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(null));
      dispatch(setFaqItems(response.faqItems));
      dispatch(setSuccessModalAC(true, FAQ_UPDATE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const deleteFaqItem = (id: string): ThunkType => async (dispatch) => {
  try {
    let response = await faqApi.deleteFaqItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
    }
  } catch (e) {
    console.log(e);
  }
}
