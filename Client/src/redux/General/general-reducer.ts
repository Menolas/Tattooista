import { generalSourcesApi } from "./generalSourcesApi";
import { BookConsultationFormValues, FaqType, PageType, ServiceType } from "../../types/Types";
import { ThunkAction } from "redux-thunk";
import { AppStateType } from "../redux-store";
import { ResultCodesEnum } from "../../utils/constants";
import { faqItems } from "../../data/FaqData";
import { services } from "../../data/ServicesData";
import { pages } from "../../data/PagesData";

const SET_FAQ_ITEMS = 'SET_FAQ_ITEMS';
const SET_SERVICES = 'SET_SERVICES';
const SET_SERVICE = 'SET_SERVICE';
const SET_ABOUT_PAGE = 'SET_ABOUT_PAGE';
const SET_IS_GENERAL_FETCHING = 'SET_IS_GENERAL_FETCHING';
const SET_BOOKING_CONSULTATION_API_ERROR = 'SET_BOOKING_CONSULTATION_API_ERROR';
const SET_UPDATE_FAQ_ITEM_API_ERROR = 'SET_UPDATE_FAQ_ITEM_API_ERROR';
const SET_UPDATE_SERVICE_API_ERROR = 'SET_UPDATE_SERVICE_API_ERROR';
const SET_UPDATE_PAGE_API_ERROR = 'SET_UPDATE_PAGE_API_ERROR';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const BOOKING_SUCCESS = "Congratulation! You\'ve just submitted your booking request.";
const ABOUT_PAGE_SUCCESS = "You successfully updated your 'about' block";
const FAQ_ADD_SUCCESS = "You successfully added a new FAQ item";
const FAQ_UPDATE_SUCCESS = "You successfully updated a FAQ item";
const SERVICE_ADD_SUCCESS = "You successfully added a new SERVICE item";
const SERVICE_UPDATE_SUCCESS = "You successfully updated a SERVICE item";


let initialState = {
  faq: [] as Array<FaqType>,
  services: [] as Array<ServiceType>,
  service: null as null | ServiceType,
  pageAbout: {} as PageType,
  isGeneralFetching: false as boolean,
  bookingConsultationApiError: '' as string | undefined,
  updateFaqItemApiError: '' as string | undefined,
  updateServiceApiError: '' as string | undefined,
  updatePageApiError: '' as string | undefined,
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

    case SET_FAQ_ITEMS:
      return {
        ...state,
        faq: action.faqItems
      }
    case SET_SERVICES:
      return {
        ...state,
        services: action.services
      }

    case SET_SERVICE:
      return {
        ...state,
        service: action.service
      }

    case SET_ABOUT_PAGE:
      return {
        ...state,
        pageAbout: action.page
      }

    case SET_IS_GENERAL_FETCHING:
      return {
        ...state,
        isGeneralFetching: action.bol
      }

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
      }

    case SET_BOOKING_CONSULTATION_API_ERROR:
      return {
        ...state,
        bookingConsultationApiError: action.error
      }

    case SET_UPDATE_FAQ_ITEM_API_ERROR:
      return {
        ...state,
        updateFaqItemApiError: action.error
      }

    case SET_UPDATE_SERVICE_API_ERROR:
      return {
        ...state,
        updateFaqItemApiError: action.error
      }

    case SET_UPDATE_PAGE_API_ERROR:
      return {
        ...state,
        updatePageApiError: action.error
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetIsGeneralFetchingAT | SetUpdatePageApiErrorAT | SetUpdateServiceApiErrorAT | SetUpdateFaqItemApiErrorAT |
    SetBookingConsultationApiErrorAT | SetAboutPageAT |
    SetFaqItemsAT | SetServicesAT | SetServiceAT | SetSuccessModalAT;

// action creators

type SetSuccessModalAT = {
  type: typeof SET_SUCCESS_MODAL
  isSuccess: boolean
  text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
  type: SET_SUCCESS_MODAL, isSuccess, text
})

type SetUpdatePageApiErrorAT = {
  type: typeof SET_UPDATE_PAGE_API_ERROR
  error: string | undefined
};

export const setUpdatePageApiErrorAC = (error: string | undefined): SetUpdatePageApiErrorAT => ({
  type: SET_UPDATE_PAGE_API_ERROR, error
});

type SetUpdateServiceApiErrorAT = {
  type: typeof SET_UPDATE_SERVICE_API_ERROR
  error: string | undefined
};

export const setUpdateServiceApiErrorAC = (error: string | undefined): SetUpdateServiceApiErrorAT => ({
  type: SET_UPDATE_SERVICE_API_ERROR, error
});

type SetUpdateFaqItemApiErrorAT = {
  type: typeof SET_UPDATE_FAQ_ITEM_API_ERROR
  error: string | undefined
};

export const setUpdateFaqItemApiErrorAC = (error: string | undefined): SetUpdateFaqItemApiErrorAT => ({
  type: SET_UPDATE_FAQ_ITEM_API_ERROR, error
});

type SetBookingConsultationApiErrorAT = {
  type: typeof  SET_BOOKING_CONSULTATION_API_ERROR
  error: string | undefined
};

export const setBookingConsultationApiErrorAC = (error: string | undefined): SetBookingConsultationApiErrorAT  => ({
  type: SET_BOOKING_CONSULTATION_API_ERROR, error
});

type SetIsGeneralFetchingAT = {
  type: typeof SET_IS_GENERAL_FETCHING
  bol: boolean
};

export const setIsGeneralFetchingAC = (bol: boolean): SetIsGeneralFetchingAT => ({
  type: SET_IS_GENERAL_FETCHING, bol
});

type SetAboutPageAT = {
  type: typeof SET_ABOUT_PAGE,
  page: PageType
};

const setAboutPageAC = (page: PageType): SetAboutPageAT => ({
      type: SET_ABOUT_PAGE, page
});

type SetFaqItemsAT = {
  type: typeof SET_FAQ_ITEMS,
  faqItems: Array<FaqType>
};

const setFaqItems = (faqItems: Array<FaqType>): SetFaqItemsAT => ({
    type: SET_FAQ_ITEMS, faqItems
});

type SetServicesAT = {
  type: typeof SET_SERVICES,
  services: Array<ServiceType>
};

const setServicesAC = (services: Array<ServiceType>): SetServicesAT => ({
    type: SET_SERVICES, services
});

type SetServiceAT = {
  type: typeof SET_SERVICE,
  service: ServiceType
};

export const setServiceAC = (service: ServiceType): SetServiceAT => ({
  type: SET_SERVICE, service
});

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getFaqItems = (): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsGeneralFetchingAC(true));
    let response = await generalSourcesApi.getFaqItems();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
    }
  } catch (e) {
    console.log(e);
    dispatch(setFaqItems(faqItems));
  } finally {
    dispatch(setIsGeneralFetchingAC(false));
  }
}

export const addFaqItem = (values: FaqType): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.addFaqItem(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
      dispatch(setSuccessModalAC(true, FAQ_ADD_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setUpdateFaqItemApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const updateFaqItem = (id: string, values: any): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.updateFaqItem(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
      dispatch(setSuccessModalAC(true, FAQ_UPDATE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setUpdateFaqItemApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const deleteFaqItem = (id: string): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.deleteFaqItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems));
    }
  } catch (e) {
    console.log(e);
  }
}

export const getServices = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsGeneralFetchingAC(true));
    let response = await generalSourcesApi.getServices();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
    }
  } catch (e) {
    console.log(e);
    dispatch(setServicesAC(services));
  } finally {
    dispatch(setIsGeneralFetchingAC(false));
  }
}

export const getAboutPage = (): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsGeneralFetchingAC(true));
    const response = await generalSourcesApi.getAboutPage();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
    dispatch(setAboutPageAC(pages));
  } finally {
    dispatch(setIsGeneralFetchingAC(false));
  }
}

export const editAboutPage = (FormData: FormData): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.editAboutPage(FormData);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
      dispatch(setSuccessModalAC(true, ABOUT_PAGE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setUpdatePageApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const changeAboutPageVisibility = (
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.changeAboutPageVisibility(isActive);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page));
    }
  } catch (e) {
    console.log(e);
  }
}

export const editService = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.editService(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
      dispatch(setSuccessModalAC(true, SERVICE_UPDATE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setUpdateServiceApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e);
  }
}

export const addService = (
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.addService(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
      dispatch(setSuccessModalAC(true, SERVICE_ADD_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setUpdateServiceApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e);
  }
}

export const deleteService = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.deleteService(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServicesAC(response.services));
    }
  } catch (e) {
    console.log(e);
  }
}

export const bookConsultation = (
    values: BookConsultationFormValues
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.bookConsultation(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setBookingConsultationApiErrorAC(''));
      dispatch(setSuccessModalAC(true, BOOKING_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setBookingConsultationApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}
