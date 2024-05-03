import {aboutApi} from "./aboutApi";
import {PageType} from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { pages } from "../../data/PagesData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_ABOUT_PAGE = 'SET_ABOUT_PAGE';
const SET_FAKE_API = 'SET_FAKE_API';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';

const ABOUT_PAGE_SUCCESS = "You successfully updated your 'about' block";


let initialState = {
  page: {} as PageType,
  isFetching: false as boolean,
  fakeApi: false as boolean,
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

    case SET_ABOUT_PAGE:
      return {
        ...state,
        page: action.page
      }

    case SET_FAKE_API:
      return {
        ...state,
        fakeApi: action.fakeApi,
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetAboutPageAT | SetSuccessModalAT | SetApiErrorAT
    | SetFakeApiAT | SetIsFetchingAT;

// action creators

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching
});

type SetFakeApiAT = {
  type: typeof SET_FAKE_API
  fakeApi: boolean
}

const setFakeApiAC = (fakeApi: boolean): SetFakeApiAT => ({
  type: SET_FAKE_API, fakeApi
});

type SetAboutPageAT = {
  type: typeof SET_ABOUT_PAGE,
  page: PageType
};

const setAboutPageAC = (page: PageType): SetAboutPageAT => ({
      type: SET_ABOUT_PAGE, page
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getAboutPage = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await aboutApi.getAboutPage();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFakeApiAC(false));
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
    dispatch(setFakeApiAC(true));
    dispatch(setAboutPageAC(pages));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const editAboutPage = (FormData: FormData): ThunkType => async (dispatch) => {
  try {
    const response = await aboutApi.editAboutPage(FormData);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(''));
      dispatch(setAboutPageAC(response.page));
      dispatch(setSuccessModalAC(true, ABOUT_PAGE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const changeAboutPageVisibility = (
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    const response = await aboutApi.changeAboutPageVisibility(isActive);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
  }
}
