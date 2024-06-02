import { servicesApi } from "./servicesApi";
import { ServiceType } from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { services } from "../../data/ServicesData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_SERVICES = 'SET_SERVICES';
const SET_FAKE_API = 'SET_FAKE_API';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';

const SERVICE_ADD_SUCCESS = "You successfully added a new SERVICE item";
const SERVICE_UPDATE_SUCCESS = "You successfully updated a SERVICE item";

let initialState = {
  services: [] as Array<ServiceType>,
  isFetching: false as boolean,
  fakeApi: false as boolean,
  isDeletingInProcess: [] as Array<string>,
}

export type InitialStateType = typeof initialState

export const servicesReducer = (
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

    case SET_FAKE_API:
      return {
        ...state,
        fakeApi: action.fakeApi,
      }

    case SET_SERVICES:
      return {
        ...state,
        services: action.services
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetServicesAT | SetSuccessModalAT | SetApiErrorAT | SetFakeApiAT |
    ToggleIsDeletingInProcessAT | SetIsFetchingAT;

// action creators

type SetFakeApiAT = {
  type: typeof SET_FAKE_API
  fakeApi: boolean
}

const setFakeApiAC = (fakeApi: boolean): SetFakeApiAT => ({
  type: SET_FAKE_API, fakeApi
});

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

type SetServicesAT = {
  type: typeof SET_SERVICES,
  services: Array<ServiceType>
};

const setServicesAC = (services: Array<ServiceType>): SetServicesAT => ({
    type: SET_SERVICES, services
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getServices = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await servicesApi.getServices();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
    }
  } catch (e) {
    console.log(e);
    dispatch(setServicesAC(services));
    dispatch(setFakeApiAC(true));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const editService = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await servicesApi.editService(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(null));
      dispatch(setServicesAC(response.services));
      dispatch(setSuccessModalAC(true, SERVICE_UPDATE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const addService = (
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await servicesApi.addService(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setApiErrorAC(null));
      dispatch(setServicesAC(response.services));
      dispatch(setSuccessModalAC(true, SERVICE_ADD_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e);
  }
}

export const deleteService = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    const response = await servicesApi.deleteService(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
    }
  } catch (e) {
    console.log(e);
  }
}
