import {aboutApi, GetPagesResponseType} from "./aboutApi";
import {ApiErrorType, PageType} from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { pages } from "../../data/PagesData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";
import {AnyAction} from "redux";

const SET_ABOUT_PAGE = 'SET_ABOUT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_EDITING = 'TOGGLE_IS_EDITING';

const ABOUT_PAGE_SUCCESS = "You successfully updated your 'about' block";


const initialState = {
  page: {} as PageType,
  isFetching: false as boolean,
  isEditing: false as boolean,
}

export type InitialStateType = typeof initialState;

export const aboutReducer = (
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

    case TOGGLE_IS_EDITING:
      return {
        ...state,
        isEditing: action.isEditing,
      }

    case SET_ABOUT_PAGE:
      return {
        ...state,
        page: action.page
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes =
    | SetAboutPageAT
    | SetSuccessModalAT
    | SetApiErrorAT
    | SetIsFetchingAT
    | SetIsEditingAT;

// action creators

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching
});

type SetIsEditingAT = {
  type: typeof TOGGLE_IS_EDITING;
  isEditing: boolean;
};

const setIsEditingAC = (isEditing: boolean): SetIsEditingAT => ({
  type: TOGGLE_IS_EDITING, isEditing
});

type SetAboutPageAT = {
  type: typeof SET_ABOUT_PAGE;
  page: PageType;
};

const setAboutPageAC = (page: PageType): SetAboutPageAT => ({
      type: SET_ABOUT_PAGE, page
});

// thunks

//type ThunkType = ThunkAction<Promise<GetPagesResponseType | null> | Promise<void>, AppStateType, unknown, ActionsTypes>;
export type ThunkType = ThunkAction<Promise<GetPagesResponseType | null> | Promise<void>, AppStateType, unknown, AnyAction>;

export const getAboutPage = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await aboutApi.getAboutPage();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
    dispatch(setAboutPageAC(pages));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const editAboutPage = (
    token: string | null,
  FormData: FormData
): ThunkType => async (dispatch) => {
  let apiResponse = null;
  try {
    dispatch(setIsEditingAC(true));
    dispatch(setIsFetchingAC(true));
    const response = await aboutApi.editAboutPage(token, FormData);
    apiResponse = response;
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(null));
      dispatch(setAboutPageAC(response.page));
      dispatch(setSuccessModalAC(true, ABOUT_PAGE_SUCCESS));
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(error);
  } finally {
    dispatch(setIsFetchingAC(false));
    dispatch(setIsEditingAC(false));
  }
  return apiResponse;
};

export const changeAboutPageVisibility = (
    token: string | null,
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    const response = await aboutApi.changeAboutPageVisibility(token, isActive);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
  }
};
