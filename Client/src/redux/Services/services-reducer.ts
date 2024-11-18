import { servicesApi } from "./servicesApi";
import {ApiErrorType, ServiceType} from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { services } from "../../data/ServicesData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";
import {AnyAction} from "redux";

const SET_SERVICES = 'SET_SERVICES';
const DELETE_SERVICE = 'DELETE_SERVICE';
const ADD_SERVICE = 'ADD_SERVICE';
const UPDATE_SERVICE = 'UPDATE_SERVICE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';

const SERVICE_ADD_SUCCESS = "You successfully added a new SERVICE item";
const SERVICE_UPDATE_SUCCESS = "You successfully updated a SERVICE item";

const initialState = {
  services: [] as Array<ServiceType>,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
}

export type InitialStateType = typeof initialState

export const servicesReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

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

    case SET_SERVICES:
      return {
        ...state,
        services: action.services
      }

    case DELETE_SERVICE:
      return {
        ...state,
        services: state.services.filter(item => item._id !== action.id),
      }

    case ADD_SERVICE:
      return {
        ...state,
        services: [...state.services, action.service],
      }

    case UPDATE_SERVICE:
      return {
        ...state,
        services: state.services.map(item => {
          if (item._id === action.service._id) {
            return {...action.service};
          }
          return item;
        })
      }

    default: return {
      ...state
    }
  }
};

type ActionsTypes =
    | SetServicesAT
    | SetSuccessModalAT
    | SetApiErrorAT
    | ToggleIsDeletingInProcessAT
    | SetIsFetchingAT
    | DeleteServiceAT
    | AddServiceAT
    | UpdateServiceAT;

// action creators

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
  isFetching: boolean;
  id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => ({
    type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});


type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
  type: TOGGLE_IS_FETCHING, isFetching
});

type SetServicesAT = {
  type: typeof SET_SERVICES;
  services: Array<ServiceType>;
};

const setServicesAC = (services: Array<ServiceType>): SetServicesAT => ({
    type: SET_SERVICES, services
});

type DeleteServiceAT = {
    type: typeof DELETE_SERVICE;
    id: string;
};

const deleteServiceAC = (id: string): DeleteServiceAT => ({
    type: DELETE_SERVICE, id
});

type AddServiceAT = {
    type: typeof ADD_SERVICE;
    service: ServiceType;
};

const addServiceAC = (service: ServiceType): AddServiceAT => ({
    type: ADD_SERVICE, service
});

type UpdateServiceAT = {
    type: typeof UPDATE_SERVICE;
    service: ServiceType;
};

const updateServiceAC = (service: ServiceType): UpdateServiceAT => ({
    type: UPDATE_SERVICE, service
});

// thunks

//type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>;
export type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, AnyAction>;

export const getServices = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await servicesApi.getServices();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    dispatch(setServicesAC(services));
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const editService = (
    token: string | null,
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await servicesApi.editService(token, id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateServiceAC(response.service));
      dispatch(setSuccessModalAC(true, SERVICE_UPDATE_SUCCESS));
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
};

export const addService = (
    token: string | null,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await servicesApi.addService(token, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addServiceAC(response.service));
      dispatch(setSuccessModalAC(true, SERVICE_ADD_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'))
    console.log(error);
    return false;
  }
};

export const deleteService = (
    token: string | null,
    id: string
): ThunkType => async (dispatch) => {
  dispatch(toggleIsDeletingInProcessAC(true, id));
  try {
    const response = await servicesApi.deleteService(token, id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteServiceAC(id));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};
