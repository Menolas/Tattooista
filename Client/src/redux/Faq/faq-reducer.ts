import {faqApi} from "./faqApi";
import {ApiErrorType, FaqType, UpdateFaqValues,} from "../../types/Types";
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
const DELETE_FAQ_ITEM = 'DELETE_FAQ_ITEM';
const UPDATE_FAQ_ITEM = 'UPDATE_FAQ_ITEM';
const ADD_FAQ_ITEM = 'ADD_FAQ_ITEM';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';

const FAQ_ADD_SUCCESS = "You successfully added a new FAQ item";
const FAQ_UPDATE_SUCCESS = "You successfully updated a FAQ item";

const initialState = {
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
            : state.isDeletingInProcess.filter(id => id !== action.id),
      }

    case SET_FAQ_ITEMS:
      return {
        ...state,
        faq: action.faqItems,
      }

    case DELETE_FAQ_ITEM:
      return {
        ...state,
        faq: state.faq.filter(item => item._id !== action.id),
      }

    case UPDATE_FAQ_ITEM:
      return {
        ...state,
        faq: state.faq.map(item => {
          if (item._id === action.id) {
            return {...action.item};
          }
          return item;
        }),
      }

    case ADD_FAQ_ITEM:
      return {
        ...state,
        faq: [...state.faq, action.item],
      }

    default: return {
      ...state,
    }
  }
}

type ActionsTypes = SetApiErrorAT | SetFaqItemsAT | SetSuccessModalAT |
    ToggleIsDeletingInProcessAT | SetIsFetchingAT | DeleteFaqItemAT | UpdateFaqItemAT | AddFaqItemAT;

// action creators

type DeleteFaqItemAT = {
    type: typeof DELETE_FAQ_ITEM,
    id: string,
}

const deleteFaqItemAC = (id: string): DeleteFaqItemAT => ({
    type: DELETE_FAQ_ITEM, id
});

type UpdateFaqItemAT = {
  type: typeof UPDATE_FAQ_ITEM,
  id: string,
  item: FaqType
}

const updateFaqItemAC = (id: string, item: FaqType): UpdateFaqItemAT => ({
  type: UPDATE_FAQ_ITEM, id, item
});

type AddFaqItemAT = {
  type: typeof ADD_FAQ_ITEM,
  item: FaqType
};

const addFaqItemAC = (item: FaqType): AddFaqItemAT => ({
  type: ADD_FAQ_ITEM, item
});

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

// const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
//   type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
// });

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

type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>

export const getFaqItems = (): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await faqApi.getFaqItems();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    dispatch(setFaqItems(faqItems));
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const addFaqItem = (values: UpdateFaqValues): ThunkType => async (dispatch) => {
  try {
    const response = await faqApi.addFaqItem(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addFaqItemAC(response.faqItem));
      dispatch(setSuccessModalAC(true, FAQ_ADD_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(error);
    return false;
  }
}

export const updateFaqItem = (id: string, values: UpdateFaqValues): ThunkType => async (dispatch) => {
  try {
    const response = await faqApi.updateFaqItem(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateFaqItemAC(id, response.faqItem));
      dispatch(setSuccessModalAC(true, FAQ_UPDATE_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(error);
    return false;
  }
}

export const deleteFaqItem = (id: string): ThunkType => async (dispatch) => {
  try {
    const response = await faqApi.deleteFaqItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteFaqItemAC(id));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}
